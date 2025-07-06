import { defineStore } from 'pinia'
import { createEmptyCard, fsrs } from 'ts-fsrs'
import type { Event } from '../entities/YearAssociations'

interface EventsState {
  events: Record<string, Event>
  eventsByYear: Record<string, string[]> // Year -> Event IDs
}

export const useEventsStore = defineStore('events', {
  state: (): EventsState => ({
    events: {},
    eventsByYear: {}
  }),

  getters: {
    /**
     * Get all events for a specific year
     */
    getEventsForYear: (state) => (year: string): Event[] => {
      const eventIds = state.eventsByYear[year] || []
      return eventIds.map(id => state.events[id]).filter(Boolean)
    },

    /**
     * Get all event IDs for a specific year
     */
    getEventIdsForYear: (state) => (year: string): string[] => {
      return state.eventsByYear[year] || []
    },

    /**
     * Get all years that have events
     */
    yearsWithEvents: (state): string[] => {
      return Object.keys(state.eventsByYear).filter(year => 
        state.eventsByYear[year].length > 0
      )
    },

    /**
     * Get total number of events
     */
    totalEvents: (state): number => {
      return Object.keys(state.events).length
    },

    /**
     * Get events that are due for review (eventToYear direction)
     */
    getDueEvents: (state): string[] => {
      const now = new Date()
      console.log('🔍 getDueEvents - checking events:', Object.keys(state.events).length, 'total events')
      
      const dueEvents = Object.entries(state.events)
        .filter(([_, event]) => {
          if (!event.eventToYearLearningData) {
            console.log('❌ Event has no learning data:', event.id, event.content)
            return false
          }
          try {
            const isDue = event.eventToYearLearningData.due <= now
            console.log('📅 Event due check:', event.id, event.content, 'due:', event.eventToYearLearningData.due, 'isDue:', isDue)
            return isDue
          } catch (error) {
            console.error('Error checking due date for event card:', error)
            return false
          }
        })
        .map(([eventId, _]) => eventId)
      
      console.log('✅ getDueEvents result:', dueEvents.length, 'due events')
      return dueEvents
    }
  },

  actions: {
    /**
     * Add a new event to a year
     */
    addEvent(year: string, eventData: Omit<Event, 'id'>): string {
      const id = crypto.randomUUID()
      
      const event: Event = {
        ...eventData,
        id,
        eventToYearLearningData: createEmptyCard() // Due immediately
      }

      // Add event to events store
      this.events[id] = event

      // Add event ID to year's events array
      if (!this.eventsByYear[year]) {
        this.eventsByYear[year] = []
      }
      this.eventsByYear[year].push(id)

      return id
    },

    /**
     * Update an existing event
     */
    updateEvent(id: string, updates: Partial<Omit<Event, 'id'>>) {
      if (!this.events[id]) {
        throw new Error(`Event with ID ${id} not found`)
      }

      // Reset learning data due date to now when event is edited
      const updatedLearningData = createEmptyCard()

      this.events[id] = {
        ...this.events[id],
        ...updates,
        eventToYearLearningData: updatedLearningData
      }
    },

    /**
     * Remove an event
     */
    removeEvent(id: string) {
      if (!this.events[id]) {
        throw new Error(`Event with ID ${id} not found`)
      }

      // Remove from events store
      delete this.events[id]

      // Remove from eventsByYear index
      for (const [year, eventIds] of Object.entries(this.eventsByYear)) {
        const index = eventIds.indexOf(id)
        if (index > -1) {
          eventIds.splice(index, 1)
          // Clean up empty year arrays
          if (eventIds.length === 0) {
            delete this.eventsByYear[year]
          }
          break
        }
      }
    },

    /**
     * Get an event by ID
     */
    getEvent(id: string): Event | undefined {
      return this.events[id]
    },

    /**
     * Update event card with rating
     */
    updateEventCard(id: string, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      const event = this.events[id]
      if (!event) return

      const fsrsGrade = this.mapRatingToFSRS(rating)
      let card = event.eventToYearLearningData
      
      if (!card) {
        card = createEmptyCard()
        event.eventToYearLearningData = card
      }

      try {
        const f = fsrs()
        const now = new Date()
        const result = f.next(card!, now, fsrsGrade)
        event.eventToYearLearningData = result.card
      } catch (error) {
        console.error('Error updating event card with FSRS:', error)
        event.eventToYearLearningData = createEmptyCard()
      }
    },

    /**
     * Map rating string to FSRS grade number
     */
    mapRatingToFSRS(rating: 'wrong' | 'hard' | 'good' | 'easy'): number {
      switch (rating) {
        case 'wrong': return 1 // Again
        case 'hard': return 2  // Hard
        case 'good': return 3  // Good
        case 'easy': return 4  // Easy
        default: return 3      // Good
      }
    },

    /**
     * Clear all events
     */
    clearAll() {
      this.events = {}
      this.eventsByYear = {}
    }
  },

  persist: {
    afterHydrate: (ctx) => {
      // Convert string dates back to Date objects after hydration
      Object.values(ctx.store.events).forEach((event: any) => {
        if (event.eventToYearLearningData?.due && typeof event.eventToYearLearningData.due === 'string') {
          event.eventToYearLearningData.due = new Date(event.eventToYearLearningData.due)
        }
      })
    }
  }
})

import { defineStore } from 'pinia'
import type { Event } from '../entities/YearAssociations'
import { createEmptyCard, fsrs, type Card } from 'ts-fsrs'

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
    }
  },

  actions: {
    /**
     * Add a new event to a year
     */
    addEvent(year: string, eventData: Omit<Event, 'id'>): string {
      const id = crypto.randomUUID()
      const now = new Date()
      
      const event: Event = {
        ...eventData,
        id,
        eventToYearLearningData: createEmptyCard(now)
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

      this.events[id] = {
        ...this.events[id],
        ...updates
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
        card = createEmptyCard(new Date())
        event.eventToYearLearningData = card
      }

      try {
        const f = fsrs()
        const now = new Date()
        const result = f.next(card!, now, fsrsGrade)
        event.eventToYearLearningData = result.card
      } catch (error) {
        console.error('Error updating event card with FSRS:', error)
        event.eventToYearLearningData = createEmptyCard(new Date())
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

  persist: true
})

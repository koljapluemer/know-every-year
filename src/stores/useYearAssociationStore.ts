import { defineStore } from 'pinia'
import type { Year } from '../entities/YearAssociations'
import { createEmptyCard, fsrs, type Card } from 'ts-fsrs'
import { useEventsStore } from './useEventsStore'

interface YearAssociationState {
  years: Record<string, Year>
}

export const useYearAssociationStore = defineStore('yearAssociation', {
  state: (): YearAssociationState => {
    // Initialize with all years from 2025 down to 0 as empty entries
    const years: Record<string, Year> = {}
    
    for (let year = 2025; year >= 0; year--) {
      const yearStr = year === 0 ? '0000' : year.toString()
      years[yearStr] = {
        events: [],
        notes: undefined
      }
    }
    
    return { years }
  },

  getters: {
    /**
     * Get all years that have events
     */
    yearsWithEvents: (state): string[] => {
      const eventsStore = useEventsStore()
      return Object.entries(state.years)
        .filter(([yearStr, _]) => eventsStore.getEventsForYear(yearStr).length > 0)
        .map(([yearStr, _]) => yearStr)
    },

    /**
     * Get all years that have notes
     */
    yearsWithNotes: (state): string[] => {
      return Object.entries(state.years)
        .filter(([_, year]) => year.notes && year.notes.trim() !== '')
        .map(([yearStr, _]) => yearStr)
    },

    /**
     * Get all years that have either events or notes
     */
    yearsWithPegs: (state): string[] => {
      const eventsStore = useEventsStore()
      return Object.entries(state.years)
        .filter(([yearStr, year]) => 
          eventsStore.getEventsForYear(yearStr).length > 0 || (year.notes && year.notes.trim() !== '')
        )
        .map(([yearStr, _]) => yearStr)
    },

    /**
     * Get all years
     */
    allYears: (state): string[] => {
      return Object.keys(state.years).sort((a, b) => {
        const yearA = parseInt(a === '0000' ? '0' : a)
        const yearB = parseInt(b === '0000' ? '0' : b)
        return yearB - yearA // Descending order (2025 to 0)
      })
    },

    /**
     * Get years that are due for review (yearToEvents direction)
     */
    getDueYears: (state): string[] => {
      const now = new Date()
      const eventsStore = useEventsStore()
      return Object.entries(state.years)
        .filter(([_, year]) => {
          if (!year.yearToEventsLearningData) return false
          try {
            return year.yearToEventsLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for year card:', error)
            return false
          }
        })
        .map(([yearStr, _]) => yearStr)
        .filter(year => eventsStore.getEventsForYear(year).length > 0)
    },

    /**
     * Get years that have never been practiced (yearToEvents direction)
     */
    getNewYears: (state): string[] => {
      const eventsStore = useEventsStore()
      return Object.entries(state.years)
        .filter(([_, year]) => !year.yearToEventsLearningData)
        .map(([yearStr, _]) => yearStr)
        .filter(year => eventsStore.getEventsForYear(year).length > 0)
    },

    /**
     * Get years that are eligible for practice (have events and are due or new)
     */
    getEligibleYears: (state): string[] => {
      const now = new Date()
      const eventsStore = useEventsStore()
      
      const dueYears = Object.entries(state.years)
        .filter(([_, year]) => {
          if (!year.yearToEventsLearningData) return false
          try {
            return year.yearToEventsLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for year card:', error)
            return false
          }
        })
        .map(([yearStr, _]) => yearStr)
        .filter(year => eventsStore.getEventsForYear(year).length > 0)
      
      const newYears = Object.entries(state.years)
        .filter(([_, year]) => !year.yearToEventsLearningData)
        .map(([yearStr, _]) => yearStr)
        .filter(year => eventsStore.getEventsForYear(year).length > 0)
      
      // Return combined list (duplicates will be automatically removed)
      return [...dueYears, ...newYears]
    }
  },

  actions: {
    /**
     * Add or update a year
     */
    setYear(year: string, yearData: Partial<Year>) {
      if (!this.years[year]) {
        throw new Error(`Year ${year} not found`)
      }
      
      // Create FSRS card if this is a new year with content
      const existing = this.years[year]
      const hasNewContent = yearData.events?.length || yearData.notes?.trim()
      const hadContent = existing.events.length || (existing.notes && existing.notes.trim())
      
      if (hasNewContent && !hadContent) {
        console.log('Creating new FSRS card for year:', year)
        const now = new Date()
        yearData.yearToEventsLearningData = createEmptyCard(now)
      }
      
      // Merge with existing data
      this.years[year] = {
        ...existing,
        ...yearData
      }
    },

    /**
     * Get a specific year
     */
    getYear(year: string): Year | undefined {
      return this.years[year]
    },

    /**
     * Update year card with rating
     */
    updateYearCard(year: string, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      const yearData = this.years[year]
      if (!yearData) return

      const fsrsGrade = this.mapRatingToFSRS(rating)
      let card = yearData.yearToEventsLearningData
      
      if (!card) {
        card = createEmptyCard(new Date())
        yearData.yearToEventsLearningData = card
      }

      try {
        const f = fsrs()
        const now = new Date()
        const result = f.next(card!, now, fsrsGrade)
        yearData.yearToEventsLearningData = result.card
      } catch (error) {
        console.error('Error updating year card with FSRS:', error)
        yearData.yearToEventsLearningData = createEmptyCard(new Date())
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
     * Clear all years
     */
    clearAll() {
      this.years = {}
      // Reinitialize with empty entries
      for (let year = 2025; year >= 0; year--) {
        const yearStr = year === 0 ? '0000' : year.toString()
        this.years[yearStr] = {
          events: [],
          notes: undefined
        }
      }
    }
  },

  persist: true
})

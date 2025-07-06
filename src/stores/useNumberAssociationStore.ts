import { defineStore } from 'pinia'
import type { NumberAssociation } from '../entities/NumberAssociation'
import { createEmptyCard, fsrs, Grades, type Card, type RecordLog } from 'ts-fsrs'

interface NumberAssociationState {
  associations: Record<string, NumberAssociation>
}

export const useNumberAssociationStore = defineStore('numberAssociation', {
  state: (): NumberAssociationState => ({
    associations: {}
  }),

  getters: {
    /**
     * Get all numbers that have associations
     */
    associatedNumbers: (state): string[] => {
      return Object.keys(state.associations)
    },

    /**
     * Get all numbers that don't have associations yet
     */
    unassociatedNumbers: (state): string[] => {
      const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))
      return allNumbers.filter(num => !state.associations[num])
    },

    /**
     * Get a random number that doesn't have an association yet
     */
    randomUnassociatedNumber: (state): string | null => {
      const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))
      const unassociated = allNumbers.filter(num => !state.associations[num])
      if (unassociated.length === 0) return null
      return unassociated[Math.floor(Math.random() * unassociated.length)]
    },

    /**
     * Get progress count (how many associations completed)
     */
    progressCount: (state): number => {
      return Object.keys(state.associations).length
    },

    /**
     * Get total count (always 100)
     */
    totalCount: (): number => {
      return 100
    },

    /**
     * Get numbers that are due for review (numberToWord direction)
     */
    getDueNumbers: (state): string[] => {
      const now = new Date()
      return Object.entries(state.associations)
        .filter(([_, association]) => {
          if (!association.numberToWordLearningData) return false
          try {
            return association.numberToWordLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for card:', error)
            return false
          }
        })
        .map(([number, _]) => number)
    },

    /**
     * Get numbers that have never been practiced (numberToWord direction)
     */
    getNewNumbers: (state): string[] => {
      return Object.entries(state.associations)
        .filter(([_, association]) => !association.numberToWordLearningData)
        .map(([number, _]) => number)
    },

    /**
     * Get words that are due for review (wordToNumber direction)
     */
    getDueWords: (state): string[] => {
      const now = new Date()
      return Object.entries(state.associations)
        .filter(([_, association]) => {
          if (!association.wordToNumberLearningData) return false
          try {
            return association.wordToNumberLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for word card:', error)
            return false
          }
        })
        .map(([number, _]) => number)
    },

    /**
     * Get words that have never been practiced (wordToNumber direction)
     */
    getNewWords: (state): string[] => {
      return Object.entries(state.associations)
        .filter(([_, association]) => !association.wordToNumberLearningData)
        .map(([number, _]) => number)
    }
  },

  actions: {
    /**
     * Add or update a number association
     */
    setAssociation(number: string, association: NumberAssociation) {
      if (!/^[0-9]{2}$/.test(number)) {
        throw new Error('Number must be a two-digit string (00-99)')
      }
      association.numberToWordLearningData = createEmptyCard()
      association.wordToNumberLearningData = createEmptyCard()
      this.associations[number] = association
    },

    /**
     * Get a specific number association
     */
    getAssociation(number: string): NumberAssociation | undefined {
      return this.associations[number]
    },

    /**
     * Remove a number association
     */
    removeAssociation(number: string) {
      delete this.associations[number]
    },

    /**
     * Check if a number has an association
     */
    hasAssociation(number: string): boolean {
      return number in this.associations
    },

    /**
     * Clear all associations
     */
    clearAll() {
      this.associations = {}
    },

    /**
     * Update association (reset due)
     */
    updateAssociation(number: string, updates: Partial<NumberAssociation>) {
      if (!this.associations[number]) {
        throw new Error(`Association for number ${number} not found`)
      }
      this.associations[number] = {
        ...this.associations[number],
        ...updates,
        numberToWordLearningData: createEmptyCard(),
        wordToNumberLearningData: createEmptyCard()
      }
    },

    /**
     * Update card with rating (numberToWord direction)
     */
    updateCard(number: string, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating card for number:', number, 'with rating:', rating)
      
      const association = this.associations[number]
      if (!association) {
        console.error('Association not found for number:', number)
        return
      }

      // Map rating to FSRS Grade
      const fsrsGrade = this.mapRatingToFSRS(rating)
      console.log('Mapped to FSRS grade:', fsrsGrade)
      
      // Get or create card
      let card = association.numberToWordLearningData
      if (!card) {
        console.warn('Card missing for number:', number, '- creating new card')
        card = createEmptyCard()
        association.numberToWordLearningData = card
      }

      // Ensure card is not undefined
      if (!card) {
        console.error('Failed to create card for number:', number)
        return
      }

      console.log('Original card:', card)

      try {
        // Create FSRS instance with default parameters
        const f = fsrs()
        const now = new Date()
        
        // Use the next method for ts-fsrs >=4.0.0
        const result = f.next(card, now, fsrsGrade)
        
        console.log('FSRS result:', result)
        
        // Update the card
        association.numberToWordLearningData = result.card
        
        console.log('Updated card:', result.card)
        
      } catch (error) {
        console.error('Error updating card with FSRS:', error)
        // Recreate card on error
        association.numberToWordLearningData = createEmptyCard()
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
     * Get a random exercise for practice (due or new, either direction)
     */
    getRandomPracticeExercise(): { number: string; direction: 'numberToWord' | 'wordToNumber' } | null {
      const dueNumbers = this.getDueNumbers
      const newNumbers = this.getNewNumbers
      const dueWords = this.getDueWords
      const newWords = this.getNewWords
      
      // Combine all available exercises
      const availableExercises: Array<{ number: string; direction: 'numberToWord' | 'wordToNumber' }> = []
      
      // Add number-to-word exercises
      dueNumbers.forEach(number => {
        availableExercises.push({ number, direction: 'numberToWord' })
      })
      newNumbers.forEach(number => {
        availableExercises.push({ number, direction: 'numberToWord' })
      })
      
      // Add word-to-number exercises
      dueWords.forEach(number => {
        availableExercises.push({ number, direction: 'wordToNumber' })
      })
      newWords.forEach(number => {
        availableExercises.push({ number, direction: 'wordToNumber' })
      })
      
      if (availableExercises.length === 0) {
        return null
      }
      
      const randomIndex = Math.floor(Math.random() * availableExercises.length)
      return availableExercises[randomIndex]
    },

    /**
     * Update card with rating (wordToNumber direction)
     */
    updateWordCard(number: string, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating word card for number:', number, 'with rating:', rating)
      
      const association = this.associations[number]
      if (!association) {
        console.error('Association not found for number:', number)
        return
      }

      // Map rating to FSRS Grade
      const fsrsGrade = this.mapRatingToFSRS(rating)
      console.log('Mapped to FSRS grade:', fsrsGrade)
      
      // Get or create card
      let card = association.wordToNumberLearningData
      if (!card) {
        console.warn('Word card missing for number:', number, '- creating new card')
        card = createEmptyCard()
        association.wordToNumberLearningData = card
      }

      // Ensure card is not undefined
      if (!card) {
        console.error('Failed to create word card for number:', number)
        return
      }

      console.log('Original word card:', card)

      try {
        // Create FSRS instance with default parameters
        const f = fsrs()
        const now = new Date()
        
        // Use the next method for ts-fsrs >=4.0.0
        const result = f.next(card, now, fsrsGrade)
        
        console.log('FSRS word result:', result)
        
        // Update the card
        association.wordToNumberLearningData = result.card
        
        console.log('Updated word card:', result.card)
        
      } catch (error) {
        console.error('Error updating word card with FSRS:', error)
        // Recreate card on error
        association.wordToNumberLearningData = createEmptyCard()
      }
    }
  },

  persist: true
})

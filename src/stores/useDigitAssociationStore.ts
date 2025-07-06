import { defineStore } from 'pinia'
import type { DigitAssociation } from '../entities/DigitAssociation'
import { createEmptyCard, fsrs } from 'ts-fsrs'

interface DigitAssociationState {
  associations: Record<number, DigitAssociation>
  ignoredSounds: DigitAssociation
}

export const useDigitAssociationStore = defineStore('digitAssociation', {
  state: (): DigitAssociationState => ({
    associations: {
      0: { sounds: ['s', 'z', 'soft c'], notes: 'z is the first letter of zero. The other letters have a similar sound.', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      1: { sounds: ['t', 'd'], notes: 'd & t have one downstroke and sound similar (some people include th here)', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      2: { sounds: ['n'], notes: 'n looks something like 2 on its side and has 2 downstrokes', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      3: { sounds: ['m'], notes: 'M looks like a 3 on its side and has three downstrokes', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      4: { sounds: ['r'], notes: '4 and R are almost mirror images of each other, R is the last letter of "fouR"', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      5: { sounds: ['l'], notes: 'L is the Roman Numeral for 50', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      6: { sounds: ['sh', 'soft ch', 'j', 'soft g', 'zh'], notes: 'g looks like an upside-down 6, cursive j looks kind of like a 6', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      7: { sounds: ['k', 'hard c', 'hard g', 'hard ch', 'q', 'qu'], notes: 'capital K looks like two sevens stuck together', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      8: { sounds: ['f', 'v'], notes: 'cursive f looks like 8, v is a vocalize f (some people include th here)', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() },
      9: { sounds: ['p', 'b'], notes: 'P looks like a mirror-image of 9. b sounds similar look like a rotated 9', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() }
    },
    ignoredSounds: { sounds: ['Vowel sounds', 'w', 'h', 'y'], notes: 'These sounds are ignored in the traditional Major System', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() }
  }),

  getters: {
    /**
     * Get all sounds across all digits (excluding ignored sounds)
     */
    allSounds: (state): string[] => {
      return Object.values(state.associations).flatMap(association => association.sounds)
    },

    /**
     * Get all sounds including ignored sounds
     */
    allSoundsIncludingIgnored: (state): string[] => {
      const allSounds = Object.values(state.associations).flatMap(association => association.sounds)
      return [...allSounds, ...state.ignoredSounds.sounds]
    },

    /**
     * Find which digit a sound is associated with
     */
    getDigitForSound: (state) => (sound: string): number | null => {
      for (const [digit, association] of Object.entries(state.associations)) {
        if (association.sounds.includes(sound)) {
          return parseInt(digit)
        }
      }
      return null
    },

    /**
     * Check if a sound is ignored
     */
    isSoundIgnored: (state) => (sound: string): boolean => {
      return state.ignoredSounds.sounds.includes(sound)
    },

    /**
     * Get digits that are due for review (numberToSound direction)
     */
    getDueDigits: (state): number[] => {
      const now = new Date()
      return Object.entries(state.associations)
        .filter(([, association]) => {
          if (!association.numberToSoundLearningData) return false
          try {
            return association.numberToSoundLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for card:', error)
            return false
          }
        })
        .map(([digit, _]) => parseInt(digit))
    },

    /**
     * Get digits that have never been practiced (numberToSound direction)
     */
    getNewDigits: (state): number[] => {
      return Object.entries(state.associations)
        .filter(([, association]) => !association.numberToSoundLearningData)
        .map(([digit, _]) => parseInt(digit))
    },

    /**
     * Get sounds that are due for review (soundToNumber direction)
     */
    getDueSounds: (state): number[] => {
      const now = new Date()
      return Object.entries(state.associations)
        .filter(([, association]) => {
          if (!association.soundToNumberLearningData) return false
          try {
            return association.soundToNumberLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for sound card:', error)
            return false
          }
        })
        .map(([digit, _]) => parseInt(digit))
    },

    /**
     * Get sounds that have never been practiced (soundToNumber direction)
     */
    getNewSounds: (state): number[] => {
      return Object.entries(state.associations)
        .filter(([, association]) => !association.soundToNumberLearningData)
        .map(([digit, _]) => parseInt(digit))
    }
  },

  actions: {
    /**
     * Add or update a digit association
     */
    setAssociation(digit: number, association: DigitAssociation) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }
      this.associations[digit] = association
    },

    /**
     * Get a specific digit association
     */
    getAssociation(digit: number): DigitAssociation | undefined {
      return this.associations[digit]
    },

    /**
     * Remove a digit association
     */
    removeAssociation(digit: number) {
      delete this.associations[digit]
    },

    /**
     * Check if a digit has an association
     */
    hasAssociation(digit: number): boolean {
      return digit in this.associations
    },

    /**
     * Clear all associations
     */
    clearAll() {
      this.associations = {}
    },

    /**
     * Update digit sounds
     */
    updateDigitSounds(digit: number, sounds: string[]) {
      if (!this.associations[digit]) {
        throw new Error(`Association for digit ${digit} not found`)
      }
      this.associations[digit].sounds = sounds
    },

    /**
     * Update digit notes
     */
    updateDigitNotes(digit: number, notes: string) {
      if (!this.associations[digit]) {
        throw new Error(`Association for digit ${digit} not found`)
      }
      this.associations[digit].notes = notes
    },

    /**
     * Add an ignored sound
     */
    addIgnoredSound(sound: string) {
      if (!this.ignoredSounds.sounds.includes(sound)) {
        this.ignoredSounds.sounds.push(sound)
      }
    },

    /**
     * Remove an ignored sound
     */
    removeIgnoredSound(sound: string) {
      const index = this.ignoredSounds.sounds.indexOf(sound)
      if (index > -1) {
        this.ignoredSounds.sounds.splice(index, 1)
      }
    },

    /**
     * Update ignored sounds notes
     */
    updateIgnoredSoundsNotes(notes: string) {
      this.ignoredSounds.notes = notes
    },

    /**
     * Update card with rating (numberToSound direction)
     */
    updateCard(digit: number, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating card for digit:', digit, 'with rating:', rating)
      
      const association = this.associations[digit]
      if (!association) {
        console.error('Association not found for digit:', digit)
        return
      }

      // Map rating to FSRS Grade
      const fsrsGrade = this.mapRatingToFSRS(rating)
      console.log('Mapped to FSRS grade:', fsrsGrade)
      
      // Get or create card
      let card = association.numberToSoundLearningData
      if (!card) {
        console.warn('Card missing for digit:', digit, '- creating new card')
        card = createEmptyCard()
        association.numberToSoundLearningData = card
      }

      // Ensure card is not undefined
      if (!card) {
        console.error('Failed to create card for digit:', digit)
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
        association.numberToSoundLearningData = result.card
        
        console.log('Updated card:', result.card)
        
      } catch (error) {
        console.error('Error updating card with FSRS:', error)
        // Recreate card on error
        association.numberToSoundLearningData = createEmptyCard()
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
    getRandomPracticeExercise(): { digit: number; direction: 'numberToSound' | 'soundToNumber' } | null {
      const dueDigits = this.getDueDigits
      const newDigits = this.getNewDigits
      const dueSounds = this.getDueSounds
      const newSounds = this.getNewSounds
      
      // Combine all available exercises
      const availableExercises: Array<{ digit: number; direction: 'numberToSound' | 'soundToNumber' }> = []
      
      // Add number-to-sound exercises
      dueDigits.forEach(digit => {
        availableExercises.push({ digit, direction: 'numberToSound' })
      })
      newDigits.forEach(digit => {
        availableExercises.push({ digit, direction: 'numberToSound' })
      })
      
      // Add sound-to-number exercises
      dueSounds.forEach(digit => {
        availableExercises.push({ digit, direction: 'soundToNumber' })
      })
      newSounds.forEach(digit => {
        availableExercises.push({ digit, direction: 'soundToNumber' })
      })
      
      if (availableExercises.length === 0) {
        return null
      }
      
      const randomIndex = Math.floor(Math.random() * availableExercises.length)
      return availableExercises[randomIndex]
    },

    /**
     * Update card with rating (soundToNumber direction)
     */
    updateSoundCard(digit: number, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating sound card for digit:', digit, 'with rating:', rating)
      
      const association = this.associations[digit]
      if (!association) {
        console.error('Association not found for digit:', digit)
        return
      }

      // Map rating to FSRS Grade
      const fsrsGrade = this.mapRatingToFSRS(rating)
      console.log('Mapped to FSRS grade:', fsrsGrade)
      
      // Get or create card
      let card = association.soundToNumberLearningData
      if (!card) {
        console.warn('Sound card missing for digit:', digit, '- creating new card')
        card = createEmptyCard()
        association.soundToNumberLearningData = card
      }

      // Ensure card is not undefined
      if (!card) {
        console.error('Failed to create sound card for digit:', digit)
        return
      }

      console.log('Original sound card:', card)

      try {
        // Create FSRS instance with default parameters
        const f = fsrs()
        const now = new Date()
        
        // Use the next method for ts-fsrs >=4.0.0
        const result = f.next(card, now, fsrsGrade)
        
        console.log('FSRS sound result:', result)
        
        // Update the card
        association.soundToNumberLearningData = result.card
        
        console.log('Updated sound card:', result.card)
        
      } catch (error) {
        console.error('Error updating sound card with FSRS:', error)
        // Recreate card on error
        association.soundToNumberLearningData = createEmptyCard()
      }
    }
  },

  persist: {
    afterHydrate: (ctx) => {
      // Convert string dates back to Date objects after hydration
      Object.values(ctx.store.associations).forEach((association: any) => {
        if (association.numberToSoundLearningData?.due && typeof association.numberToSoundLearningData.due === 'string') {
          association.numberToSoundLearningData.due = new Date(association.numberToSoundLearningData.due)
        }
        if (association.soundToNumberLearningData?.due && typeof association.soundToNumberLearningData.due === 'string') {
          association.soundToNumberLearningData.due = new Date(association.soundToNumberLearningData.due)
        }
      })
      
      // Handle ignored sounds
      if (ctx.store.ignoredSounds?.numberToSoundLearningData?.due && typeof ctx.store.ignoredSounds.numberToSoundLearningData.due === 'string') {
        ctx.store.ignoredSounds.numberToSoundLearningData.due = new Date(ctx.store.ignoredSounds.numberToSoundLearningData.due)
      }
      if (ctx.store.ignoredSounds?.soundToNumberLearningData?.due && typeof ctx.store.ignoredSounds.soundToNumberLearningData.due === 'string') {
        ctx.store.ignoredSounds.soundToNumberLearningData.due = new Date(ctx.store.ignoredSounds.soundToNumberLearningData.due)
      }
    }
  }
})

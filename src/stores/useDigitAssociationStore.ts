import { defineStore } from 'pinia'
import type { DigitAssociation } from '../entities/DigitAssociation'
import { createEmptyCard, fsrs, type Card } from 'ts-fsrs'

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
        .filter(([digit, association]) => {
          if (!association.numberToSoundLearningData) return false
          try {
            return association.numberToSoundLearningData.due <= now
          } catch (error) {
            console.error('Error checking due date for digit card:', error)
            return false
          }
        })
        .map(([digit, _]) => parseInt(digit))
    },

    /**
     * Get sounds that are due for review (soundToNumber direction)
     */
    getDueSounds: (state): string[] => {
      const now = new Date()
      const dueSounds: string[] = []
      Object.entries(state.associations).forEach(([digit, association]) => {
        if (association.soundToNumberLearningData) {
          try {
            if (association.soundToNumberLearningData.due <= now) {
              dueSounds.push(...association.sounds)
            }
          } catch (error) {
            console.error('Error checking due date for sound card:', error)
          }
        }
      })
      return dueSounds
    }
  },

  actions: {
    /**
     * Add or update a digit association
     */
    setDigitAssociation(digit: number, association: DigitAssociation) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }
      association.numberToSoundLearningData = createEmptyCard()
      association.soundToNumberLearningData = createEmptyCard()
      this.associations[digit] = association
    },

    /**
     * Update all sounds for a digit (reset due)
     */
    updateDigitSounds(digit: number, sounds: string[], notes?: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }
      this.associations[digit] = {
        sounds,
        notes,
        numberToSoundLearningData: createEmptyCard(),
        soundToNumberLearningData: createEmptyCard()
      }
    },

    /**
     * Update notes for a digit (reset due)
     */
    updateDigitNotes(digit: number, notes: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }
      const association = this.associations[digit] || { sounds: [] }
      this.associations[digit] = {
        ...association,
        notes,
        numberToSoundLearningData: createEmptyCard(),
        soundToNumberLearningData: createEmptyCard()
      }
    },

    /**
     * Remove a digit association entirely
     */
    removeDigit(digit: number) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }

      delete this.associations[digit]
    },

    /**
     * Add a sound to ignored sounds
     */
    addIgnoredSound(sound: string, notes?: string) {
      if (!this.ignoredSounds.sounds.includes(sound)) {
        this.ignoredSounds.sounds.push(sound)
      }

      if (notes && !this.ignoredSounds.notes) {
        this.ignoredSounds.notes = notes
      }
    },

    /**
     * Remove a sound from ignored sounds
     */
    removeIgnoredSound(sound: string) {
      this.ignoredSounds.sounds = this.ignoredSounds.sounds.filter((s: string) => s !== sound)
    },

    /**
     * Update ignored sounds notes
     */
    updateIgnoredSoundsNotes(notes: string) {
      this.ignoredSounds.notes = notes
    },

    /**
     * Reset to default Major System data
     */
    resetToDefaults() {
      this.associations = {
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
      }
      this.ignoredSounds = { sounds: ['Vowel sounds', 'w', 'h', 'y'], notes: 'These sounds are ignored in the traditional Major System', numberToSoundLearningData: createEmptyCard(), soundToNumberLearningData: createEmptyCard() }
    },

    /**
     * Update digit card with rating (numberToSound direction)
     */
    updateDigitCard(digit: number, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating digit card for digit:', digit, 'with rating:', rating)
      
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
        console.warn('Digit card missing for digit:', digit, '- creating new card')
        card = createEmptyCard()
        association.numberToSoundLearningData = card
      }

      // Ensure card is not undefined
      if (!card) {
        console.error('Failed to create digit card for digit:', digit)
        return
      }

      console.log('Original digit card:', card)

      try {
        // Create FSRS instance with default parameters
        const f = fsrs()
        const now = new Date()
        
        // Use the next method for ts-fsrs >=4.0.0
        const result = f.next(card, now, fsrsGrade)
        
        console.log('FSRS digit result:', result)
        
        // Update the card
        association.numberToSoundLearningData = result.card
        
        console.log('Updated digit card:', result.card)
        
      } catch (error) {
        console.error('Error updating digit card with FSRS:', error)
        // Recreate card on error
        association.numberToSoundLearningData = createEmptyCard()
      }
    },

    /**
     * Update sound card with rating (soundToNumber direction)
     */
    updateSoundCard(sound: string, rating: 'wrong' | 'hard' | 'good' | 'easy') {
      console.log('Updating sound card for sound:', sound, 'with rating:', rating)
      
      // Find which digit this sound belongs to
      const digit = this.getDigitForSound(sound)
      if (digit === null) {
        console.error('Sound not found in any digit association:', sound)
        return
      }

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

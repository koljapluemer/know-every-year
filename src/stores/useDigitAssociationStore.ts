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
      0: { sounds: ['s', 'z', 'soft c'], notes: 'z is the first letter of zero. The other letters have a similar sound.' },
      1: { sounds: ['t', 'd'], notes: 'd & t have one downstroke and sound similar (some people include th here)' },
      2: { sounds: ['n'], notes: 'n looks something like 2 on its side and has 2 downstrokes' },
      3: { sounds: ['m'], notes: 'M looks like a 3 on its side and has three downstrokes' },
      4: { sounds: ['r'], notes: '4 and R are almost mirror images of each other, R is the last letter of "fouR"' },
      5: { sounds: ['l'], notes: 'L is the Roman Numeral for 50' },
      6: { sounds: ['sh', 'soft ch', 'j', 'soft g', 'zh'], notes: 'g looks like an upside-down 6, cursive j looks kind of like a 6' },
      7: { sounds: ['k', 'hard c', 'hard g', 'hard ch', 'q', 'qu'], notes: 'capital K looks like two sevens stuck together' },
      8: { sounds: ['f', 'v'], notes: 'cursive f looks like 8, v is a vocalize f (some people include th here)' },
      9: { sounds: ['p', 'b'], notes: 'P looks like a mirror-image of 9. b sounds similar look like a rotated 9' }
    },
    ignoredSounds: { sounds: ['Vowel sounds', 'w', 'h', 'y'], notes: 'These sounds are ignored in the traditional Major System' }
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
     * Get digits that have never been practiced (numberToSound direction)
     */
    getNewDigits: (state): number[] => {
      return Object.entries(state.associations)
        .filter(([_, association]) => !association.numberToSoundLearningData)
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
              // Add all sounds for this digit since they share the same card
              dueSounds.push(...association.sounds)
            }
          } catch (error) {
            console.error('Error checking due date for sound card:', error)
          }
        }
      })
      
      return dueSounds
    },

    /**
     * Get sounds that have never been practiced (soundToNumber direction)
     */
    getNewSounds: (state): string[] => {
      const newSounds: string[] = []
      
      Object.entries(state.associations).forEach(([digit, association]) => {
        if (!association.soundToNumberLearningData) {
          // Add all sounds for this digit since they share the same card
          newSounds.push(...association.sounds)
        }
      })
      
      return newSounds
    }
  },

  actions: {
    /**
     * Add a sound to a specific digit
     */
    addSoundToDigit(digit: number, sound: string, notes?: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }

      if (!this.associations[digit]) {
        this.associations[digit] = { sounds: [], notes }
      }

      if (!this.associations[digit].sounds.includes(sound)) {
        this.associations[digit].sounds.push(sound)
      }

      if (notes && !this.associations[digit].notes) {
        this.associations[digit].notes = notes
      }
    },

    /**
     * Remove a sound from a specific digit
     */
    removeSoundFromDigit(digit: number, sound: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }

      if (this.associations[digit]) {
        this.associations[digit].sounds = this.associations[digit].sounds.filter((s: string) => s !== sound)
      }
    },

    /**
     * Update all sounds for a digit
     */
    updateDigitSounds(digit: number, sounds: string[], notes?: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }

      this.associations[digit] = { sounds, notes }
    },

    /**
     * Update notes for a digit
     */
    updateDigitNotes(digit: number, notes: string) {
      if (digit < 0 || digit > 9) {
        throw new Error('Digit must be between 0 and 9')
      }

      if (!this.associations[digit]) {
        this.associations[digit] = { sounds: [] }
      }

      this.associations[digit].notes = notes
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
        0: { sounds: ['s', 'z', 'soft c'], notes: 'z is the first letter of zero. The other letters have a similar sound.' },
        1: { sounds: ['t', 'd'], notes: 'd & t have one downstroke and sound similar (some people include th here)' },
        2: { sounds: ['n'], notes: 'n looks something like 2 on its side and has 2 downstrokes' },
        3: { sounds: ['m'], notes: 'M looks like a 3 on its side and has three downstrokes' },
        4: { sounds: ['r'], notes: '4 and R are almost mirror images of each other, R is the last letter of "fouR"' },
        5: { sounds: ['l'], notes: 'L is the Roman Numeral for 50' },
        6: { sounds: ['sh', 'soft ch', 'j', 'soft g', 'zh'], notes: 'g looks like an upside-down 6, cursive j looks kind of like a 6' },
        7: { sounds: ['k', 'hard c', 'hard g', 'hard ch', 'q', 'qu'], notes: 'capital K looks like two sevens stuck together' },
        8: { sounds: ['f', 'v'], notes: 'cursive f looks like 8, v is a vocalize f (some people include th here)' },
        9: { sounds: ['p', 'b'], notes: 'P looks like a mirror-image of 9. b sounds similar look like a rotated 9' }
      }
      this.ignoredSounds = { sounds: ['Vowel sounds', 'w', 'h', 'y'], notes: 'These sounds are ignored in the traditional Major System' }
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
        card = createEmptyCard(new Date())
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
        association.numberToSoundLearningData = createEmptyCard(new Date())
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
        card = createEmptyCard(new Date())
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
        association.soundToNumberLearningData = createEmptyCard(new Date())
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

  persist: true
})

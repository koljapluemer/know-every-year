import { defineStore } from 'pinia'
import type { DigitAssociation } from '../entities/DigitAssociation'

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
    }
  },

  persist: true
})

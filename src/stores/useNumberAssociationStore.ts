import { defineStore } from 'pinia'
import type { NumberAssociation } from '../entities/NumberAssociation'

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
    }
  },

  actions: {
    /**
     * Add or update a number association
     */
    setAssociation(number: string, association: NumberAssociation) {
      if (!/^\d{2}$/.test(number)) {
        throw new Error('Number must be a two-digit string (00-99)')
      }
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
    }
  },

  persist: true
})

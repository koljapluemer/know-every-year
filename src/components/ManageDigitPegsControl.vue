<template>
  <ManageDigitPegsRender
    :digit-associations="digitAssociations"
    :ignored-sounds="ignoredSounds"
    :ignored-sounds-notes="ignoredSoundsNotes"
    @update-sounds="handleUpdateSounds"
    @update-notes="handleUpdateNotes"
    @reset-learning-data="handleResetLearningData"
    @update-ignored-sounds="handleUpdateIgnoredSounds"
    @update-ignored-sounds-notes="handleUpdateIgnoredSoundsNotes"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useToast } from '../ui/useToast'
import ManageDigitPegsRender from './ManageDigitPegsRender.vue'

const digitAssociationStore = useDigitAssociationStore()
const { success, error } = useToast()

const digitAssociations = computed(() => digitAssociationStore.associations)
const ignoredSounds = computed(() => digitAssociationStore.ignoredSounds.sounds)
const ignoredSoundsNotes = computed(() => digitAssociationStore.ignoredSounds.notes)

const handleUpdateSounds = (digit: number, sounds: string[]) => {
  try {
    digitAssociationStore.updateDigitSounds(digit, sounds)
    success(`Updated sounds for digit ${digit}`)
  } catch (err) {
    error(`Failed to update sounds for digit ${digit}`)
  }
}

const handleUpdateNotes = (digit: number, notes: string) => {
  try {
    digitAssociationStore.updateDigitNotes(digit, notes)
    success(`Updated notes for digit ${digit}`)
  } catch (err) {
    error(`Failed to update notes for digit ${digit}`)
  }
}

const handleResetLearningData = (digit: number) => {
  try {
    // Clear both learning data cards for this digit
    const association = digitAssociationStore.associations[digit]
    if (association) {
      association.numberToSoundLearningData = undefined
      association.soundToNumberLearningData = undefined
    }
    success(`Reset learning data for digit ${digit}`)
  } catch (err) {
    error(`Failed to reset learning data for digit ${digit}`)
  }
}

const handleUpdateIgnoredSounds = (sounds: string[]) => {
  try {
    // Clear existing ignored sounds and add new ones
    digitAssociationStore.ignoredSounds.sounds = []
    sounds.forEach(sound => {
      digitAssociationStore.addIgnoredSound(sound)
    })
    success('Updated ignored sounds')
  } catch (err) {
    error('Failed to update ignored sounds')
  }
}

const handleUpdateIgnoredSoundsNotes = (notes: string) => {
  try {
    digitAssociationStore.updateIgnoredSoundsNotes(notes)
    success('Updated ignored sounds notes')
  } catch (err) {
    error('Failed to update ignored sounds notes')
  }
}
</script>

<template>
  <FormRenderNumberAssociation
    :number="number"
    :firstDigit="firstDigit"
    :secondDigit="secondDigit"
    :firstDigitAssociation="firstDigitAssociation"
    :secondDigitAssociation="secondDigitAssociation"
    :prefillData="prefillData"
    :ignoredSounds="ignoredSounds"
    @form-validity-changed="handleFormValidityChanged"
    @form-changed="handleFormChanged"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { createEmptyCard } from 'ts-fsrs'
import { useDigitAssociationStore } from '@/stores/useDigitAssociationStore'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import { useToast } from '@/ui/useToast'
import FormRenderNumberAssociation from '@/components/forms/render/FormRenderNumberAssociation.vue'

interface Props {
  number: string
  prefillData?: { word: string; notes: string } | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'form-validity-changed': [valid: boolean]
}>()

const digitAssociationStore = useDigitAssociationStore()
const numberAssociationStore = useNumberAssociationStore()
const { success } = useToast()

const firstDigit = computed(() => parseInt(props.number[0]))
const secondDigit = computed(() => parseInt(props.number[1]))

const firstDigitAssociation = computed(() => digitAssociationStore.associations[firstDigit.value])
const secondDigitAssociation = computed(() => digitAssociationStore.associations[secondDigit.value])

const ignoredSounds = computed(() => digitAssociationStore.ignoredSounds.sounds)

const prefillData = computed(() => {
  // Use provided prefill data or get from store
  if (props.prefillData) {
    return props.prefillData
  }
  const existing = numberAssociationStore.getAssociation(props.number)
  return existing ? {
    word: existing.word,
    notes: existing.notes || ''
  } : null
})

// Debouncing
let saveTimeout: number | null = null

const handleFormValidityChanged = (valid: boolean) => {
  emit('form-validity-changed', valid)
}

const handleFormChanged = (form: { word: string; notes: string }) => {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // Auto-save with debounce if form is valid
  if (form.word.trim().length > 0) {
    saveTimeout = setTimeout(() => {
      const existingAssociation = numberAssociationStore.getAssociation(props.number)
      
      if (existingAssociation) {
        // Update existing association
        numberAssociationStore.updateAssociation(props.number, {
          word: form.word.trim(),
          notes: form.notes.trim() || undefined
        })
      } else {
        // Create new association with required learning data
        const association = {
          word: form.word.trim(),
          notes: form.notes.trim() || undefined,
          numberToWordLearningData: createEmptyCard(),
          wordToNumberLearningData: createEmptyCard()
        }
        numberAssociationStore.setAssociation(props.number, association)
      }
      
      success(`Association for ${props.number} saved automatically!`)
    }, 500)
  }
}

// Clean up timeout on unmount
watch(() => props.number, () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
    saveTimeout = null
  }
})
</script>

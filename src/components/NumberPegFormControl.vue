<template>
  <NumberPegFormRender
    :number="number"
    :firstDigit="firstDigit"
    :secondDigit="secondDigit"
    :firstDigitAssociation="firstDigitAssociation"
    :secondDigitAssociation="secondDigitAssociation"
    :prefillData="prefillData"
    @form-validity-changed="handleFormValidityChanged"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberPegFormRender from './NumberPegFormRender.vue'

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

const firstDigit = computed(() => parseInt(props.number[0]))
const secondDigit = computed(() => parseInt(props.number[1]))

const firstDigitAssociation = computed(() => digitAssociationStore.associations[firstDigit.value])
const secondDigitAssociation = computed(() => digitAssociationStore.associations[secondDigit.value])

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

const handleFormValidityChanged = (valid: boolean) => {
  emit('form-validity-changed', valid)
}
</script>

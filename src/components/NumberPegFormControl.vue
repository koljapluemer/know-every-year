<template>
  <NumberPegFormRender
    :number="number"
    :firstDigit="firstDigit"
    :secondDigit="secondDigit"
    :firstDigitAssociation="firstDigitAssociation"
    :secondDigitAssociation="secondDigitAssociation"
    :prefillData="prefillData"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberPegFormRender from './NumberPegFormRender.vue'
import { useToast } from '../ui/useToast'

interface Props {
  number: string
  prefillData?: { word: string; notes: string } | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
}>()

const digitAssociationStore = useDigitAssociationStore()
const numberAssociationStore = useNumberAssociationStore()
const { success } = useToast()

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

const handleSave = (association: { word: string; notes?: string }) => {
  numberAssociationStore.setAssociation(props.number, association)
  success(`Association for ${props.number} saved successfully!`)
  emit('saved')
}
</script>

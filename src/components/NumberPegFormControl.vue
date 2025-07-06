<template>
  <NumberPegFormRender
    :number="number"
    :firstDigit="firstDigit"
    :secondDigit="secondDigit"
    :firstDigitAssociation="firstDigitAssociation"
    :secondDigitAssociation="secondDigitAssociation"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberPegFormRender from './NumberPegFormRender.vue'

interface Props {
  number: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
}>()

const digitAssociationStore = useDigitAssociationStore()
const numberAssociationStore = useNumberAssociationStore()

const firstDigit = computed(() => parseInt(props.number[0]))
const secondDigit = computed(() => parseInt(props.number[1]))

const firstDigitAssociation = computed(() => digitAssociationStore.associations[firstDigit.value])
const secondDigitAssociation = computed(() => digitAssociationStore.associations[secondDigit.value])

const handleSave = (association: { word: string; notes?: string }) => {
  numberAssociationStore.setAssociation(props.number, association)
  emit('saved')
}
</script>

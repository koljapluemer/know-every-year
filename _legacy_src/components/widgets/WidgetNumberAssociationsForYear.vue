<template>
  <div class="flex items-center gap-4">
    <div class="text-5xl">
      {{ firstNumberAssociation || '?' }}
    </div>
    <span class="text-5xl">+</span>
    <div class="text-5xl">
      {{ secondNumberAssociation || '?' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'

interface Props {
  year: string
}

const props = defineProps<Props>()
const numberAssociationStore = useNumberAssociationStore()

const firstDigitStr = computed(() => {
  const yearNum = parseInt(props.year === '0000' ? '0' : props.year)
  return Math.floor(yearNum / 100).toString().padStart(2, '0')
})

const secondDigitStr = computed(() => {
  const yearNum = parseInt(props.year === '0000' ? '0' : props.year)
  return (yearNum % 100).toString().padStart(2, '0')
})

const firstNumberAssociation = computed(() => {
  const numberAssoc = numberAssociationStore.getAssociation(firstDigitStr.value)
  return numberAssoc?.word || null
})

const secondNumberAssociation = computed(() => {
  const numberAssoc = numberAssociationStore.getAssociation(secondDigitStr.value)
  return numberAssoc?.word || null
})
</script>

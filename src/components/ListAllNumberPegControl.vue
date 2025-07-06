<template>
  <ListNumberPegRender 
    :associations="allAssociations"
    :progress="progress"
    :total="total"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import ListNumberPegRender from './ListNumberPegRender.vue'

const numberAssociationStore = useNumberAssociationStore()

const allAssociations = computed(() => {
  const associations: Array<{
    number: string
    association?: { word: string; notes?: string }
  }> = []
  
  // Generate all numbers 00-99
  for (let i = 0; i < 100; i++) {
    const number = i.toString().padStart(2, '0')
    const association = numberAssociationStore.getAssociation(number)
    associations.push({
      number,
      association
    })
  }
  
  return associations
})

const progress = computed(() => numberAssociationStore.progressCount)
const total = computed(() => numberAssociationStore.totalCount)
</script>

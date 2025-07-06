<template>
  <div class="container mx-auto py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">Manage Number Association</h1>
      <p class="text-lg text-gray-600">
        {{ isEditing ? 'Edit' : 'Create' }} association for number {{ number }}
      </p>
    </div>
    
    <FormControlNumberAssociation 
      :number="number" 
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import FormControlNumberAssociation from '@/components/forms/control/FormControlNumberAssociation.vue'

const route = useRoute()
const router = useRouter()
const numberAssociationStore = useNumberAssociationStore()

const number = computed(() => route.params.number as string)
const isEditing = computed(() => numberAssociationStore.hasAssociation(number.value))

const handleSaved = () => {
  // Navigate immediately
  router.push({ name: 'ListPegs' })
}
</script>

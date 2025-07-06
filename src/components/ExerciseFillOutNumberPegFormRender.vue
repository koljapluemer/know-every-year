<template>
  <div class="max-w-4xl mx-auto">
    <!-- Exercise Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">Create Number Association</h1>
      <p class="text-lg text-gray-600">Create a memory peg for number {{ number }}</p>
    </div>

    <!-- Form -->
    <NumberPegFormControl 
      :number="number"
      @form-validity-changed="handleFormValidityChanged"
    />

    <!-- Action Buttons -->
    <div class="flex justify-center gap-4 mt-8">
      <button 
        @click="$emit('skip')"
        class="btn btn-outline btn-lg"
      >
        Skip
      </button>
      <button 
        @click="$emit('done')"
        class="btn btn-primary btn-lg"
        :disabled="!isFormValid"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NumberPegFormControl from './NumberPegFormControl.vue'

interface Props {
  number: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'done': []
  'skip': []
}>()

const isFormValid = ref(false)

const handleFormValidityChanged = (valid: boolean) => {
  isFormValid.value = valid
}
</script>

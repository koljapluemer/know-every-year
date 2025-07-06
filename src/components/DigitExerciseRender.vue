<template>
  <div class="max-w-2xl mx-auto p-6">
    <!-- Exercise question -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold mb-4">What sounds are associated with this digit?</h2>
      <div class="text-9xl font-bold text-primary mb-6">{{ digit }}</div>
    </div>

    <!-- Reveal section -->
    <div v-if="!isRevealed" class="text-center">
      <button 
        @click="revealAnswer"
        class="btn btn-primary btn-lg"
      >
        Reveal Answer
      </button>
    </div>

    <!-- Answer and rating section -->
    <div v-else class="space-y-6">
      <!-- Answer display -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body text-center">
          <div class="flex flex-wrap gap-2 justify-center mb-2">
            <span 
              v-for="sound in sounds" 
              :key="sound"
              class="badge badge-primary badge-lg text-lg px-4 py-2"
            >
              {{ sound }}
            </span>
          </div>
          <p v-if="notes" class="text-gray-600">{{ notes }}</p>
        </div>
      </div>

      <!-- Rating buttons -->
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-4">How well did you know this?</h3>
        <div class="flex flex-wrap gap-3 justify-center">
          <button 
            @click="selectRating('wrong')"
            class="btn btn-error"
          >
            Wrong
          </button>
          <button 
            @click="selectRating('hard')"
            class="btn btn-warning"
          >
            Hard
          </button>
          <button 
            @click="selectRating('good')"
            class="btn btn-info"
          >
            Good
          </button>
          <button 
            @click="selectRating('easy')"
            class="btn btn-success"
          >
            Easy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  digit: string
  sounds: string[]
  notes?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'rating-selected': [rating: 'wrong' | 'hard' | 'good' | 'easy']
}>()

const isRevealed = ref(false)

const revealAnswer = () => {
  isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  emit('rating-selected', rating)
}
</script> 
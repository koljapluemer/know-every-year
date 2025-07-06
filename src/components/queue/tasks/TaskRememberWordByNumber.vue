<template>
  <div class="max-w-2xl mx-auto p-6">
    <!-- Exercise question -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold mb-4">What is your association with this number?</h2>
      <div class="text-9xl font-bold text-primary mb-6">{{ number }}</div>
    </div>

    <!-- Reveal section -->
    <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

    <!-- Answer and rating section -->
    <div v-else class="space-y-6">
      <!-- Answer display -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body text-center">
          <p class="text-4xl font-bold text-primary mb-2">{{ association?.word }}</p>
          <p v-if="association?.notes" class="text-gray-600">{{ association.notes }}</p>
        </div>
      </div>

      <!-- Rating buttons -->
        <TaskButtonRender :buttons="ratingButtons" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'

interface Props {
  number: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'exercise-completed': []
}>()

const numberAssociationStore = useNumberAssociationStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()
const isRevealed = ref(false)

const association = computed(() => numberAssociationStore.getAssociation(props.number))

const revealAnswer = () => {
  isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  // Update the card with the rating
  numberAssociationStore.updateCard(props.number, rating)
  
  // Pass the event up to load next exercise
  emit('exercise-completed')
}

// Button configurations
const revealButton = computed(() => 
  createRevealButton(revealAnswer)
)

const ratingButtons = computed(() => 
  createRatingButtons(selectRating)
)
</script>

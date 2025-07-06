<template>
    <div class="max-w-2xl mx-auto p-6">
        <!-- Exercise question -->
        <div class="text-center mb-8">
            <h2 class="text-2xl font-bold mb-4">What digit is associated with this sound?</h2>
            <div class="text-6xl font-bold text-primary mb-6 break-words">{{ sound }}</div>
        </div>

        <!-- Reveal section -->
        <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

        <!-- Answer and rating section -->
        <div v-else class="space-y-6">
            <!-- Answer display -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body text-center">
                    <p class="text-6xl font-bold text-primary mb-2">{{ digit }}</p>
                    <p v-if="notes" class="text-gray-600">{{ notes }}</p>
                </div>
            </div>

            <!-- Rating buttons -->
            <TaskButtonRender :buttons="ratingButtons" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDigitAssociationStore } from '@/stores/useDigitAssociationStore'
import { useTaskButtons } from '@/components/queue/widgets/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/TaskButtonRender.vue'

interface Props {
    sound: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'exercise-completed': []
}>()

const digitAssociationStore = useDigitAssociationStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()
const isRevealed = ref(false)

const digit = computed(() => {
    const digitValue = digitAssociationStore.getDigitForSound(props.sound)
    return digitValue?.toString() || '?'
})

const notes = computed(() => {
    const digitValue = digitAssociationStore.getDigitForSound(props.sound)
    if (digitValue === null) return undefined
    return digitAssociationStore.associations[digitValue]?.notes
})

const revealAnswer = () => {
    isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
    // Update the sound card with the rating
    digitAssociationStore.updateSoundCard(props.sound, rating)

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
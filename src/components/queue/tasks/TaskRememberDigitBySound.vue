<template>
    <div class="text-center ">

        <!-- Exercise question -->
        <div class="text-center mb-8">
            <div class="big-digit">{{ sound }}</div>
        </div>

        <!-- Reveal section -->
        <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

        <!-- Answer and rating section -->
        <div v-else class="space-y-6">
            <!-- Answer display -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body text-center">
                    <p class="big-digit">{{ digit }}</p>
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
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'

interface Props {
    sound: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'task-done': []
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
    // Get the digit for this sound and update the sound card with the rating
    const digitValue = digitAssociationStore.getDigitForSound(props.sound)
    if (digitValue !== null) {
        digitAssociationStore.updateSoundCard(digitValue, rating)
    }

    // Pass the event up to load next task
    emit('task-done')
}

// Button configurations
const revealButton = computed(() =>
    createRevealButton(revealAnswer)
)

const ratingButtons = computed(() =>
    createRatingButtons(selectRating)
)
</script>
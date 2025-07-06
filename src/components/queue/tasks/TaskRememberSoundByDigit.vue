<template>
    <div class="max-w-2xl mx-auto p-6">
        <div class="text-center mb-8">
            <div class="text-9xl font-bold text-primary mb-6">{{ digit }}</div>
        </div>

        <!-- Reveal section -->
        <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

        <!-- Answer and rating section -->
        <div v-else class="space-y-6">
            <!-- Answer display -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body text-center">
                    <div class="flex flex-wrap gap-2 justify-center mb-2">
                        <span v-for="sound in sounds" :key="sound"
                            class="badge badge-primary badge-lg text-lg px-4 py-2">
                            {{ sound }}
                        </span>
                    </div>
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
    digit: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'task-done': []
}>()

const digitAssociationStore = useDigitAssociationStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()
const isRevealed = ref(false)

const association = computed(() => digitAssociationStore.associations[parseInt(props.digit)])

const sounds = computed(() => association.value?.sounds || [])
const notes = computed(() => association.value?.notes)

const revealAnswer = () => {
    isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
    digitAssociationStore.updateDigitCard(parseInt(props.digit), rating)
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

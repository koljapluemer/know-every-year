<template>
    <div class="max-w-2xl mx-auto p-6">
        <div class="text-center mb-8">
            <div class="text-6xl font-bold text-primary mb-6 break-words">{{ association?.word }}</div>
        </div>

        <!-- Reveal section -->
        <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

        <!-- Answer and rating section -->
        <div v-else class="space-y-6">
            <!-- Answer display -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body text-center">
                    <p class="text-6xl font-bold text-primary mb-2">{{ number }}</p>
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
    'task-done': []
}>()

const numberAssociationStore = useNumberAssociationStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()
const isRevealed = ref(false)

const association = computed(() => numberAssociationStore.getAssociation(props.number))

const revealAnswer = () => {
    isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
    // Update the word card with the rating
    numberAssociationStore.updateWordCard(props.number, rating)
    emit('task-done')
}

const revealButton = computed(() => createRevealButton(revealAnswer))
const ratingButtons = computed(() => createRatingButtons(selectRating))
</script>

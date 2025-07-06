<template>
    <div class="big-digit">{{ number }}</div>

    <!-- Reveal section -->
    <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

    <!-- Answer and rating section -->
    <div v-else class="space-y-6">
        <!-- Answer display -->
        <div class="card bg-base-100 shadow-lg">
            <div class="card-body text-center">
                <p class="big-word">{{ association?.word }}</p>
                <p v-if="association?.notes" class="text-gray-600">{{ association.notes }}</p>
            </div>
        </div>

        <!-- Rating buttons -->
        <TaskButtonRender :buttons="ratingButtons" />
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
    // Update the card with the rating
    numberAssociationStore.updateCard(props.number, rating)
    emit('task-done')
}

const revealButton = computed(() => createRevealButton(revealAnswer))
const ratingButtons = computed(() => createRatingButtons(selectRating))
</script>

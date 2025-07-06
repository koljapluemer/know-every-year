<template>
    <div class="max-w-2xl mx-auto p-6">
        <!-- Number display -->
        <div class="text-center mb-8">
            <p class="text-lg text-gray-600">Create your association for this number</p>

            <h1 class="text-9xl font-bold text-primary mb-4">{{ number }}</h1>
        </div>

        <!-- Association form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="form-control">
                <label class="label">
                    <span class="label-text font-semibold">Your Association Word *</span>
                </label>
                <input v-model="form.word" type="text" placeholder="Enter a word that helps you remember this number..."
                    class="input input-bordered w-full input-xl" :class="{ 'input-error': errors.word }" required />
                <label class="label" v-if="errors.word">
                    <span class="label-text-alt text-error">{{ errors.word }}</span>
                </label>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text font-semibold">Notes (Optional)</span>
                </label>
                <textarea v-model="form.notes" placeholder="Any additional notes or explanation for your association..."
                    class="textarea textarea-bordered w-full" rows="3"></textarea>
            </div>

            <div class="flex justify-end gap-4">
                <button type="button" @click="handleSkip" class="btn btn-outline">
                    Skip
                </button>
                <button type="submit" class="btn btn-primary">
                    Save Association
                </button>
            </div>
        </form>

        <!-- Digit associations overview -->
        <div class="grid grid-cols-3 gap-6 mb-8 items-center">
            <!-- First digit -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body">
                    <div class="space-y-2">
                        <div>
                            <div v-if="firstDigitAssociation?.sounds && firstDigitAssociation.sounds.length === 1"
                                class="flex flex-wrap gap-1 mt-1">
                                <span class="text-8xl">
                                    {{ firstDigitAssociation.sounds[0] }}
                                </span>
                            </div>
                            <div v-else-if="firstDigitAssociation?.sounds && firstDigitAssociation.sounds.length > 1"
                                class="space-y-2">
                                <div v-for="(sound, index) in firstDigitAssociation.sounds" :key="sound">
                                    <div class="card bg-base-200 shadow-sm">
                                        <div class="card-body p-3">
                                            <span class="text-5xl">{{ sound }}</span>
                                        </div>
                                    </div>
                                    <div v-if="index < firstDigitAssociation.sounds.length - 1"
                                        class="text-center text-lg font-medium text-gray-600 py-1">
                                        or
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="firstDigitAssociation?.notes">
                            <p class="text-sm text-gray-700 mt-1">{{ firstDigitAssociation.notes }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Plus sign -->
            <div class="flex justify-center">
                <p class="text-8xl">+</p>
            </div>

            <!-- Second digit -->
            <div class="card bg-base-100 shadow-lg">
                <div class="card-body">
                    <div class="space-y-2">
                        <div>
                            <div v-if="secondDigitAssociation?.sounds && secondDigitAssociation.sounds.length === 1"
                                class="flex flex-wrap gap-1 mt-1">
                                <span class="text-8xl">
                                    {{ secondDigitAssociation.sounds[0] }}
                                </span>
                            </div>
                            <div v-else-if="secondDigitAssociation?.sounds && secondDigitAssociation.sounds.length > 1"
                                class="space-y-2">
                                <div v-for="(sound, index) in secondDigitAssociation.sounds" :key="sound">
                                    <div class="card bg-base-200 shadow-sm">
                                        <div class="card-body p-3">
                                            <span class="text-5xl">{{ sound }}</span>
                                        </div>
                                    </div>
                                    <div v-if="index < secondDigitAssociation.sounds.length - 1"
                                        class="text-center text-lg font-medium text-gray-600 py-1">
                                        or
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="secondDigitAssociation?.notes">
                            <p class="text-sm text-gray-700 mt-1">{{ secondDigitAssociation.notes }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ignored sounds info -->
                <h3 class="mb-2">Ignored Sounds:</h3>
                <div class="flex flex-wrap gap-2">
                    <span 
                        v-for="sound in ignoredSounds" 
                        :key="sound"
                        class="badge badge-neutral"
                    >
                        {{ sound }}
                    </span>
                </div>
                <p v-if="ignoredSoundsNotes" class="text-sm text-gray-600 mt-2">{{ ignoredSoundsNotes }}</p>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import type { DigitAssociation } from '../entities/DigitAssociation'

interface Props {
    number: string
    firstDigit: number
    secondDigit: number
    firstDigitAssociation?: DigitAssociation
    secondDigitAssociation?: DigitAssociation
    prefillData?: { word: string; notes: string } | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    save: [{ word: string; notes?: string }]
    skip: []
}>()

const digitAssociationStore = useDigitAssociationStore()

const ignoredSounds = computed(() => digitAssociationStore.ignoredSounds.sounds)
const ignoredSoundsNotes = computed(() => digitAssociationStore.ignoredSounds.notes)

const form = reactive({
    word: props.prefillData?.word || '',
    notes: props.prefillData?.notes || ''
})

const errors = reactive({
    word: ''
})

const handleSubmit = () => {
    // Reset errors
    errors.word = ''

    // Validate
    if (!form.word.trim()) {
        errors.word = 'Please enter a word for your association'
        return
    }

    // Emit save event
    emit('save', {
        word: form.word.trim(),
        notes: form.notes.trim() || undefined
    })

    // Don't reset form when editing - let the parent handle navigation
    if (!props.prefillData) {
        form.word = ''
        form.notes = ''
    }
}

const handleSkip = () => {
    emit('skip')
}
</script>

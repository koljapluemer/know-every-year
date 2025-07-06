<template>
    <div class="flex flex-col gap-8 items-center p-2">
        <!-- Number display -->
        <h1 class="big-digit">{{ number }}</h1>

        <!-- Association form -->
        <div class="space-y-6">
            <div class="form-control">
                <label class="label">
                    <span class="label-text font-semibold">Your Association Word *</span>
                </label>
                <input 
                    v-model="form.word" 
                    type="text" 
                    placeholder="Enter a word that helps you remember this number..."
                    class="input input-bordered w-full input-xl" 
                    :class="{ 'input-error': errors.word }" 
                    required 
                />
                <label class="label" v-if="errors.word">
                    <span class="label-text-alt text-error">{{ errors.word }}</span>
                </label>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text font-semibold">Notes (Optional)</span>
                </label>
                <textarea 
                    v-model="form.notes" 
                    placeholder="Any additional notes or explanation for your association..."
                    class="textarea textarea-bordered w-full" 
                    rows="3"
                ></textarea>
            </div>
        </div>

        <!-- Digit associations overview -->
        <div class="flex flex-row gap-2 justify-center items-center">
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
                    </div>
                </div>
            </div>

            <!-- Plus sign -->
            <p class="text-8xl">+</p>

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
                    </div>
                </div>
            </div>
        </div>

        <!-- Ignored sounds info -->
        <p>Ignored Sounds:</p>
        <p>
            <span v-for="sound in ignoredSounds" :key="sound" class="badge badge-neutral mx-1">
                {{ sound }}
            </span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { DigitAssociation } from '@/entities/DigitAssociation'

interface Props {
    number: string
    firstDigit: number
    secondDigit: number
    firstDigitAssociation?: DigitAssociation
    secondDigitAssociation?: DigitAssociation
    prefillData?: { word: string; notes: string } | null
    ignoredSounds: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'form-validity-changed': [valid: boolean]
    'form-changed': [form: { word: string; notes: string }]
}>()

const form = reactive({
    word: props.prefillData?.word || '',
    notes: props.prefillData?.notes || ''
})

const errors = reactive({
    word: ''
})

// Watch for form changes and emit events
watch([() => form.word, () => form.notes], () => {
    // Validate
    errors.word = ''
    if (!form.word.trim()) {
        errors.word = 'Please enter a word for your association'
    }

    // Emit validity change
    emit('form-validity-changed', form.word.trim().length > 0)
    
    // Emit form data
    emit('form-changed', {
        word: form.word,
        notes: form.notes
    })
}, { immediate: true })

// Watch for prop changes to update form
watch(() => props.prefillData, (newPrefillData) => {
    if (newPrefillData) {
        form.word = newPrefillData.word
        form.notes = newPrefillData.notes
    }
}, { immediate: true })
</script>

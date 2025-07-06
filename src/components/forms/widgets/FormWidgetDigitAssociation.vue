<!-- no control component for this, it's very simple -->

<template>
  <div class="card bg-base-300 shadow-lg">
    <div class="card-body p-4">
      <!-- Header with digit -->
      <div class="flex items-center gap-4 mb-4">
        <div class="font-mono text-2xl font-bold text-primary w-12 text-center">{{ digit }}</div>
        <div class="flex-1">
          <h3 class="font-semibold">Sound Associations</h3>
        </div>
      </div>
      
      <!-- Sound associations -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2 items-center mb-2">
          <!-- Existing sound pills -->
          <span 
            v-for="sound in sounds" 
            :key="sound"
            class="badge badge-primary gap-2"
          >
            {{ sound }}
            <button 
              @click="removeSound(sound)"
              class="btn btn-ghost btn-xs p-0 h-auto min-h-0"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        </div>
        
        <!-- Add new sound input -->
        <div class="flex items-center gap-2">
          <input 
            v-model="newSound"
            @keyup.enter="addSound"
            @blur="addSound"
            placeholder="Add sound..."
            class="input input-bordered input-sm flex-1 max-w-xs"
            :class="{ 'input-error': newSoundError }"
          />
          <button 
            @click="addSound"
            class="btn btn-primary btn-sm"
            :disabled="!newSound.trim()"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>
        <div v-if="newSoundError" class="text-error text-xs mt-1">{{ newSoundError }}</div>
      </div>
      
      <!-- Notes -->
      <div class="mb-4">
        <label class="label">
          <span class="label-text font-medium">Notes</span>
        </label>
        <textarea 
          v-model="notes"
          @input="updateNotes"
          placeholder="Add notes about this digit..."
          class="textarea textarea-bordered w-full"
          rows="2"
        ></textarea>
      </div>
      
      <!-- Learning data -->
      <div class="border-t border-base-200 pt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Learning Progress</span>
        </div>
        
        <div v-if="hasLearningData" class="space-y-2">
          <div class="flex items-center gap-3">
            <WidgetDueDate :due-date="numberToSoundDue" />
            <span class="text-sm text-gray-600">Digit → Sound</span>
          </div>
          <div class="flex items-center gap-3">
            <WidgetDueDate :due-date="soundToNumberDue" />
            <span class="text-sm text-gray-600">Sound → Digit</span>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <button 
              @click="resetLearningData"
              class="btn btn-warning btn-sm"
            >
              Reset Learning Data
            </button>
            <div class="tooltip tooltip-top" data-tip="Reset learning data if you've fundamentally changed the sound associations">
              <button class="btn btn-ghost btn-sm p-1">
                <Info class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <span v-else class="text-gray-400 italic text-sm">No learning data yet</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Plus, Info } from 'lucide-vue-next'
import type { DigitAssociation } from '@/entities/DigitAssociation'
import WidgetDueDate from '@/components/widgets/WidgetDueDate.vue'

interface Props {
  digit: number
  association: DigitAssociation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-sounds': [digit: number, sounds: string[]]
  'update-notes': [digit: number, notes: string]
  'reset-learning-data': [digit: number]
}>()

const newSound = ref('')
const newSoundError = ref('')
const notes = ref(props.association.notes || '')
let notesTimeout: number | null = null

const sounds = computed(() => props.association.sounds)

const hasLearningData = computed(() => 
  props.association.numberToSoundLearningData || props.association.soundToNumberLearningData
)

const numberToSoundDue = computed(() => props.association.numberToSoundLearningData?.due)
const soundToNumberDue = computed(() => props.association.soundToNumberLearningData?.due)

const addSound = () => {
  const sound = newSound.value.trim()
  if (!sound) return
  
  // Validate
  if (sounds.value.includes(sound)) {
    newSoundError.value = 'Sound already exists'
    return
  }
  
  if (sound.length > 20) {
    newSoundError.value = 'Sound too long'
    return
  }
  
  // Add sound
  const updatedSounds = [...sounds.value, sound]
  emit('update-sounds', props.digit, updatedSounds)
  
  // Clear input
  newSound.value = ''
  newSoundError.value = ''
}

const removeSound = (soundToRemove: string) => {
  const updatedSounds = sounds.value.filter(s => s !== soundToRemove)
  emit('update-sounds', props.digit, updatedSounds)
}

const updateNotes = () => {
  // Clear existing timeout
  if (notesTimeout) {
    clearTimeout(notesTimeout)
  }
  
  // Set new timeout to debounce the update
  notesTimeout = setTimeout(() => {
    emit('update-notes', props.digit, notes.value)
  }, 500) // 500ms delay
}

const resetLearningData = () => {
  emit('reset-learning-data', props.digit)
}
</script>
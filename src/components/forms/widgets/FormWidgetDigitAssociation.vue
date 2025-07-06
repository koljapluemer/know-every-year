<!-- no control component for this, it's very simple -->

<template>
  <tr class="hover:bg-base-200">
    <td class="font-mono text-lg font-bold w-16">{{ digit }}</td>
    
    <!-- Sound associations -->
    <td class="py-4">
      <div class="flex flex-wrap gap-2 items-center">
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
        
        <!-- Add new sound input -->
        <div class="flex items-center gap-1">
          <input 
            v-model="newSound"
            @keyup.enter="addSound"
            @blur="addSound"
            placeholder="Add sound..."
            class="input input-bordered input-sm w-24"
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
      </div>
      <div v-if="newSoundError" class="text-error text-xs mt-1">{{ newSoundError }}</div>
    </td>
    
    <!-- Notes -->
    <td>
      <textarea 
        v-model="notes"
        @input="updateNotes"
        placeholder="Notes..."
        class="textarea textarea-bordered textarea-sm w-full"
        rows="2"
      ></textarea>
    </td>
    
    <!-- Learning data -->
    <td class="text-sm">
      <div v-if="hasLearningData" class="space-y-1">
        <div class="flex items-center gap-2">
          <WidgetDueDate :due-date="numberToSoundDue" />
          <span class="text-gray-500">(Digit→Sound)</span>
        </div>
        <div class="flex items-center gap-2">
          <WidgetDueDate :due-date="soundToNumberDue" />
          <span class="text-gray-500">(Sound→Digit)</span>
        </div>
        <div class="flex items-center gap-1 mt-2">
          <button 
            @click="resetLearningData"
            class="btn btn-warning btn-xs"
          >
            Reset
          </button>
          <div class="tooltip tooltip-top" data-tip="Reset learning data if you've fundamentally changed the sound associations">
            <button class="btn btn-ghost btn-xs p-1">
              <Info class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      <span v-else class="text-gray-400 italic">No learning data yet</span>
    </td>
  </tr>
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
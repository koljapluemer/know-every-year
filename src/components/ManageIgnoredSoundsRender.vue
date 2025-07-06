<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h3 class="card-title">Ignored Sounds</h3>
      <p class="text-sm text-gray-600 mb-4">These sounds are ignored in the Major System and won't be used for number associations.</p>
      
      <div class="flex flex-wrap gap-2 items-center mb-4">
        <!-- Existing ignored sound pills -->
        <span 
          v-for="sound in ignoredSounds" 
          :key="sound"
          class="badge badge-neutral gap-2"
        >
          {{ sound }}
          <button 
            @click="removeIgnoredSound(sound)"
            class="btn btn-ghost btn-xs p-0 h-auto min-h-0"
          >
            <X class="w-3 h-3" />
          </button>
        </span>
        
        <!-- Add new ignored sound input -->
        <div class="flex items-center gap-1">
          <input 
            v-model="newIgnoredSound"
            @keyup.enter="addIgnoredSound"
            @blur="addIgnoredSound"
            placeholder="Add ignored sound..."
            class="input input-bordered input-sm w-32"
            :class="{ 'input-error': newIgnoredSoundError }"
          />
          <button 
            @click="addIgnoredSound"
            class="btn btn-neutral btn-sm"
            :disabled="!newIgnoredSound.trim()"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div v-if="newIgnoredSoundError" class="text-error text-xs mb-2">{{ newIgnoredSoundError }}</div>
      
      <!-- Notes for ignored sounds -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Notes</span>
        </label>
        <textarea 
          v-model="ignoredSoundsNotes"
          @input="updateIgnoredSoundsNotes"
          placeholder="Notes about ignored sounds..."
          class="textarea textarea-bordered"
          rows="2"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Plus } from 'lucide-vue-next'

interface Props {
  ignoredSounds: string[]
  ignoredSoundsNotes?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-ignored-sounds': [sounds: string[]]
  'update-ignored-sounds-notes': [notes: string]
}>()

const newIgnoredSound = ref('')
const newIgnoredSoundError = ref('')
const ignoredSoundsNotes = ref(props.ignoredSoundsNotes || '')
let notesTimeout: number | null = null

const addIgnoredSound = () => {
  const sound = newIgnoredSound.value.trim()
  if (!sound) return
  
  // Validate
  if (props.ignoredSounds.includes(sound)) {
    newIgnoredSoundError.value = 'Sound already ignored'
    return
  }
  
  if (sound.length > 20) {
    newIgnoredSoundError.value = 'Sound too long'
    return
  }
  
  // Add ignored sound
  const updatedSounds = [...props.ignoredSounds, sound]
  emit('update-ignored-sounds', updatedSounds)
  
  // Clear input
  newIgnoredSound.value = ''
  newIgnoredSoundError.value = ''
}

const removeIgnoredSound = (soundToRemove: string) => {
  const updatedSounds = props.ignoredSounds.filter(s => s !== soundToRemove)
  emit('update-ignored-sounds', updatedSounds)
}

const updateIgnoredSoundsNotes = () => {
  // Clear existing timeout
  if (notesTimeout) {
    clearTimeout(notesTimeout)
  }
  
  // Set new timeout to debounce the update
  notesTimeout = setTimeout(() => {
    emit('update-ignored-sounds-notes', ignoredSoundsNotes.value)
  }, 500) // 500ms delay
}
</script> 
<!-- special case: we have only 10 digits, thus one form for all the digits at once -->
<template>
     <div class="flex flex-col gap-8 items-center p-2">

    <!-- Digit associations table -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Digit Associations (0-9)</h2>
        <p class="text-sm text-gray-600 mb-4">Manage the Major System sound associations for each digit.</p>
        
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th class="w-16">Digit</th>
                <th>Sound Associations</th>
                <th>Notes</th>
                <th class="w-48">Practice Due At</th>
              </tr>
            </thead>
            <tbody>
              <FormWidgetDigitAssociation
                v-for="digit in 10"
                :key="digit - 1"
                :digit="digit - 1"
                :association="digitAssociations[digit - 1]"
                @update-sounds="handleUpdateSounds"
                @update-notes="handleUpdateNotes"
                @reset-learning-data="handleResetLearningData"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Ignored sounds section -->
    <FormWidgetIgnoredSounds
      :ignored-sounds="ignoredSounds"
      :ignored-sounds-notes="ignoredSoundsNotes"
      @update-ignored-sounds="handleUpdateIgnoredSounds"
      @update-ignored-sounds-notes="handleUpdateIgnoredSoundsNotes"
    />
  </div>
</template>

<script setup lang="ts">
import type { DigitAssociation } from '@/entities/DigitAssociation'
import FormWidgetDigitAssociation from '@/components/forms/widgets/FormWidgetDigitAssociation.vue'
import FormWidgetIgnoredSounds from '@/components/forms/widgets/FormWidgetIgnoredSounds.vue'

interface Props {
  digitAssociations: Record<number, DigitAssociation>
  ignoredSounds: string[]
  ignoredSoundsNotes?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-sounds': [digit: number, sounds: string[]]
  'update-notes': [digit: number, notes: string]
  'reset-learning-data': [digit: number]
  'update-ignored-sounds': [sounds: string[]]
  'update-ignored-sounds-notes': [notes: string]
}>()

const handleUpdateSounds = (digit: number, sounds: string[]) => {
  emit('update-sounds', digit, sounds)
}

const handleUpdateNotes = (digit: number, notes: string) => {
  emit('update-notes', digit, notes)
}

const handleResetLearningData = (digit: number) => {
  emit('reset-learning-data', digit)
}

const handleUpdateIgnoredSounds = (sounds: string[]) => {
  emit('update-ignored-sounds', sounds)
}

const handleUpdateIgnoredSoundsNotes = (notes: string) => {
  emit('update-ignored-sounds-notes', notes)
}
</script>

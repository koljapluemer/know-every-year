<!-- special case: we have only 10 digits, thus one form for all the digits at once -->
<template>
  <div class="flex flex-col gap-6 p-4 max-w-4xl mx-auto">

    <div class="grid gap-4">
      <FormWidgetDigitAssociation v-for="digit in 10" :key="digit - 1" :digit="digit - 1"
        :association="digitAssociations[digit - 1]" @update-sounds="handleUpdateSounds"
        @update-notes="handleUpdateNotes" @reset-learning-data="handleResetLearningData" />

      <FormWidgetIgnoredSounds :ignored-sounds="ignoredSounds" :ignored-sounds-notes="ignoredSoundsNotes"
        @update-ignored-sounds="handleUpdateIgnoredSounds"
        @update-ignored-sounds-notes="handleUpdateIgnoredSoundsNotes" />
    </div>
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

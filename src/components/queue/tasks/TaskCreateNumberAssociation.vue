<template>
  <div class="max-w-4xl mx-auto">
    <!-- Form -->
    <FormControlNumberAssociation 
      :number="number"
      @form-validity-changed="handleFormValidityChanged"
    />

    <!-- Action Buttons -->
    <div class="flex justify-center gap-4 mt-8">
      <TaskButtonRender :buttons="actionButtons" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FormControlNumberAssociation from '@/components/forms/control/FormControlNumberAssociation.vue'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'

interface Props {
  number: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'task-done': []
}>()

const { createActionButtons } = useTaskButtons()
const isFormValid = ref(false)

const handleFormValidityChanged = (valid: boolean) => {
  isFormValid.value = valid
}

const handleSkip = () => {
  emit('task-done')
}

const handleDone = () => {
  emit('task-done')
}

const actionButtons = computed(() =>
  createActionButtons([
    {
      id: 'skip',
      label: 'Skip',
      variant: 'outline',
      size: 'lg',
      onClick: handleSkip
    },
    {
      id: 'done',
      label: 'Done',
      variant: 'primary',
      size: 'lg',
      onClick: handleDone,
      disabled: !isFormValid.value
    }
  ])
)
</script>

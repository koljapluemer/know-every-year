<template>
  <div class="text-center ">

    <!-- Action Buttons -->
    <div class="flex justify-center gap-4 mt-8">
      <TaskButtonRender :buttons="actionButtons" />
    </div>
    <!-- Form -->
    <FormControlNumberAssociation :number="number" @form-validity-changed="handleFormValidityChanged" />


  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
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

const numberAssociationStore = useNumberAssociationStore()
const { createActionButtons } = useTaskButtons()

const hasAssociation = computed(() => numberAssociationStore.hasAssociation(props.number))

const handleFormValidityChanged = (valid: boolean) => {
  if (valid && hasAssociation.value) {
    emit('task-done')
  }
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
      disabled: !hasAssociation.value
    }
  ])
)
</script>

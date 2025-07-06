<template>
  <div class="text-center">

    <TaskButtonRender :buttons="actionButtons" />
    <FormControlYear :year="year" />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEventsStore } from '@/stores/useEventsStore'
import FormControlYear from '@/components/forms/control/FormControlYear.vue'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'

interface Props {
  year: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'task-done': []
}>()

const { createActionButtons } = useTaskButtons()
const eventsStore = useEventsStore()

const hasEvents = computed(() => {
  const events = eventsStore.getEventsForYear(props.year)
  return events.length > 0
})

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
      disabled: !hasEvents.value
    }
  ])
)
</script>

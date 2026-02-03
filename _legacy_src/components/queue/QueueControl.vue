<template>
  <QueueRender 
    :current-task="currentTask"
    @load-next-task="loadNextTask"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQueueUtils } from '@/composables/useQueueUtils'
import type { QueueTask } from '@/entities/QueueTasks'
import QueueRender from './QueueRender.vue'

const { getRandomExercise } = useQueueUtils()

const currentTask = ref<QueueTask | null>(null)

const loadRandomTask = () => {
  const task = getRandomExercise()
  currentTask.value = task
  
  if (!task) {
    console.log('No tasks available for practice')
    // TODO: Handle this case - could show a message, redirect to create associations, etc.
  }
}

const loadNextTask = () => {
  loadRandomTask()
}

onMounted(() => {
  loadRandomTask()
})
</script>

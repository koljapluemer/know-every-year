<template>
  <div class="container mx-auto">
    <!-- No exercises available -->
    <div v-if="!currentTask" class="text-center p-8">
      <h2 class="text-2xl font-bold mb-4">No Tasks Available</h2>
    </div>

    <!-- Task components -->
    <div v-else class="text-center flex-col gap-8 flex items-center">
      <!-- TaskRememberWordByNumber -->
      <div v-if="currentTask.component === 'TaskRememberWordByNumber'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What is your association with this number?"
        />
        <TaskRememberWordByNumber 
          :number="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskRememberNumberByWord -->
      <div v-else-if="currentTask.component === 'TaskRememberNumberByWord'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What number is associated with this word?"
        />
        <TaskRememberNumberByWord 
          :number="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskRememberSoundByDigit -->
      <div v-else-if="currentTask.component === 'TaskRememberSoundByDigit'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What sounds are associated with this digit?"
        />
        <TaskRememberSoundByDigit 
          :digit="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskRememberDigitBySound -->
      <div v-else-if="currentTask.component === 'TaskRememberDigitBySound'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What digit is associated with this sound?"
        />
        <TaskRememberDigitBySound 
          :sound="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskCreateNumberAssociation -->
      <div v-else-if="currentTask.component === 'TaskCreateNumberAssociation'">
        <InstructionRender 
          subtitle="Fill out the form"
          title="Add an association for this number"
        />
        <TaskCreateNumberAssociation 
          :number="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskRememberEventsByYear -->
      <div v-else-if="currentTask.component === 'TaskRememberEventsByYear'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What events happened in this year?"
        />
        <TaskRememberEventsByYear 
          :year="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskRememberYearByEvent -->
      <div v-else-if="currentTask.component === 'TaskRememberYearByEvent'">
        <InstructionRender 
          subtitle="Answer the question"
          title="What year did this event happen?"
        />
        <TaskRememberYearByEvent 
          :event-id="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>

      <!-- TaskCreateEventsForYear -->
      <div v-else-if="currentTask.component === 'TaskCreateEventsForYear'">
        <InstructionRender 
          subtitle="Fill out the form"
          title="Add events for this year"
        />
        <TaskCreateEventsForYear 
          :year="currentTask.identifier"
          :key="currentTask.identifier"
          @task-done="loadNextTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueueTask } from '@/entities/QueueTasks'
import InstructionRender from '@/components/queue/widgets/InstructionRender.vue'
import TaskRememberWordByNumber from '@/components/queue/tasks/TaskRememberWordByNumber.vue'
import TaskRememberNumberByWord from '@/components/queue/tasks/TaskRememberNumberByWord.vue'
import TaskRememberSoundByDigit from '@/components/queue/tasks/TaskRememberSoundByDigit.vue'
import TaskRememberDigitBySound from '@/components/queue/tasks/TaskRememberDigitBySound.vue'
import TaskCreateNumberAssociation from '@/components/queue/tasks/TaskCreateNumberAssociation.vue'
import TaskCreateEventsForYear from '@/components/queue/tasks/TaskCreateEventsForYear.vue'
import TaskRememberEventsByYear from '@/components/queue/tasks/TaskRememberEventsByYear.vue'
import TaskRememberYearByEvent from '@/components/queue/tasks/TaskRememberYearByEvent.vue'

interface Props {
  currentTask: QueueTask | null
}

defineProps<Props>()
const emit = defineEmits<{
  'load-next-task': []
}>()

const loadNextTask = () => {
  emit('load-next-task')
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Exercise Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">Year to Events</h1>
      <p class="text-lg text-gray-600">Recall the events for this year</p>
    </div>

    <!-- Year Display -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body text-center">
        <h2 class="text-6xl font-bold font-mono">{{ year }}</h2>
        <p class="text-lg text-gray-600 mt-2">What events happened in this year?</p>
      </div>
    </div>

    <!-- Reveal Button -->
    <div v-if="!isRevealed" class="text-center mb-6">
      <button @click="$emit('reveal')" class="btn btn-primary btn-lg">
        Reveal Events
      </button>
    </div>

    <!-- Events Display -->
    <div v-if="isRevealed" class="space-y-6">
      <!-- Events List -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">Events for {{ year }}</h3>
          
          <div v-if="events.length > 0" class="space-y-4">
            <EventFormRender
              v-for="event in events"
              :key="event.id"
              :event="event"
              :readonly="true"
            />
          </div>
          
          <div v-else class="text-center py-8">
            <p class="text-gray-500 text-lg">No events found for this year</p>
          </div>
        </div>
      </div>

      <!-- Rating Buttons -->
      <div v-if="!isCompleted" class="card bg-base-100 shadow-lg">
        <div class="card-body">
          
          <div class="flex flex-wrap gap-4 justify-center">
            <button 
              @click="$emit('rate', 'wrong')"
              class="btn btn-error btn-lg"
            >
              Wrong
            </button>
            <button 
              @click="$emit('rate', 'hard')"
              class="btn btn-warning btn-lg"
            >
              Hard
            </button>
            <button 
              @click="$emit('rate', 'good')"
              class="btn btn-success btn-lg"
            >
              Good
            </button>
            <button 
              @click="$emit('rate', 'easy')"
              class="btn btn-info btn-lg"
            >
              Easy
            </button>
          </div>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="isCompleted" class="card bg-success text-success-content shadow-lg">
        <div class="card-body text-center">
          <h3 class="card-title text-xl">Exercise Completed!</h3>
          <p>Your rating has been recorded. The next review will be scheduled based on your performance.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../entities/YearAssociations'
import EventFormRender from './EventFormRender.vue'

interface Props {
  year: string
  events: Event[]
  isRevealed: boolean
  isCompleted: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'reveal': []
  'rate': [rating: 'wrong' | 'hard' | 'good' | 'easy']
}>()
</script>

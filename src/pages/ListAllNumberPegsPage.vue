<template>
  <div class="container mx-auto py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">My Number Associations</h1>
      <p class="text-lg text-gray-600">
        Overview of all your number associations (00-99)
      </p>
    </div>
    
    <ListAllNumberPegControl />
  </div>
</template>

<script setup lang="ts">
import ListAllNumberPegControl from '../components/lists/control/ListAllNumberPegControl.vue'
</script>

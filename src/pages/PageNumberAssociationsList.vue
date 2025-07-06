<template>
  <div class="container mx-auto py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">My Number Associations</h1>
      <p class="text-lg text-gray-600">
        Overview of all your number associations (00-99)
      </p>
    </div>
    
    <ListControlNumberAssociationsAll />
  </div>
</template>

<script setup lang="ts">
import ListControlNumberAssociationsAll from '@/components/lists/control/ListControlNumberAssociationsAll.vue'
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">Manage Digit Associations</h1>
      <p class="text-lg text-gray-600">
        Configure the Major System sound associations for digits 0-9
      </p>
    </div>
    
    <ManageDigitPegsControl />
  </div>
</template>

<script setup lang="ts">
import ManageDigitPegsControl from '../components/ManageDigitPegsControl.vue'
</script>

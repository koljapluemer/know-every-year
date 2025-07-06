<template>
  <header class="flex flex-row justify-between p-4 mb-4">
    <h1 class="text-2xl font-bold">Know Every Year</h1>
    <nav class="flex gap-2 justify-center">
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'CompletePegs' }" :to="{ name: 'CompletePegs' }">Complete Number Pegs</RouterLink>
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'ListPegs' }" :to="{ name: 'ListPegs' }">My Number Pegs</RouterLink>
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'Practice' }" :to="{ name: 'Practice' }">Practice</RouterLink>
    </nav>
  </header>
  <RouterView />
  <ToastManager />
</template>

<script setup lang="ts">
import ToastManager from './ui/ToastManager.vue'
</script>

<style>
@import "tailwindcss";
@plugin "daisyui";
</style>

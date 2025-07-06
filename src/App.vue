<template>
  <header class="flex flex-row justify-between p-4 mb-4">
    <h1 class="text-2xl font-bold">Know Every Year</h1>
    <nav class="flex gap-2 justify-center">
      <RouterLink class="btn btn-primary" :class="{ 'btn-secondary': $route.name === 'Practice' }" :to="{ name: 'Practice' }">Practice</RouterLink>
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'ManageDigitPegs' }" :to="{ name: 'ManageDigitPegs' }">Digit Pegs</RouterLink>
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'ListPegs' }" :to="{ name: 'ListPegs' }">Number Pegs</RouterLink>
      <RouterLink class="btn" :class="{ 'btn-secondary': $route.name === 'YearAssociations' }" :to="{ name: 'YearAssociations' }">Year Events</RouterLink>
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

<template>
  <header class="navbar bg-base-100 shadow-sm mb-4">
    <div class="navbar-start">
      <h1 class="text-xl font-bold lg:text-2xl">Know Every Year</h1>
    </div>
    
    <NavList :nav-items="navItems" />
  </header>
  <RouterView />
  <ToastManager />
</template>

<script setup lang="ts">
import ToastManager from './ui/ToastManager.vue'
import NavList from '@/components/widgets/NavList.vue'

const navItems = [
  { name: 'Practice', label: 'Practice', isPrimary: true },
  { name: 'ManageDigitPegs', label: 'Digit Pegs' },
  { name: 'ListPegs', label: 'Number Pegs' },
  { name: 'YearAssociations', label: 'Year Events' }
]
</script>

<style>
@import "tailwindcss";
@plugin "daisyui";

@layer components {
  .big-digit {
    @apply text-9xl text-primary font-bold;
  }

  .letter-wrap {
    @apply border-1 border-gray-300 rounded-md p-6;
  }

  .big-word {
    @apply text-7xl text-primary font-bold;
  }
}
</style>

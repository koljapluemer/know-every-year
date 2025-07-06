<template>
  <header class="navbar bg-base-100 shadow-sm mb-4">
    <div class="navbar-start flex flex-col gap-1 items-start">
      <router-link :to="{ name: 'Home' }" class="text-xl link link-hover font-bold lg:text-2xl">Know Every Year</router-link>
      <small class="text-sm">by <a href="https://koljapluemer.com/" class="link">Kolja Sam</a></small>
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
  { name: 'YearAssociations', label: 'Years & Events' }
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

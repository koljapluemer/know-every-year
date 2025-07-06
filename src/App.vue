<template>
  <header class="flex flex-row justify-between">
    <nav class="flex gap-2 justify-center">
      <RouterLink class="link link-hover" :to="{ name: 'CompletePegs' }">Complete Number Pegs</RouterLink>
      <RouterLink class="link link-hover" :to="{ name: 'ListPegs' }">My Number Pegs</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style>
@import "tailwindcss";
@plugin "daisyui";
</style>

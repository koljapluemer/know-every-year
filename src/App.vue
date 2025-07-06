<template>
  <header class="flex flex-row justify-between">
    <nav class="flex gap-2 justify-center">
      <RouterLink to="/complete-pegs">Complete Number Pegs</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style>
@import "tailwindcss";
@plugin "daisyui";
</style>

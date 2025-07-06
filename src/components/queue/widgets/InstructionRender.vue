<template>
  <div class="text-center m-4 p-4">
    <p class="text-xl text-gray-600 mb-2">{{ subtitle }}</p>
    <h2 class="text-3xl font-bold">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtitle: string
  title: string
}

defineProps<Props>()
</script>

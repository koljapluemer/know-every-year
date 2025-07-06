<template>
  <div class="text-center mb-8">
    <p class="text-lg text-gray-600 mb-2">{{ subtitle }}</p>
    <h2 class="text-2xl font-bold">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtitle: string
  title: string
}

defineProps<Props>()
</script>

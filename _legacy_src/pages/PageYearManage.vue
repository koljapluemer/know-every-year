<template>
  <div class="container mx-auto py-8">
    <FormControlYear :year="year" />
  </div>
</template>

<script setup lang="ts">
import FormControlYear from '@/components/forms/control/FormControlYear.vue'

interface Props {
  year: string
}

defineProps<Props>()
</script>

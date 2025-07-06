<template>
  <div class="container mx-auto py-8">
    <ManageYearControl :year="year" />
  </div>
</template>

<script setup lang="ts">
import ManageYearControl from '../components/forms/control/ManageYearControl.vue'

interface Props {
  year: string
}

defineProps<Props>()
</script>

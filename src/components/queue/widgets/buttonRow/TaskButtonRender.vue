<template>
  <div class="">
    <slot :buttons="props.buttons" :config="props.config">
      <!-- Default slot content - renders buttons if no custom slot provided -->
      <button v-for="button in visibleButtons" :key="button.id" @click="button.onClick" :disabled="button.disabled"
        :class="buttonClasses(button)">
        <component v-if="button.icon" :is="button.icon" class="w-4 h-4 mx-2" />
        {{ button.label }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskButton, TaskButtonsConfig } from './TaskButtonTypes'

interface Props {
  buttons: TaskButton[]
  config?: TaskButtonsConfig
}

const props = defineProps<Props>()

const visibleButtons = computed(() =>
  props.buttons.filter((button: TaskButton) => button.visible !== false)
)

const buttonClasses = (button: TaskButton) => {
  const base = 'btn'
  const size = button.size || 'md'
  const variant = button.variant || 'primary'

  return `${base} btn-${variant} btn-${size} m-2`
}
</script>

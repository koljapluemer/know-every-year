<template>
  <div class="task-buttons" :class="[
    `justify-${alignment}`,
    layoutClasses,
    gapClasses
  ]">
    <slot :buttons="buttons" :config="config">
      <!-- Default slot content - renders buttons if no custom slot provided -->
      <button v-for="button in visibleButtons" :key="button.id" @click="button.onClick" :disabled="button.disabled"
        :class="buttonClasses(button)">
        <component v-if="button.icon" :is="button.icon" class="w-4 h-4 mr-2" />
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

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    layout: 'horizontal',
    alignment: 'center',
    gap: 'md',
    wrap: true
  })
})

const visibleButtons = computed(() =>
  props.buttons.filter(button => button.visible !== false)
)

const alignment = computed(() => props.config.alignment)
const layout = computed(() => props.config.layout)
const gap = computed(() => props.config.gap)
const wrap = computed(() => props.config.wrap)

const layoutClasses = computed(() => {
  const base = 'flex'
  const layoutClass = layout.value === 'vertical' ? 'flex-col' : 'flex-row'
  const wrapClass = wrap.value ? 'flex-wrap' : 'flex-nowrap'
  return `${base} ${layoutClass} ${wrapClass}`
})

const gapClasses = computed(() => {
  switch (gap.value) {
    case 'sm': return 'gap-2'
    case 'lg': return 'gap-4'
    default: return 'gap-3'
  }
})

const buttonClasses = (button: TaskButton) => {
  const base = 'btn'
  const size = button.size || 'md'
  const variant = button.variant || 'primary'

  return `${base} btn-${variant} btn-${size}`
}
</script>

<style scoped>
.task-buttons {
  @reference flex items-center m-4 p-4;
}
</style>

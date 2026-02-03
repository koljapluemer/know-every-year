<template>
  <div class="space-y-4">
    <div
      v-if="todos.length === 0"
      class="text-center py-8"
    >
      <p class="text-gray-500">
        No todos found
      </p>
    </div>

    <ListWidgetTodo
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle-completed="$emit('toggle-completed', $event)"
      @update-todo="(id, updates) => $emit('update-todo', id, updates)"
      @delete-todo="$emit('delete-todo', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/entities/Todo'
import ListWidgetTodo from '@/components/lists/widgets/ListWidgetTodo.vue'

interface Props {
  todos: Todo[]
}

defineProps<Props>()

defineEmits<{
  'toggle-completed': [todoId: string]
  'update-todo': [todoId: string, updates: { title?: string; notes?: string }]
  'delete-todo': [todoId: string]
}>()
</script>

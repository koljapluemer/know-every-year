<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Todos
      </h1>
      <button
        class="btn btn-primary"
        @click="showAddForm = !showAddForm"
      >
        {{ showAddForm ? 'Cancel' : 'Add Todo' }}
      </button>
    </div>

    <!-- Add Todo Form -->
    <div
      v-if="showAddForm"
      class="card bg-base-200 shadow-lg mb-6"
    >
      <div class="card-body">
        <h2 class="card-title">
          Add New Todo
        </h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Title</span>
            </label>
            <input
              v-model="newTodoTitle"
              type="text"
              placeholder="e.g., add events in the 1870s"
              class="input input-bordered w-full"
              @keyup.enter="handleAddTodo"
            >
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Notes (optional)</span>
            </label>
            <textarea
              v-model="newTodoNotes"
              placeholder="Additional notes..."
              class="textarea textarea-bordered w-full"
              rows="2"
            />
          </div>
          <div class="flex justify-end">
            <button
              class="btn btn-primary"
              :disabled="!newTodoTitle.trim()"
              @click="handleAddTodo"
            >
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Search</span>
        </label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search todos..."
          class="input input-bordered w-full"
        >
      </div>

      <!-- Filter -->
      <div class="flex flex-wrap gap-4">
        <label class="label cursor-pointer">
          <input
            v-model="showCompleted"
            type="checkbox"
            class="checkbox checkbox-primary"
          >
          <span class="label-text ml-2">Show completed</span>
        </label>
      </div>
    </div>

    <!-- Results count -->
    <div class="mb-4">
      <p class="text-sm text-gray-600">
        Showing {{ filteredTodos.length }} of {{ totalTodos }} todos
        <span
          v-if="incompleteTodosCount > 0"
          class="ml-2"
        >
          ({{ incompleteTodosCount }} incomplete)
        </span>
      </p>
    </div>

    <!-- Todos List -->
    <ListRenderTodos
      :todos="filteredTodos"
      @toggle-completed="handleToggleCompleted"
      @update-todo="handleUpdateTodo"
      @delete-todo="handleDeleteTodo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodosStore } from '@/stores/useTodosStore'
import { useToast } from '@/ui/useToast'
import ListRenderTodos from '@/components/lists/render/ListRenderTodos.vue'

const todosStore = useTodosStore()
const { success, error } = useToast()

// Reactive state
const searchQuery = ref('')
const showCompleted = ref(true)
const showAddForm = ref(false)
const newTodoTitle = ref('')
const newTodoNotes = ref('')

// Computed
const totalTodos = computed(() => todosStore.allTodos.length)
const incompleteTodosCount = computed(() => todosStore.incompleteTodos.length)

const filteredTodos = computed(() => {
  let todos = todosStore.allTodos

  // Filter by completion status
  if (!showCompleted.value) {
    todos = todos.filter(todo => !todo.completed)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    todos = todos.filter(todo =>
      todo.title.toLowerCase().includes(query) ||
      (todo.notes && todo.notes.toLowerCase().includes(query))
    )
  }

  // Sort by: incomplete first, then by creation date (newest first)
  return todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

// Methods
const handleAddTodo = () => {
  if (!newTodoTitle.value.trim()) return

  try {
    todosStore.addTodo(newTodoTitle.value.trim(), newTodoNotes.value.trim() || undefined)
    success('Todo added successfully!')
    newTodoTitle.value = ''
    newTodoNotes.value = ''
    showAddForm.value = false
  } catch (e) {
    error(`Failed to add todo: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleToggleCompleted = (todoId: string) => {
  try {
    const todo = todosStore.getTodo(todoId)
    if (todo?.completed) {
      todosStore.markIncomplete(todoId)
      success('Todo marked as incomplete')
    } else {
      todosStore.markCompleted(todoId)
      success('Todo marked as completed')
    }
  } catch (e) {
    error(`Failed to update todo: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleUpdateTodo = (todoId: string, updates: { title?: string; notes?: string }) => {
  try {
    todosStore.updateTodo(todoId, updates)
    success('Todo updated successfully!')
  } catch (e) {
    error(`Failed to update todo: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleDeleteTodo = (todoId: string) => {
  try {
    todosStore.removeTodo(todoId)
    success('Todo deleted successfully!')
  } catch (e) {
    error(`Failed to delete todo: ${e instanceof Error ? e.message : String(e)}`)
  }
}
</script>

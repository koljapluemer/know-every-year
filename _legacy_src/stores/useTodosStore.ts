import { defineStore } from 'pinia'
import type { Todo } from '../entities/Todo'

interface TodosState {
  todos: Record<string, Todo>
}

/**
 * Get tomorrow at 4am
 */
function getNextDueDate(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(4, 0, 0, 0)
  return tomorrow
}

export const useTodosStore = defineStore('todos', {
  state: (): TodosState => ({
    todos: {}
  }),

  getters: {
    /**
     * Get all todos
     */
    allTodos: (state): Todo[] => {
      return Object.values(state.todos)
    },

    /**
     * Get incomplete todos
     */
    incompleteTodos: (state): Todo[] => {
      return Object.values(state.todos).filter(todo => !todo.completed)
    },

    /**
     * Get completed todos
     */
    completedTodos: (state): Todo[] => {
      return Object.values(state.todos).filter(todo => todo.completed)
    },

    /**
     * Get todos that are due for practice (incomplete and due date has passed)
     */
    getDueTodos: (state): string[] => {
      const now = new Date()
      return Object.entries(state.todos)
        .filter(([, todo]) => {
          if (todo.completed) return false
          if (!todo.dueAt) return true // No due date = due now
          return todo.dueAt <= now
        })
        .map(([todoId]) => todoId)
    },

    /**
     * Get linked event IDs for a specific todo
     */
    getEventsForTodo: (state) => (todoId: string): string[] => {
      const todo = state.todos[todoId]
      return todo?.associatedEventIds || []
    }
  },

  actions: {
    /**
     * Add a new todo (due immediately)
     */
    addTodo(title: string, notes?: string): string {
      const id = crypto.randomUUID()

      const todo: Todo = {
        id,
        title,
        completed: false,
        associatedEventIds: [],
        notes,
        createdAt: new Date(),
        dueAt: new Date() // Due immediately
      }

      this.todos[id] = todo
      return id
    },

    /**
     * Update an existing todo
     */
    updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
      if (!this.todos[id]) {
        throw new Error(`Todo with ID ${id} not found`)
      }

      this.todos[id] = {
        ...this.todos[id],
        ...updates
      }
    },

    /**
     * Mark todo as completed
     */
    markCompleted(id: string) {
      if (!this.todos[id]) {
        throw new Error(`Todo with ID ${id} not found`)
      }
      this.todos[id].completed = true
    },

    /**
     * Mark todo as incomplete
     */
    markIncomplete(id: string) {
      if (!this.todos[id]) {
        throw new Error(`Todo with ID ${id} not found`)
      }
      this.todos[id].completed = false
      // Reset due date so it appears in queue again
      this.todos[id].dueAt = new Date()
    },

    /**
     * Remove a todo
     */
    removeTodo(id: string) {
      if (!this.todos[id]) {
        throw new Error(`Todo with ID ${id} not found`)
      }
      delete this.todos[id]
    },

    /**
     * Get a todo by ID
     */
    getTodo(id: string): Todo | undefined {
      return this.todos[id]
    },

    /**
     * Link an event to a todo
     */
    linkEventToTodo(todoId: string, eventId: string) {
      const todo = this.todos[todoId]
      if (!todo) {
        throw new Error(`Todo with ID ${todoId} not found`)
      }

      if (!todo.associatedEventIds.includes(eventId)) {
        todo.associatedEventIds.push(eventId)
      }
    },

    /**
     * Unlink an event from a todo
     */
    unlinkEventFromTodo(todoId: string, eventId: string) {
      const todo = this.todos[todoId]
      if (!todo) {
        throw new Error(`Todo with ID ${todoId} not found`)
      }

      const index = todo.associatedEventIds.indexOf(eventId)
      if (index > -1) {
        todo.associatedEventIds.splice(index, 1)
      }
    },

    /**
     * Reschedule todo to next calendar day at 4am
     */
    rescheduleTodo(id: string) {
      const todo = this.todos[id]
      if (!todo) return

      todo.dueAt = getNextDueDate()
    },

    /**
     * Clear all todos
     */
    clearAll() {
      this.todos = {}
    }
  },

  persist: {
    afterHydrate: (ctx) => {
      // Convert string dates back to Date objects after hydration
      Object.values(ctx.store.todos).forEach((todo) => {
        const t = todo as Todo & { createdAt: string | Date; dueAt?: string | Date }
        if (t.createdAt && typeof t.createdAt === 'string') {
          (todo as Todo).createdAt = new Date(t.createdAt)
        }
        if (t.dueAt && typeof t.dueAt === 'string') {
          (todo as Todo).dueAt = new Date(t.dueAt)
        }
      })
    }
  }
})

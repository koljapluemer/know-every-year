export interface Todo {
  id: string
  title: string                    // e.g., "add events in the 1870s"
  completed: boolean
  associatedEventIds: string[]     // Links to events created for this todo
  notes?: string
  createdAt: Date
  dueAt: Date                      // When this todo is due for practice
}

export type QueueTaskType = 'number' | 'digit' | 'peg'

export type QueueTaskDirection = 'numberToWord' | 'wordToNumber' | 'numberToSound' | 'soundToNumber' | 'createPeg'

export type QueueTaskCategory = 'numberToWord' | 'wordToNumber' | 'digitToSound' | 'soundToDigit' | 'createPeg'

export interface QueueTask {
  type: QueueTaskType
  identifier: string
  direction: QueueTaskDirection
}

export interface QueueTaskCategoryInfo {
  name: QueueTaskCategory
  count: number
  exercises: QueueTask[]
}

export type QueueTaskType = 'number' | 'digit' | 'peg' | 'year'

export type QueueTaskDirection = 'numberToWord' | 'wordToNumber' | 'numberToSound' | 'soundToNumber' | 'createPeg' | 'yearToEvents'

export type QueueTaskCategory = 'numberToWord' | 'wordToNumber' | 'digitToSound' | 'soundToDigit' | 'createPeg' | 'yearToEvents'

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

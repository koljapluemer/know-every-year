export type TaskComponentName = 
  | 'TaskRememberWordByNumber'
  | 'TaskRememberNumberByWord'
  | 'TaskRememberSoundByDigit'
  | 'TaskRememberDigitBySound'
  | 'TaskCreateNumberAssociation'
  | 'TaskRememberEventsByYear'

export interface QueueTask {
  component: TaskComponentName
  identifier: string
  props?: Record<string, any> // Additional props specific to each task
}

export interface QueueTaskCategoryInfo {
  name: TaskComponentName
  count: number
  exercises: QueueTask[]
}

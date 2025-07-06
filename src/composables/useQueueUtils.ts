import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import type { QueueTask, QueueTaskCategoryInfo } from '../entities/QueueTasks'

export function useQueueUtils() {
  const numberAssociationStore = useNumberAssociationStore()
  const digitAssociationStore = useDigitAssociationStore()

  // Internal helper functions
  const getNrOfDueNumberToWordExercises = computed(() => numberAssociationStore.getDueNumbers.length)
  const getNrOfNewNumberToWordExercises = computed(() => numberAssociationStore.getNewNumbers.length)
  const getNrOfDueWordToNumberExercises = computed(() => numberAssociationStore.getDueWords.length)
  const getNrOfNewWordToNumberExercises = computed(() => numberAssociationStore.getNewWords.length)
  const getNrOfDueDigitToSoundExercises = computed(() => digitAssociationStore.getDueDigits.length)
  const getNrOfNewDigitToSoundExercises = computed(() => digitAssociationStore.getNewDigits.length)
  const getNrOfDueSoundToDigitExercises = computed(() => digitAssociationStore.getDueSounds.length)
  const getNrOfNewSoundToDigitExercises = computed(() => digitAssociationStore.getNewSounds.length)

  // Public "eligible" functions
  const getNrOfEligibleNumberToWordExercises = computed(() => 
    getNrOfDueNumberToWordExercises.value + getNrOfNewNumberToWordExercises.value
  )
  const getEligibleNumberToWordExercises = computed((): QueueTask[] => [
    ...numberAssociationStore.getDueNumbers.map(number => ({ 
      type: 'number' as const, 
      identifier: number, 
      direction: 'numberToWord' as const 
    })),
    ...numberAssociationStore.getNewNumbers.map(number => ({ 
      type: 'number' as const, 
      identifier: number, 
      direction: 'numberToWord' as const 
    }))
  ])

  const getNrOfEligibleWordToNumberExercises = computed(() => 
    getNrOfDueWordToNumberExercises.value + getNrOfNewWordToNumberExercises.value
  )
  const getEligibleWordToNumberExercises = computed((): QueueTask[] => [
    ...numberAssociationStore.getDueWords.map(number => ({ 
      type: 'number' as const, 
      identifier: number, 
      direction: 'wordToNumber' as const 
    })),
    ...numberAssociationStore.getNewWords.map(number => ({ 
      type: 'number' as const, 
      identifier: number, 
      direction: 'wordToNumber' as const 
    }))
  ])

  const getNrOfEligibleDigitToSoundExercises = computed(() => 
    getNrOfDueDigitToSoundExercises.value + getNrOfNewDigitToSoundExercises.value
  )
  const getEligibleDigitToSoundExercises = computed((): QueueTask[] => [
    ...digitAssociationStore.getDueDigits.map(digit => ({ 
      type: 'digit' as const, 
      identifier: digit.toString(), 
      direction: 'numberToSound' as const 
    })),
    ...digitAssociationStore.getNewDigits.map(digit => ({ 
      type: 'digit' as const, 
      identifier: digit.toString(), 
      direction: 'numberToSound' as const 
    }))
  ])

  const getNrOfEligibleSoundToDigitExercises = computed(() => 
    getNrOfDueSoundToDigitExercises.value + getNrOfNewSoundToDigitExercises.value
  )
  const getEligibleSoundToDigitExercises = computed((): QueueTask[] => [
    ...digitAssociationStore.getDueSounds.map(sound => ({ 
      type: 'digit' as const, 
      identifier: sound, 
      direction: 'soundToNumber' as const 
    })),
    ...digitAssociationStore.getNewSounds.map(sound => ({ 
      type: 'digit' as const, 
      identifier: sound, 
      direction: 'soundToNumber' as const 
    }))
  ])

  const getNrOfDigitsWithoutAssociation = computed(() => numberAssociationStore.unassociatedNumbers.length)
  const getDigitsWithoutAssociation = computed((): QueueTask[] => 
    numberAssociationStore.unassociatedNumbers.map(number => ({ 
      type: 'peg' as const, 
      identifier: number, 
      direction: 'createPeg' as const 
    }))
  )

  // Get available categories (categories with more than 0 exercises)
  const getAvailableCategories = computed((): QueueTaskCategoryInfo[] => {
    const categories: QueueTaskCategoryInfo[] = []

    if (getNrOfEligibleNumberToWordExercises.value > 0) {
      categories.push({
        name: 'numberToWord',
        count: getNrOfEligibleNumberToWordExercises.value,
        exercises: getEligibleNumberToWordExercises.value
      })
    }

    if (getNrOfEligibleWordToNumberExercises.value > 0) {
      categories.push({
        name: 'wordToNumber',
        count: getNrOfEligibleWordToNumberExercises.value,
        exercises: getEligibleWordToNumberExercises.value
      })
    }

    if (getNrOfEligibleDigitToSoundExercises.value > 0) {
      categories.push({
        name: 'digitToSound',
        count: getNrOfEligibleDigitToSoundExercises.value,
        exercises: getEligibleDigitToSoundExercises.value
      })
    }

    if (getNrOfEligibleSoundToDigitExercises.value > 0) {
      categories.push({
        name: 'soundToDigit',
        count: getNrOfEligibleSoundToDigitExercises.value,
        exercises: getEligibleSoundToDigitExercises.value
      })
    }

    if (getNrOfDigitsWithoutAssociation.value > 0) {
      categories.push({
        name: 'createPeg',
        count: getNrOfDigitsWithoutAssociation.value,
        exercises: getDigitsWithoutAssociation.value
      })
    }

    return categories
  })

  // Get a random exercise from a random category
  const getRandomExercise = (): QueueTask | null => {
    const availableCategories = getAvailableCategories.value
    
    if (availableCategories.length === 0) {
      return null
    }

    // Pick a random category
    const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length)
    const selectedCategory = availableCategories[randomCategoryIndex]

    // Pick a random exercise from that category
    const randomExerciseIndex = Math.floor(Math.random() * selectedCategory.exercises.length)
    return selectedCategory.exercises[randomExerciseIndex]
  }

  return {
    // Number Association Exercises
    getNrOfEligibleNumberToWordExercises,
    getEligibleNumberToWordExercises,
    getNrOfEligibleWordToNumberExercises,
    getEligibleWordToNumberExercises,

    // Digit Association Exercises
    getNrOfEligibleDigitToSoundExercises,
    getEligibleDigitToSoundExercises,
    getNrOfEligibleSoundToDigitExercises,
    getEligibleSoundToDigitExercises,

    // Number Association Creation
    getNrOfDigitsWithoutAssociation,
    getDigitsWithoutAssociation,

    // Utility functions
    getRandomExercise
  }
}

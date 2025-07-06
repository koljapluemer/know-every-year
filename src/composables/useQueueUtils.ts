import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useYearAssociationStore } from '../stores/useYearAssociationStore'
import type { QueueTask, QueueTaskCategoryInfo } from '../entities/QueueTasks'

export function useQueueUtils() {
  const numberAssociationStore = useNumberAssociationStore()
  const digitAssociationStore = useDigitAssociationStore()
  const yearAssociationStore = useYearAssociationStore()

  // Internal helper functions
  const getNrOfDueNumberToWordExercises = computed(() => numberAssociationStore.getDueNumbers.length)
  const getNrOfNewNumberToWordExercises = computed(() => numberAssociationStore.getNewNumbers.length)
  const getNrOfDueWordToNumberExercises = computed(() => numberAssociationStore.getDueWords.length)
  const getNrOfNewWordToNumberExercises = computed(() => numberAssociationStore.getNewWords.length)
  const getNrOfDueDigitToSoundExercises = computed(() => digitAssociationStore.getDueDigits.length)
  const getNrOfNewDigitToSoundExercises = computed(() => digitAssociationStore.getNewDigits.length)
  const getNrOfDueSoundToDigitExercises = computed(() => digitAssociationStore.getDueSounds.length)
  const getNrOfNewSoundToDigitExercises = computed(() => digitAssociationStore.getNewSounds.length)
  const getNrOfDueYearToEventsExercises = computed(() => yearAssociationStore.getDueYears.length)
  const getNrOfNewYearToEventsExercises = computed(() => yearAssociationStore.getNewYears.length)

  // Log counts for debugging
  console.log('Queue Utils - Exercise Counts:')
  console.log('Number Associations:')
  console.log(`  Number→Word: ${getNrOfDueNumberToWordExercises.value} due, ${getNrOfNewNumberToWordExercises.value} new`)
  console.log(`  Word→Number: ${getNrOfDueWordToNumberExercises.value} due, ${getNrOfNewWordToNumberExercises.value} new`)
  console.log('Digit Associations:')
  console.log(`  Digit→Sound: ${getNrOfDueDigitToSoundExercises.value} due, ${getNrOfNewDigitToSoundExercises.value} new`)
  console.log(`  Sound→Digit: ${getNrOfDueSoundToDigitExercises.value} due, ${getNrOfNewSoundToDigitExercises.value} new`)
  console.log('Year Associations:')
  console.log(`  Year→Events: ${getNrOfDueYearToEventsExercises.value} due, ${getNrOfNewYearToEventsExercises.value} new`)
  console.log('Peg Creation:')
  console.log(`  Create Peg: ${numberAssociationStore.unassociatedNumbers.length} available`)

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

  const getNrOfEligibleYearToEventsExercises = computed(() => 
    getNrOfDueYearToEventsExercises.value + getNrOfNewYearToEventsExercises.value
  )
  const getEligibleYearToEventsExercises = computed((): QueueTask[] => [
    ...yearAssociationStore.getDueYears.map(year => ({ 
      type: 'year' as const, 
      identifier: year, 
      direction: 'yearToEvents' as const 
    })),
    ...yearAssociationStore.getNewYears.map(year => ({ 
      type: 'year' as const, 
      identifier: year, 
      direction: 'yearToEvents' as const 
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

    if (getNrOfEligibleYearToEventsExercises.value > 0) {
      categories.push({
        name: 'yearToEvents',
        count: getNrOfEligibleYearToEventsExercises.value,
        exercises: getEligibleYearToEventsExercises.value
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

    // Year Association Exercises
    getNrOfEligibleYearToEventsExercises,
    getEligibleYearToEventsExercises,

    // Number Association Creation
    getNrOfDigitsWithoutAssociation,
    getDigitsWithoutAssociation,

    // Utility functions
    getRandomExercise
  }
}

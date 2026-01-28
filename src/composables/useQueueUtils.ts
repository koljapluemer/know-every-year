import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useYearAssociationStore } from '../stores/useYearAssociationStore'
import { useEventsStore } from '../stores/useEventsStore'
import type { QueueTask, QueueTaskCategoryInfo } from '../entities/QueueTasks'

// Special numbers that should be prioritized when creating associations
const PRIORITY_NUMBERS = [15, 16, 17, 18, 19, 20]

export function useQueueUtils() {
  const numberAssociationStore = useNumberAssociationStore()
  const digitAssociationStore = useDigitAssociationStore()
  const yearAssociationStore = useYearAssociationStore()
  const eventsStore = useEventsStore()

  // Only due logic
  const getNrOfDueNumberToWordExercises = computed(() => numberAssociationStore.getDueNumbers.length)
  const getDueNumberToWordExercises = computed((): QueueTask[] =>
    numberAssociationStore.getDueNumbers.map(number => ({
      component: 'TaskRememberWordByNumber' as const,
      identifier: number
    }))
  )

  const getNrOfDueWordToNumberExercises = computed(() => numberAssociationStore.getDueWords.length)
  const getDueWordToNumberExercises = computed((): QueueTask[] =>
    numberAssociationStore.getDueWords.map(number => ({
      component: 'TaskRememberNumberByWord' as const,
      identifier: number
    }))
  )

  const getNrOfDueDigitToSoundExercises = computed(() => digitAssociationStore.getDueDigits.length)
  const getDueDigitToSoundExercises = computed((): QueueTask[] =>
    digitAssociationStore.getDueDigits.map(digit => ({
      component: 'TaskRememberSoundByDigit' as const,
      identifier: digit.toString()
    }))
  )

  const getNrOfDueSoundToDigitExercises = computed(() => {
    // Count all sounds from digits that are due
    return digitAssociationStore.getDueSounds.reduce((total, digit) => {
      const association = digitAssociationStore.associations[digit]
      return total + (association?.sounds?.length || 0)
    }, 0)
  })
  
  const getDueSoundToDigitExercises = computed((): QueueTask[] => {
    const tasks: QueueTask[] = []
    digitAssociationStore.getDueSounds.forEach(digit => {
      const association = digitAssociationStore.associations[digit]
      if (association?.sounds) {
        association.sounds.forEach(sound => {
          tasks.push({
            component: 'TaskRememberDigitBySound' as const,
            identifier: sound
          })
        })
      }
    })
    return tasks
  })

  const getNrOfDueYearToEventsExercises = computed(() => yearAssociationStore.getDueYears.length)
  const getDueYearToEventsExercises = computed((): QueueTask[] =>
    yearAssociationStore.getDueYears.map(year => ({
      component: 'TaskRememberEventsByYear' as const,
      identifier: year
    }))
  )

  const getNrOfDueEventToYearExercises = computed(() => eventsStore.getDueEvents.length)
  const getDueEventToYearExercises = computed((): QueueTask[] =>
    eventsStore.getDueEvents.map(eventId => ({
      component: 'TaskRememberYearByEvent' as const,
      identifier: eventId
    }))
  )

  const getNrOfDigitsWithoutAssociation = computed(() => numberAssociationStore.unassociatedNumbers.length)
  const getDigitsWithoutAssociation = computed((): QueueTask[] =>
    numberAssociationStore.unassociatedNumbers.map(number => ({
      component: 'TaskCreateNumberAssociation' as const,
      identifier: number
    }))
  )

  // Debug logging - only computed when accessed
  const debugExerciseCounts = computed(() => {
    console.log('🔍 DEBUG: Queue Utils - Exercise Counts:')
    console.log('🔍 DEBUG: Current time:', new Date().toISOString())
    
    // Debug store states
    console.log('🔍 DEBUG: Number Association Store - Total associations:', Object.keys(numberAssociationStore.associations).length)
    console.log('🔍 DEBUG: Digit Association Store - Total associations:', Object.keys(digitAssociationStore.associations).length)
    console.log('🔍 DEBUG: Events Store - Total events:', Object.keys(eventsStore.events).length)
    console.log('🔍 DEBUG: Year Association Store - Total years:', Object.keys(yearAssociationStore.years).length)
    
    // Debug due calculations
    const dueNumbers = numberAssociationStore.getDueNumbers
    const dueWords = numberAssociationStore.getDueWords
    const dueDigits = digitAssociationStore.getDueDigits
    const dueSounds = digitAssociationStore.getDueSounds
    const dueYears = yearAssociationStore.getDueYears
    const dueEvents = eventsStore.getDueEvents
    
    console.log('🔍 DEBUG: Raw due results:')
    console.log('  Number→Word due:', dueNumbers.length, dueNumbers)
    console.log('  Word→Number due:', dueWords.length, dueWords)
    console.log('  Digit→Sound due:', dueDigits.length, dueDigits)
    console.log('  Sound→Digit due:', dueSounds.length, dueSounds)
    console.log('  Year→Events due:', dueYears.length, dueYears)
    console.log('  Event→Year due:', dueEvents.length, dueEvents)
    
    console.log('🔍 DEBUG: Computed counts:')
    console.log(`  Number→Word: ${getNrOfDueNumberToWordExercises.value} due`)
    console.log(`  Word→Number: ${getNrOfDueWordToNumberExercises.value} due`)
    console.log(`  Digit→Sound: ${getNrOfDueDigitToSoundExercises.value} due`)
    console.log(`  Sound→Digit: ${getNrOfDueSoundToDigitExercises.value} due`)
    console.log(`  Year→Events: ${getNrOfDueYearToEventsExercises.value} due`)
    console.log(`  Event→Year: ${getNrOfDueEventToYearExercises.value} due`)
    console.log(`  Create Peg: ${getNrOfDigitsWithoutAssociation.value} available`)
  })

  // Only due categories
  const getAvailableCategories = computed((): QueueTaskCategoryInfo[] => {
    // Trigger debug logging when categories are computed
    debugExerciseCounts.value
    
    const categories: QueueTaskCategoryInfo[] = []

    if (getNrOfDueNumberToWordExercises.value > 0) {
      categories.push({
        name: 'TaskRememberWordByNumber',
        count: getNrOfDueNumberToWordExercises.value,
        exercises: getDueNumberToWordExercises.value
      })
    }
    if (getNrOfDueWordToNumberExercises.value > 0) {
      categories.push({
        name: 'TaskRememberNumberByWord',
        count: getNrOfDueWordToNumberExercises.value,
        exercises: getDueWordToNumberExercises.value
      })
    }
    if (getNrOfDueDigitToSoundExercises.value > 0) {
      categories.push({
        name: 'TaskRememberSoundByDigit',
        count: getNrOfDueDigitToSoundExercises.value,
        exercises: getDueDigitToSoundExercises.value
      })
    }
    if (getNrOfDueSoundToDigitExercises.value > 0) {
      categories.push({
        name: 'TaskRememberDigitBySound',
        count: getNrOfDueSoundToDigitExercises.value,
        exercises: getDueSoundToDigitExercises.value
      })
    }
    if (getNrOfDueYearToEventsExercises.value > 0) {
      categories.push({
        name: 'TaskRememberEventsByYear',
        count: getNrOfDueYearToEventsExercises.value,
        exercises: getDueYearToEventsExercises.value
      })
    }
    if (getNrOfDueEventToYearExercises.value > 0) {
      categories.push({
        name: 'TaskRememberYearByEvent',
        count: getNrOfDueEventToYearExercises.value,
        exercises: getDueEventToYearExercises.value
      })
    }
    if (getNrOfDigitsWithoutAssociation.value > 0) {
      categories.push({
        name: 'TaskCreateNumberAssociation',
        count: getNrOfDigitsWithoutAssociation.value,
        exercises: getDigitsWithoutAssociation.value
      })
    }
    return categories
  })

  // Get a random exercise from a random category with fair distribution
  const getRandomExercise = (): QueueTask | null => {
    const availableCategories = getAvailableCategories.value
    if (availableCategories.length === 0) {
      return null
    }

    // Randomly select a category first (fair distribution)
    const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length)
    const selectedCategory = availableCategories[randomCategoryIndex]
    if (!selectedCategory) {
      return null
    }

    // If the selected category is TaskCreateNumberAssociation, apply priority number logic
    if (selectedCategory.name === 'TaskCreateNumberAssociation') {
      // Find which priority numbers are still missing associations
      const missingPriorityNumbers = PRIORITY_NUMBERS.filter(num =>
        !numberAssociationStore.hasAssociation(num.toString().padStart(2, '0'))
      )

      // If we have missing priority numbers, 30% chance to prioritize them
      if (missingPriorityNumbers.length > 0 && Math.random() < 0.3) {
        // Filter exercises to only include priority numbers
        const priorityExercises = selectedCategory.exercises.filter(task =>
          missingPriorityNumbers.includes(parseInt(task.identifier))
        )

        if (priorityExercises.length > 0) {
          const randomIndex = Math.floor(Math.random() * priorityExercises.length)
          return priorityExercises[randomIndex] ?? null
        }
      }

      // Otherwise, use normal random selection from all available exercises
      const randomExerciseIndex = Math.floor(Math.random() * selectedCategory.exercises.length)
      return selectedCategory.exercises[randomExerciseIndex] ?? null
    }

    // For other categories, use normal random selection
    const randomExerciseIndex = Math.floor(Math.random() * selectedCategory.exercises.length)
    return selectedCategory.exercises[randomExerciseIndex] ?? null
  }

  return {
    // Number Association Exercises
    getNrOfDueNumberToWordExercises,
    getDueNumberToWordExercises,
    getNrOfDueWordToNumberExercises,
    getDueWordToNumberExercises,
    // Digit Association Exercises
    getNrOfDueDigitToSoundExercises,
    getDueDigitToSoundExercises,
    getNrOfDueSoundToDigitExercises,
    getDueSoundToDigitExercises,
    // Year Association Exercises
    getNrOfDueYearToEventsExercises,
    getDueYearToEventsExercises,
    getNrOfDueEventToYearExercises,
    getDueEventToYearExercises,
    // Number Association Creation
    getNrOfDigitsWithoutAssociation,
    getDigitsWithoutAssociation,
    // Utility functions
    getAvailableCategories,
    getRandomExercise
  }
}

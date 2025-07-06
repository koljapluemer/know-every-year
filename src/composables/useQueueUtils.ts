import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import { useYearAssociationStore } from '../stores/useYearAssociationStore'
import { useEventsStore } from '../stores/useEventsStore'
import type { QueueTask, QueueTaskCategoryInfo } from '../entities/QueueTasks'

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

  const getNrOfDueSoundToDigitExercises = computed(() => digitAssociationStore.getDueSounds.length)
  const getDueSoundToDigitExercises = computed((): QueueTask[] =>
    digitAssociationStore.getDueSounds.map(sound => ({
      component: 'TaskRememberDigitBySound' as const,
      identifier: sound
    }))
  )

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

  const getNrOfYearsWithoutEvents = computed(() => {
    const eventsStore = useEventsStore()
    return yearAssociationStore.allYears.filter(year => {
      // Check if year has no events
      const events = eventsStore.getEventsForYear(year)
      if (events.length > 0) return false
      
      // Check if year has BOTH number associations (pegs)
      const yearNum = parseInt(year === '0000' ? '0' : year)
      const firstDigit = Math.floor(yearNum / 100).toString().padStart(2, '0')
      const secondDigit = (yearNum % 100).toString().padStart(2, '0')
      
      const hasFirstPeg = numberAssociationStore.hasAssociation(firstDigit)
      const hasSecondPeg = numberAssociationStore.hasAssociation(secondDigit)
      
      return hasFirstPeg && hasSecondPeg
    }).length
  })

  const getYearsWithoutEvents = computed((): QueueTask[] => {
    const eventsStore = useEventsStore()
    return yearAssociationStore.allYears
      .filter(year => {
        // Check if year has no events
        const events = eventsStore.getEventsForYear(year)
        if (events.length > 0) return false
        
        // Check if year has BOTH number associations (pegs)
        const yearNum = parseInt(year === '0000' ? '0' : year)
        const firstDigit = Math.floor(yearNum / 100).toString().padStart(2, '0')
        const secondDigit = (yearNum % 100).toString().padStart(2, '0')
        
        const hasFirstPeg = numberAssociationStore.hasAssociation(firstDigit)
        const hasSecondPeg = numberAssociationStore.hasAssociation(secondDigit)
        
        return hasFirstPeg && hasSecondPeg
      })
      .map(year => ({
        component: 'TaskCreateEventsForYear' as const,
        identifier: year
      }))
  })

  // Debug log - only due
  console.log('Queue Utils - Exercise Counts:')
  console.log('Number Associations:')
  console.log(`  Number→Word: ${getNrOfDueNumberToWordExercises.value} due`)
  console.log(`  Word→Number: ${getNrOfDueWordToNumberExercises.value} due`)
  console.log('Digit Associations:')
  console.log(`  Digit→Sound: ${getNrOfDueDigitToSoundExercises.value} due`)
  console.log(`  Sound→Digit: ${getNrOfDueSoundToDigitExercises.value} due`)
  console.log('Year Associations:')
  console.log(`  Year→Events: ${getNrOfDueYearToEventsExercises.value} due`)
  console.log(`  Event→Year: ${getNrOfDueEventToYearExercises.value} due`)
  console.log('Peg Creation:')
  console.log(`  Create Peg: ${getNrOfDigitsWithoutAssociation.value} available`)
  console.log('Event Creation:')
  console.log(`  Create Events: ${getNrOfYearsWithoutEvents.value} available`)

  // Only due categories
  const getAvailableCategories = computed((): QueueTaskCategoryInfo[] => {
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
    if (getNrOfYearsWithoutEvents.value > 0) {
      categories.push({
        name: 'TaskCreateEventsForYear',
        count: getNrOfYearsWithoutEvents.value,
        exercises: getYearsWithoutEvents.value
      })
    }
    return categories
  })

  // Get a random exercise from a random category with weighted priority for recent years
  const getRandomExercise = (): QueueTask | null => {
    const availableCategories = getAvailableCategories.value
    if (availableCategories.length === 0) {
      return null
    }

    // Special handling for TaskCreateEventsForYear to prioritize recent years
    const eventCreationCategory = availableCategories.find(cat => cat.name === 'TaskCreateEventsForYear')
    if (eventCreationCategory && eventCreationCategory.exercises.length > 0) {
      // Weight recent years more heavily (excluding years after 2000)
      const weightedExercises = eventCreationCategory.exercises.map(task => {
        const year = parseInt(task.identifier === '0000' ? '0' : task.identifier)
        let weight = 1
        
        if (year <= 2000 && year > 0) {
          // Recent years (1800-2000) get higher weight, decreasing exponentially
          weight = Math.exp((year - 1800) / 200) // Exponential decay from 1800 to 2000
        } else if (year > 2000) {
          // Years after 2000 get very low weight
          weight = 0.1
        } else if (year === 0) {
          // Year 0 gets medium weight
          weight = 0.5
        }
        
        return { task, weight }
      })
      
      // Calculate total weight
      const totalWeight = weightedExercises.reduce((sum, item) => sum + item.weight, 0)
      
      // Select random task based on weights
      let random = Math.random() * totalWeight
      for (const { task, weight } of weightedExercises) {
        random -= weight
        if (random <= 0) {
          return task
        }
      }
      
      // Fallback to first task if something goes wrong
      return weightedExercises[0].task
    }

    // For other categories, use normal random selection
    const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length)
    const selectedCategory = availableCategories[randomCategoryIndex]
    const randomExerciseIndex = Math.floor(Math.random() * selectedCategory.exercises.length)
    return selectedCategory.exercises[randomExerciseIndex]
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
    // Event Creation
    getNrOfYearsWithoutEvents,
    getYearsWithoutEvents,
    // Utility functions
    getAvailableCategories,
    getRandomExercise
  }
}

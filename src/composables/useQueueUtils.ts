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
    console.log(`  Create Events: ${getNrOfYearsWithoutEvents.value} available`)
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
    if (getNrOfYearsWithoutEvents.value > 0) {
      categories.push({
        name: 'TaskCreateEventsForYear',
        count: getNrOfYearsWithoutEvents.value,
        exercises: getYearsWithoutEvents.value
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
    
    // If the selected category is TaskCreateEventsForYear, apply weighted selection within that category
    if (selectedCategory.name === 'TaskCreateEventsForYear') {
      // Linear decay weighting: recent years get higher weight, but years after 2000 are devalued
      // Weight formula: 1.0 for year 0, linearly decreasing to 0.1 for year 2000, then 0.05 for years after 2000
      const weightedExercises = selectedCategory.exercises.map(task => {
        const year = parseInt(task.identifier === '0000' ? '0' : task.identifier)
        let weight = 1.0
        
        if (year <= 2000 && year > 0) {
          // Linear decay from year 0 (weight 1.0) to year 2000 (weight 0.1)
          // Formula: weight = 1.0 - (year / 2000) * 0.9
          weight = 1.0 - (year / 2000) * 0.9
        } else if (year > 2000) {
          // Years after 2000 get very low weight (too recent/boring)
          weight = 0.05
        } else if (year === 0) {
          // Year 0 gets full weight
          weight = 1.0
        }
        
        console.log(`🔍 DEBUG: Year ${year} gets weight ${weight}`)
        return { task, weight }
      })
      
      // Calculate total weight
      const totalWeight = weightedExercises.reduce((sum, item) => sum + item.weight, 0)
      console.log(`🔍 DEBUG: Total weight: ${totalWeight}`)
      
      // Select random task based on weights
      let random = Math.random() * totalWeight
      console.log(`🔍 DEBUG: Random value: ${random}`)
      for (const { task, weight } of weightedExercises) {
        random -= weight
        console.log(`🔍 DEBUG: Subtracting weight ${weight}, remaining: ${random}`)
        if (random <= 0) {
          console.log(`🔍 DEBUG: Selected year ${task.identifier}`)
          return task
        }
      }
      
      // Fallback to first task if something goes wrong
      console.log(`🔍 DEBUG: Fallback to first task: ${weightedExercises[0].task.identifier}`)
      return weightedExercises[0].task
    }

    // For other categories, use normal random selection
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

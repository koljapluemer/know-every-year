<template>
  <div>
    <!-- Controls -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Search</span>
        </label>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search in year, event, mental image, or notes..."
          class="input input-bordered w-full"
        />
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4">
        <label class="label cursor-pointer">
          <input 
            v-model="showOnlyYearsWithEvents" 
            type="checkbox" 
            class="checkbox checkbox-primary"
          />
          <span class="label-text ml-2">Show only years with events</span>
        </label>

        <label class="label cursor-pointer">
          <input 
            v-model="showOnlyYearsWithPegs" 
            type="checkbox" 
            class="checkbox checkbox-primary"
          />
          <span class="label-text ml-2">Show only years with pegs</span>
        </label>

        <label class="label cursor-pointer">
          <input 
            v-model="showHeadings" 
            type="checkbox" 
            class="checkbox checkbox-primary"
          />
          <span class="label-text ml-2">Add headings</span>
        </label>
      </div>
    </div>

    <!-- Results count -->
    <div class="mb-4">
      <p class="text-sm text-gray-600">
        Showing {{ filteredYears.length }} of {{ totalYears }} years
      </p>
    </div>

    <!-- Loading spinner -->
    <div v-if="isFiltering" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
      <span class="ml-2">Filtering years...</span>
    </div>

    <!-- Table -->
    <ListRenderYears 
      v-else
      :years="filteredYears"
      :show-headings="showHeadings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useYearAssociationStore } from '@/stores/useYearAssociationStore'
import { useEventsStore } from '@/stores/useEventsStore'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import ListRenderYears from '@/components/lists/render/ListRenderYears.vue'

const yearAssociationStore = useYearAssociationStore()
const eventsStore = useEventsStore()
const numberAssociationStore = useNumberAssociationStore()

// Reactive state
const searchQuery = ref('')
const showOnlyYearsWithEvents = ref(false)
const showOnlyYearsWithPegs = ref(false)
const showHeadings = ref(false)
const isFiltering = ref(false)
const filteredYears = ref<string[]>([])

// Computed properties
const totalYears = computed(() => yearAssociationStore.allYears.length)

// Debounced filtering
let filterTimeout: number | null = null

const performFiltering = async () => {
  isFiltering.value = true
  
  // Use nextTick to ensure UI updates before heavy computation
  await nextTick()
  
  // Small delay to ensure spinner shows
  await new Promise(resolve => setTimeout(resolve, 10))
  
  let years = yearAssociationStore.allYears

  // Apply filters
  if (showOnlyYearsWithEvents.value) {
    years = years.filter(year => {
      const events = eventsStore.getEventsForYear(year)
      return events.length > 0
    })
  }

  if (showOnlyYearsWithPegs.value) {
    years = years.filter(year => {
      // Check if year has events or notes
      const yearData = yearAssociationStore.getYear(year)
      const hasEventsOrNotes = (yearData?.events.length || 0) > 0 || (yearData?.notes && yearData.notes.trim() !== '')
      
      // Check if year has BOTH number associations (pegs)
      const yearNum = parseInt(year === '0000' ? '0' : year)
      const firstDigit = Math.floor(yearNum / 100).toString().padStart(2, '0')
      const secondDigit = (yearNum % 100).toString().padStart(2, '0')
      
      const hasFirstPeg = numberAssociationStore.hasAssociation(firstDigit)
      const hasSecondPeg = numberAssociationStore.hasAssociation(secondDigit)
      
      return hasEventsOrNotes || (hasFirstPeg && hasSecondPeg)
    })
  }

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    years = years.filter(year => {
      const yearData = yearAssociationStore.getYear(year)
      if (!yearData) return false

      // Search in year number
      if (year.toLowerCase().includes(query)) {
        return true
      }

      // Search in year notes
      if (yearData.notes && yearData.notes.toLowerCase().includes(query)) {
        return true
      }

      // Search in events for this year
      const events = eventsStore.getEventsForYear(year)
      return events.some(event => 
        event.content.toLowerCase().includes(query) ||
        event.mentalImage.toLowerCase().includes(query) ||
        (event.notes && event.notes.toLowerCase().includes(query))
      )
    })
  }

  filteredYears.value = years
  isFiltering.value = false
}

// Watch for changes and trigger filtering
watch([searchQuery, showOnlyYearsWithEvents, showOnlyYearsWithPegs], () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
  
  // Immediate feedback - show spinner
  isFiltering.value = true
  
  // Debounce the actual filtering
  filterTimeout = setTimeout(() => {
    performFiltering()
  }, 100)
}, { immediate: true })

// Initialize with all years
filteredYears.value = yearAssociationStore.allYears
</script>

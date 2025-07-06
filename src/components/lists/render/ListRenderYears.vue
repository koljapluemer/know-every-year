<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Year</th>
          <th>Events</th>
          <th class="hidden md:table-cell">Notes</th>
          <th class="hidden md:table-cell">Digit Associations</th>
          <th class="hidden md:table-cell">Learning Data</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="year in yearsWithHeadings" :key="isHeading(year) ? (year as HeadingItem).text : year">
          <!-- Century/Decade Heading -->
          <tr v-if="isHeading(year)" class="bg-base-200">
            <td colspan="5" class="text-center font-bold text-lg py-4">
              {{ (year as HeadingItem).text }}
            </td>
          </tr>
          
          <!-- Year Row -->
          <tr v-else class="hover">
            <ListWidgetYear :year="year as string" />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ListWidgetYear from '@/components/lists/widgets/ListWidgetYear.vue'

interface Props {
  years: string[]
  showHeadings: boolean
}

const props = defineProps<Props>()

interface HeadingItem {
  type: 'heading'
  text: string
}

const yearsWithHeadings = computed(() => {
  if (!props.showHeadings) {
    return props.years
  }

  const result: (string | HeadingItem)[] = []
  
  for (let i = 0; i < props.years.length; i++) {
    const year = props.years[i]
    const yearNum = parseInt(year === '0000' ? '0' : year)
    
    // Add century heading
    if (yearNum % 100 === 0 && yearNum !== 0) {
      result.push({
        type: 'heading',
        text: `${yearNum}s`
      })
    }
    // Add decade heading (but not for centuries)
    else if (yearNum % 10 === 0 && yearNum % 100 !== 0) {
      result.push({
        type: 'heading',
        text: `${yearNum}s`
      })
    }
    
    result.push(year)
  }
  
  return result
})

const isHeading = (year: string | HeadingItem): boolean => {
  return typeof year === 'object' && year.type === 'heading'
}
</script>

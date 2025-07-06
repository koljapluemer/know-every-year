<template>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal gap-2">
      <li v-for="item in navItems" :key="item.name">
        <RouterLink 
          class="btn" 
          :class="getButtonClasses(item.name)"
          :to="{ name: item.name }"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </div>
  
  <div class="navbar-end">
    <div class="dropdown dropdown-end lg:hidden">
      <div tabindex="0" role="button" class="btn btn-ghost">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink 
            class="btn w-full justify-start" 
            :class="getButtonClasses(item.name)"
            :to="{ name: item.name }"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavItem {
  name: string
  label: string
  isPrimary?: boolean
}

interface Props {
  navItems: NavItem[]
}

const props = defineProps<Props>()
const route = useRoute()

const getButtonClasses = (routeName: string) => {
  const isActive = route.name === routeName
  const navItem = props.navItems.find(item => item.name === routeName)
  
  if (isActive) {
    return 'btn-secondary'
  }
  
  return navItem?.isPrimary ? 'btn-primary' : ''
}
</script>

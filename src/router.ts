import { createRouter, createWebHistory } from 'vue-router'
import CompletePegsPage from './pages/CompletePegsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/complete-pegs'
    },
    {
      path: '/complete-pegs',
      name: 'CompletePegs',
      component: CompletePegsPage
    }
  ]
})

export default router

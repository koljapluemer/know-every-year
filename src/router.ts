import { createRouter, createWebHistory } from 'vue-router'
import CompleteNumberPegsPage from './pages/CompleteNumberPegsPage.vue'
import ListAllNumberPegsPage from './pages/ListAllNumberPegsPage.vue'

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
      component: CompleteNumberPegsPage
    },
    {
      path: '/list-pegs',
      name: 'ListPegs',
      component: ListAllNumberPegsPage
    }
  ]
})

export default router

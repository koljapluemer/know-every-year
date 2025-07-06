import { createRouter, createWebHistory } from 'vue-router'
import CompleteNumberPegsPage from './pages/CompleteNumberPegsPage.vue'
import ListAllNumberPegsPage from './pages/ListAllNumberPegsPage.vue'
import ManageNumberPegPage from './pages/ManageNumberPegPage.vue'
import QueuePage from './pages/QueuePage.vue'

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
    },
    {
      path: '/manage-pegs/:number',
      name: 'ManagePeg',
      component: ManageNumberPegPage,
      props: true
    },
    {
      path: '/practice',
      name: 'Practice',
      component: QueuePage
    }
  ]
})

export default router

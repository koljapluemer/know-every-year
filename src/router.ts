import { createRouter, createWebHistory } from 'vue-router'
import ListAllNumberPegsPage from './pages/ListAllNumberPegsPage.vue'
import ManageNumberPegPage from './pages/ManageNumberPegPage.vue'
import ManageDigitPegsPage from './pages/ManageDigitPegsPage.vue'
import QueuePage from './pages/QueuePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/complete-pegs'
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
      path: '/manage-digit-pegs',
      name: 'ManageDigitPegs',
      component: ManageDigitPegsPage
    },
    {
      path: '/practice',
      name: 'Practice',
      component: QueuePage
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import ListAllNumberPegsPage from './pages/PageNumberAssociationsList.vue'
import ManageNumberPegPage from './pages/PageNumberAssociationManage.vue'
import ManageDigitPegsPage from './pages/PageDigitAssociationsManage.vue'
import QueuePage from './pages/PageQueue.vue'
import ListAllYearsPage from './pages/PageYearsList.vue'
import ManageYearPage from './pages/PageYearManage.vue'
import PageHome from './pages/PageHome.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: PageHome
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
    },
    {
      path: '/year-associations',
      name: 'YearAssociations',
      component: ListAllYearsPage
    },
    {
      path: '/manage-year/:year',
      name: 'ManageYear',
      component: ManageYearPage,
      props: true
    }
  ]
})

export default router

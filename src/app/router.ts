import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: import("@/pages/landing/PageLanding.vue")
    },
    {
      path: '/practice',
      name: 'Practice',
      component: import("@/pages/practice/PagePractice.vue")
    }
  ]
})

export default router

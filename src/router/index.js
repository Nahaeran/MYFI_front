import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DepositListView from '@/views/DepositListView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import BankMapView from '@/views/BankMapView.vue'
import PostListView from '@/views/PostListView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/compare/deposit',
      name: 'depositList',
      component: DepositListView
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: ExchangeView
    },
    {
      path: '/bank',
      name: 'bankMap',
      component: BankMapView
    },
    {
      path: '/posts',
      name: 'postList',
      component: PostListView
    },
    {
      path: '/signup',
      name: 'signUp',
      component: SignUpView
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView
    },
  ]
})

export default router

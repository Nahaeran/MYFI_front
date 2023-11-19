import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/users'
import HomeView from '@/views/HomeView.vue'
import DepositListView from '@/views/DepositListView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import BankMapView from '@/views/BankMapView.vue'
import PostListView from '@/views/PostListView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostCreateView from '@/views/PostCreateView.vue'
import PostUpdateView from '@/views/PostUpdateView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import MyPageView from '@/views/MyPageView.vue'

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
      path: '/posts/:id',
      name: 'postDetail',
      component: PostDetailView
    },
    {
      path: '/posts/write',
      name: 'postCreate',
      component: PostCreateView,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (!userStore.isLogin) {
          alert('로그인 후 이용 가능합니다.')
          return { name: 'signIn'}
        }
      }
    },
    {
      path: '/posts/:id/update',
      name: 'postUpdate',
      component: PostUpdateView,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (!userStore.isLogin) {
          alert('로그인 후 이용 가능합니다.')
          return { name: 'signIn'}
        }
      }
    },
    {
      path: '/signup',
      name: 'signUp',
      component: SignUpView,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (userStore.isLogin) {
          alert('이미 로그인 되어있습니다.')
          return false
        }
      }
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignInView,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (userStore.isLogin) {
          alert('이미 로그인 되어있습니다.')
          return false
        }
      }
    },
    {
      path: '/:username',
      name: 'myPage',
      component: MyPageView,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (!userStore.isLogin) {
          alert('로그인 후 이용 가능합니다.')
          return { name: 'signIn'}
        }
      }
    },
  ]
})

export default router

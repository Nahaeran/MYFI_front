import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '@/stores/users'

export const usePostStore = defineStore('posts', () => {
  const router = useRouter()
  const posts = ref([])
  const userStore = useUserStore()
  
  const getPosts = function () {
    axios({
      method: 'get',
      url: `${userStore.API_URL}/posts/`
    })
      .then((res) => {
        posts.value = res.data
        console.log(posts.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return { posts, getPosts }
}, { persist: true })
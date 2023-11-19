import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '@/stores/users'

export const usePostStore = defineStore('posts', () => {
  const API_URL = 'http://127.0.0.1:8000'
  const router = useRouter()
  const posts = ref([])
  const userStore = useUserStore()
  
  const getPosts = function () {
    axios({
      method: 'get',
      url: `${API_URL}/posts/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return { posts, getPosts }
}, { persist: true })
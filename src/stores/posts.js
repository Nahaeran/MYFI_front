import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '@/stores/users'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const totalPage = ref(1)
  const nextLink = ref('')
  const prevLink = ref('')
  const userStore = useUserStore()
  
  const getPosts = function (pageNum=1) {
    const url = pageNum === 1 ? `${userStore.API_URL}/posts/` : `${userStore.API_URL}/posts/?page=${pageNum}`
    axios({
      method: 'get',
      url: url
    })
      .then((res) => {
        posts.value = res.data.results
        totalPage.value = Math.ceil(res.data.count / 10)
        nextLink.value = res.data.next
        prevLink.value = res.data.previous
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return { posts, totalPage, nextLink, prevLink, getPosts }
}, { persist: true })
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', () => {
  const API_URL = 'http://127.0.0.1:8000'
  const router = useRouter()
  const token = ref(null)
  const isLogin = computed(() => {
    return token.value === null ? false : true
  })

  const signUp = function (payload) {
    const { username, name, email, password1, password2 } = payload

    axios({
      method: 'post',
      url: `${API_URL}/dj-rest-auth/registation/`,
      data: {
        username,
        name,
        email,
        password1,
        password2
      }
    })
      .then((res) => {
        logIn({ username, password: password1 })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const logIn = function (payload) {
    const { username, password } = payload

    axios({
      method: 'post',
      url: `${API_URL}/dj-rest-auth/login/`,
      data: {
        username,
        password
      }
    })
      .then((res) => {
        token.value = res.data.key
        router.push({ name: 'home' })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return { token, isLogin, signUp, logIn }
}, { persist: true })
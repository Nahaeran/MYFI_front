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
  const userInfo = ref([])

  const getUserInfo = function (username) {
    axios({
      method: 'get',
      url: `${API_URL}/users/${username}/info/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        userInfo.value = res.data
        console.log(userInfo.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const signUp = function (payload) {
    const { username, name, email, password1, password2 } = payload

    axios({
      method: 'post',
      url: `${API_URL}/dj-rest-auth/registration/`,
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
        getUserInfo(username)
        router.push({ name: 'home' })
        return true
      })
      .catch((err) => {
        console.clear()
        return false
      })
  }

  const logOut = function () {
    axios({
      method: 'post',
      url: `${API_URL}/dj-rest-auth/logout/`,
    })
      .then((res) => {
        token.value = null
        userInfo.value = []
        router.push({ name: 'home' })
      })
      .catch((err) => {
        console.log(err)
      })

  }

  return { API_URL, token, isLogin, userInfo, getUserInfo, signUp, logIn, logOut }
}, { persist: true })
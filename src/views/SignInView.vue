<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const show = ref(false)

const username = ref('')
const password = ref('')

const logIn = function () {
  const payload = {
    username: username.value,
    password: password.value
  }
  userStore.logIn(payload)
}
</script>

<template>
  <v-card class="container">
    <h1>Sign in to <span class="color">MYFI</span></h1>

    <form @submit.prevent="logIn">
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="아이디"
        v-model="username"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        label="비밀번호"
        v-model="password"
        @click:append="show = !show"
      ></v-text-field>

      <v-btn
        block
        variant="flat"
        color="#1089FF"
        @click.prevent="logIn"
      >
        Sign in
      </v-btn>
    </form>
  </v-card>
</template>

<style scoped>
.container {
  width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
}

form {
  margin-top: 1rem;
}
</style>
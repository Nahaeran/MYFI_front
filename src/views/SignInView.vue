<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const show = ref(false)

const username = ref('')
const password = ref('')
const isRight = ref(true)

const logIn = function () {
  const payload = {
    username: username.value,
    password: password.value
  }
  isRight.value = userStore.logIn(payload)

  if (!isRight.value) {
    username.value = password.value = ''
  }
}
</script>

<template>
  <v-card class="container">
    <h1>Sign in to <span class="color">MYFI</span></h1>

    <form @submit="logIn">
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
      <div v-show="!isRight" class="warning text-red">
        <p>아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다.</p>
        <p>입력하신 내용을 다시 확인해주세요.</p>
      </div>
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

<style>
.warning {
  text-align: start;
  margin-bottom: 1.2rem;
  font-size: 15px;
}
</style>
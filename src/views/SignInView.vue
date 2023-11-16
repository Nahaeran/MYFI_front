<script setup>
import { computed, ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
</script>

<template>
  <v-card class="container">
    <h1>Sign in to <span>MYFI</span></h1>

    <form>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="아이디"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        label="비밀번호"
        @click:append="show1 = !show1"
      ></v-text-field>

      <v-btn
        block
        variant="flat"
        color="#1089FF"
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

h1 span {
  color: #1089FF;
}

form {
  margin-top: 1rem;
}
</style>
<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const checkList = ['service', 'info']
const selected = ref([])
const show1 = ref(false)
const show2 = ref(false)

const isAgreeAll = computed({
  get() {
    return checkList.length === selected.value.length
  },
  set(e) {
    selected.value = e ? checkList : []
  }  
})

const username = ref('')
const name = ref('')
const email = ref('')
const password1 = ref('')
const password2 = ref('')

const signUp = function () {
  const payload = {
    username: username.value,
    name: name.value,
    email: email.value,
    password1: password1.value,
    password2: password2.value,
  }
  console.log(payload)
  userStore.signUp(payload)
}

</script>

<template>
  <v-card class="container">
    <h1>Sign up to <span class="color">MYFI</span></h1>

    <div class="checkbox">
      <v-checkbox
        color="#1089FF"
        label="(필수) 서비스 이용약관 동의"
        value="service"
        v-model="selected"
      ></v-checkbox>
      <v-checkbox
        color="#1089FF"
        label="(필수) 개인정보 처리 동의"
        value="info"
        v-model="selected"
      ></v-checkbox>
      <v-checkbox
        color="#1089FF"
        v-model="isAgreeAll"
      >
        <template v-slot:label>
          <span class="color">전체 동의</span>
        </template>
      </v-checkbox>
    </div>

    <form @submit.prevent="signUp">
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="아이디"
        v-model="username"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="이름"
        v-model="name"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="이메일"
        v-model="email"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        label="비밀번호"
        v-model="password1"
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        label="비밀번호 확인"
        v-model="password2"
        @click:append="show2 = !show2"
      ></v-text-field>

      <v-btn
        block
        variant="flat"
        color="#1089FF"
        @click.prevent="signUp"
      >
        Sign up
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

.checkbox {
  margin: 1rem 0;
}

.v-checkbox {
  height: 40px;
}
</style>
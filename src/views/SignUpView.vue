<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/users'
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength, maxLength, alphaNum, sameAs, helpers } from '@vuelidate/validators'

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

const errorAgree = ref('ㅤ')

const initialState = {
  username: '',
  name: '',
  email: '',
  password1: '',
  password2: '',
}

const state = ref({
  ...initialState
})

const rules = {
  username: { 
    required: helpers.withMessage('필수 정보입니다.', required),
    alphaNum: helpers.withMessage('영어 대소문자와 숫자만 입력가능합니다.', alphaNum),
    minLength: helpers.withMessage('5자 이상 입력해야합니다.', minLength(5)),
    maxLength: helpers.withMessage('20자 이하로 입력해야합니다.', maxLength(20))
  },
  name: { 
    required: helpers.withMessage('필수 정보입니다.', required),
    maxLength: helpers.withMessage('20자 이하로 입력해야합니다.', maxLength(20))
  },
  email: {
    required: helpers.withMessage('필수 정보입니다.', required),
    email: helpers.withMessage('이메일 주소가 정확한지 확인해 주세요.', email),
    maxLength: helpers.withMessage('100자 이하로 입력해야합니다.', maxLength(100))
  },
  password1: { 
    required: helpers.withMessage('필수 정보입니다.', required),
    minLength: helpers.withMessage('8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요. 특수문자는 *!@#$%^&만 사용가능합니다.', minLength(8)),
    maxLength: helpers.withMessage('8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요. 특수문자는 *!@#$%^&만 사용가능합니다.', maxLength(16)),
    containspasswordrequirement: helpers.withMessage(
      () => `8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요. 특수문자는 *!@#$%^&만 사용가능합니다.`, 
      (value) => /(?=.*[a-z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(value)
    )
  },
  password2: { 
    required: helpers.withMessage('필수 정보입니다.', required),
    sameAsPassword: helpers.withMessage('비밀번호가 일치하지 않습니다.',
      sameAs(computed(() => state.value.password1))
    )
  }
}

const v$ = useVuelidate(rules, state)

function clear () {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value
  }
}

const signUp = function () {
  v$.value.$validate()
  
  if (selected.value.length !== checkList.length) {
    errorAgree.value = '약관에 동의하셔야 합니다.'
  } else {
    errorAgree.value = 'ㅤ'
    if (!v$.value.$error){
      const payload = {
        username: state.value.username,
        name: state.value.name,
        email: state.value.email,
        password1: state.value.password1,
        password2: state.value.password2,
      }
      userStore.signUp(payload)
    }
  }
}

</script>

<template>
  <v-card class="container">
    <h1>Sign up to <span class="color">MYFI</span></h1>

    <div class="checkbox">
      <p 
        class="warning"
        v-text="errorAgree"
      ></p>
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

    <form @submit.prevent="signUp" @keypress.enter="signUp">
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="아이디"
        v-model="state.username"
        :error-messages="v$.username.$errors.map(e => e.$message)"
        @input="v$.username.$touch"
        @blur="v$.username.$touch"
      ></v-text-field>

      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="이름"
        v-model="state.name"
        :error-messages="v$.name.$errors.map(e => e.$message)"
        @input="v$.name.$touch"
        @blur="v$.name.$touch"
      ></v-text-field>

      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="이메일"
        v-model="state.email"
        :error-messages="v$.email.$errors.map(e => e.$message)"
        @input="v$.email.$touch"
        @blur="v$.email.$touch"
      ></v-text-field>

      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        label="비밀번호"
        v-model="state.password1"
        @click:append="show1 = !show1"
        :error-messages="v$.password1.$errors.map(e => e.$message)"
        @input="v$.password1.$touch"
        @blur="v$.password1.$touch"
      ></v-text-field>

      <v-text-field
        variant="outlined"
        color="#1089FF"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        label="비밀번호 확인"
        v-model="state.password2"
        @click:append="show2 = !show2"
        :error-messages="v$.password2.$errors.map(e => e.$message)"
        @input="v$.password2.$touch"
        @blur="v$.password2.$touch"
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

form * {
  text-align: start;
  margin: 0.6rem 0;
}

.warning {
  color: #b00020;
  font-size: 12px;
  margin: 0 0 0 15px;
}
</style>
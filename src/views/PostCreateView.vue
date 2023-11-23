<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GoToBack from '@/components/GoToBack.vue'
import PostForm from '@/components/PostForm.vue'
import { useUserStore } from '@/stores/users'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import axios from 'axios'

const initialState = {
  title: '',
  content: ''
}

const state = ref({
  ...initialState
})

const router = useRouter()
const userStore = useUserStore()

const rules = {
  title: {
    required: helpers.withMessage('필수 정보입니다.', required),
    maxLength: helpers.withMessage('300자 이하로 입력해야합니다.', maxLength(300))
  },
  content: {
    required: helpers.withMessage('필수 정보입니다.', required),
    maxLength: helpers.withMessage('10000자 이하로 입력해야합니다.', maxLength(10000))
  }
}

const v$ = useVuelidate(rules, state)

const createPost = function () {
  // state.value.title = title
  // state.value.content = content

  v$.value.$validate()

  if (!v$.value.$error) {
    axios({
      method: 'post',
      url: `${userStore.API_URL}/posts/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      },
      data: {
        title: state.value.title,
        content: state.value.content
      }
    })
      .then((res) => {
        router.push({ name: 'postDetail', params: { id: res.data.id }, query: { page: 1 } })
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<template>
  <div class="container">
    <GoToBack :goName="{ name: 'postList' }" />
    <h1>글 쓰기</h1>
    <v-form class="my-5" @keypress.enter="createPost">
      <v-text-field
        variant="outlined"
        color="#1089FF"
        label="제목"
        v-model="state.title"
        :error-messages="v$.title.$errors.map(e => e.$message)"
        @input="v$.title.$touch"
        @blur="v$.title.$touch"
      ></v-text-field>
      <v-textarea
        variant="outlined"
        color="#1089FF"
        label="내용"
        v-model="state.content"
        auto-grow
        rows="15"
        row-height="25"
        shaped
        :error-messages="v$.content.$errors.map(e => e.$message)"
        @input="v$.content.$touch"
        @blur="v$.content.$touch"
      ></v-textarea>
      <v-btn
        block
        variant="flat"
        color="#1089FF"
        @click.prevent="createPost"
      >
        게시물 포스팅
      </v-btn>
    </v-form>
    <!-- <PostForm 
      :title="state.title"
      :content="state.content"
      btn-string="게시물 포스팅"
      :v$="v$"
      @submit-form="createPost"
    /> -->
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  margin: 2rem auto;
}

</style>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/users'
import GoToBack from '@/components/GoToBack.vue'
import axios from 'axios'
import router from '../router'

const route = useRoute()
const postId = route.params.id

const post = ref()
const comments = ref()
const isPostedUser = ref(false)
const commentContent = ref('')

const userStore = useUserStore()

onMounted(() => {
  axios({
      method: 'get',
      url: `${userStore.API_URL}/posts/${postId}/`
    })
      .then((res) => {
        // setTimeout(() => {
        //   post.value = res.data
        //   if (post.value.user.username === userStore.userInfo.username) {
        //     isPostedUser.value = true
        //   }
        // }, 300)
        post.value = res.data
        if (post.value.user.username === userStore.userInfo.username) {
          isPostedUser.value = true
        }
      })
      .catch((err) => {
        console.log(err)
      })

  axios({
    method: 'get',
    url: `${userStore.API_URL}/posts/${postId}/comments/`
  })
    .then((res) => {
      comments.value = res.data
      console.log(comments.value)
    })
    .catch((err) => {
      console.log(err)
    })
})

const deletePost = function () {
  const answer = window.confirm('정말 삭제하시겠습니까?')

  if (answer) {
    axios({
      method: 'delete',
      url: `${userStore.API_URL}/posts/${postId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res.data)
        router.push({ name: 'postList'})
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
}
</script> 

<template>
  <div>
    <div v-if="post" class="container">
      <GoToBack />
      <header>
        <p class="text-subtitle-2">{{ post.id }}번째 게시물</p>
        <h1>{{ post.title }}</h1>
        <div class="d-flex justify-space-between">
          <div class="left">
            <span class="text-caption">작성일 : 
            {{ post.created_at.slice(0, 4) }}년 
            {{ post.created_at.slice(5, 7) }}월 
            {{ post.created_at.slice(8, 10) }}일 
            {{ post.created_at.slice(11, 19) }} | 
          </span>
          <span class="text-caption">수정일 : 
            {{ post.updated_at.slice(0, 4) }}년 
            {{ post.updated_at.slice(5, 7) }}월 
            {{ post.updated_at.slice(8, 10) }}일 
            {{ post.updated_at.slice(11, 19) }} 
          </span>
          </div>
          <div v-if="isPostedUser" class="right">
            <v-btn
              class="mr-2"
              size="small"
              variant="tonal"
              color="green-darken-2"
            >수정</v-btn>
            <v-btn
              size="small"
              variant="tonal"
              color="red-darken-2"
              @click.prevent="deletePost"
            >삭제</v-btn>
          </div>
        </div>
      </header>
      <v-divider class="my-3"></v-divider>

      <main>
        <article class="text-body-1 my-10">
          {{ post.content }}
        </article>
      </main>
      <v-divider class="my-3"></v-divider>

      <h3>댓글</h3>
      <div v-if="userStore.isLogin" class="my-4">
        <v-form
          class="d-flex align-center"
        >
          <v-text-field
            label="댓글"
            color="#1089FF"
            variant="outlined"
            v-model="commentContent"
          ></v-text-field>
          <v-btn
            color="#1089FF"
            variant="tonal"
            size="large"
            class="mb-5 ml-3"
          >
            댓글 작성
          </v-btn>
        </v-form>
      </div>

      <div class="comment-container" v-for="comment in comments" :key="comment.id">
        <div class="upper d-flex align-center mb-2">
          <v-avatar size="x-small">
            <v-img
              id="img"
              :src="`${userStore.API_URL}${comment.user.profile_img}`"
              alt="profile-img"
            ></v-img>
          </v-avatar>
          <p class="ml-1 text-caption">{{ comment.user.name }}</p>
        </div>
        <div class="lower mt-1 mb-10 text-body-2 d-flex justify-space-between align-start">
          <p class="comment-left">{{ comment.content }}</p>
          <div v-if="comment.user.username === userStore.userInfo.username" class="right">
            <v-btn
              class="mr-2"
              size="small"
              variant="tonal"
              color="green-darken-2"
            >수정</v-btn>
            <v-btn
              size="small"
              variant="tonal"
              color="red-darken-2"
            >삭제</v-btn>
          </div>
        </div>
      </div>
      
    </div>
    <div v-else class="loading">
      <v-progress-circular
        color="#1089FF"
        indeterminate
        size="80"
        ></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  margin: 2rem auto;
}

.loading { 
  display: flex;
  height: 80vh;
  align-items: center;
  justify-content: center;
}

.comment-left {
  width: 892px;
}

.right {
  width: 108px;
}
</style>
<script setup>
import { ref, onMounted, createCommentVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import GoToBack from '@/components/GoToBack.vue'
import axios from 'axios'

const route = useRoute()
const postId = route.params.id
const router = useRouter()

const post = ref()
const comments = ref()

const dialog = ref(false)
const isPostedUser = ref(false)
const commentContent = ref('')
const updatedCommentId = ref()
const updatedCommentContent = ref('')

const userStore = useUserStore()

const getComments = function () {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/posts/${postId}/comments/`
  })
    .then((res) => {
      comments.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

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
        post.value.content = res.data.content.replaceAll("\n", "<br />")
        
        if (post.value.user.username === userStore.userInfo.username) {
          isPostedUser.value = true
        }
      })
      .catch((err) => {
        console.log(err)
      })

  // axios({
  //   method: 'get',
  //   url: `${userStore.API_URL}/posts/${postId}/comments/`
  // })
  //   .then((res) => {
  //     comments.value = res.data
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  getComments()
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
        router.push({ name: 'postList'})
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const createComment = function () {
  axios({
    method: 'post',
    url: `${userStore.API_URL}/posts/${postId}/comments/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    },
    data: {
      content: commentContent.value
    }
  })
    .then((res) => {
      comments.value.push(res.data)
      commentContent.value = ''
    })
    .catch((err) => {
      console.log(err)
    })
}

const deleteComment = function (commentId) {
  const answer = window.confirm('정말 삭제하시겠습니까?')

  if (answer) {
    axios({
      method: 'delete',
      url: `${userStore.API_URL}/posts/${postId}/comments/${commentId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        comments.value = comments.value.filter((comment) => comment.id != commentId)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const close = function () {
  dialog.value = false
}

const editComment = function (commentId, value) {
  updatedCommentId.value = commentId
  updatedCommentContent.value = value
  
  dialog.value = true
}

const save = function () {
  axios({
    method: 'put',
    url: `${userStore.API_URL}/posts/${postId}/comments/${updatedCommentId.value}/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    },
    data: {
      content: updatedCommentContent.value
    }
  })
    .then((res) => {
      getComments()
      dialog.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}
</script> 

<template>
  <div>
    <div v-if="post" class="container">
      <GoToBack />
      <header>
        <p class="text-subtitle-2">{{ post.id }}번째 게시물</p>
        <div class="d-flex justify-space-between align-center">
          <h1>{{ post.title }}</h1>
          <div class="d-flex">
            <p class="mr-2 text-caption">작성자 :</p>
            <v-avatar size="x-small">
              <v-img
                cover
                :src="`${userStore.API_URL}${post.user.profile_img}`"
                alt="profile-img"
              ></v-img>
            </v-avatar>
            <p class="ml-1 text-caption">{{ post.user.name }}</p>
          </div>
        </div>
        
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
              :to="{ name: 'postUpdate', params: { id: postId }}"
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
          <div v-html="post.content"></div>
        </article>
      </main>
      <v-divider class="my-3"></v-divider>

      <h3 class="mb-5">댓글</h3>
      <div v-if="userStore.isLogin" class="my-4">
        <v-form
          class="d-flex align-center"
          @submit.prevent="createComment"
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
            @click.prevent="createComment"
          >
            댓글 작성
          </v-btn>
        </v-form>
      </div>

      <v-dialog v-model="dialog" width="400">
            <v-card>
              <v-card-title>
                <span class="mx-2 font-weight-bold">댓글 수정</span>
              </v-card-title>

              <v-card-text>
                <v-text-field
                  color="#1089FF"
                  v-model="updatedCommentContent"
                  label="댓글"
                  @keypress.enter="save"
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#1089FF" variant="text" @click="close">
                  취소
                </v-btn>
                <v-btn color="#1089FF" variant="text" @click="save">
                  수정
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

      <div class="comment-container" v-for="comment in comments" :key="comment.id">
        <div class="upper d-flex align-center mb-2">
          <v-avatar size="x-small">
            <v-img
              cover
              :src="`${userStore.API_URL}${comment.user.profile_img}`"
              alt="profile-img"
            ></v-img>
          </v-avatar>
          <p class="ml-1 text-caption">{{ comment.user.name }}</p>
        </div>
        <div class="lower mt-1 mb-10 text-body-2 d-flex justify-space-between align-start">
          <p class="comment-left" v-html="comment.content"></p>
          <div v-if="comment.user.username === userStore.userInfo.username" class="right">
            <v-btn
              class="mr-2"
              size="small"
              variant="tonal"
              color="green-darken-2"
              @click="editComment(comment.id, comment.content)"
            >수정</v-btn>
            <v-btn
              size="small"
              variant="tonal"
              color="red-darken-2"
              @click="deleteComment(comment.id)"
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
  width: 880px;
}

.right {
  width: 120px;
}
</style>
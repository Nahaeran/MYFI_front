<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/posts'
import { useUserStore } from '@/stores/users'

const postStore = usePostStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const queryPage = route.query?.page
const page = ref(Number(queryPage))

watch(page, () => {
  postStore.getPosts(page.value)
  window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  router.push({ name: 'postList', query: { page: page.value }})
})

const clickTr = (postId) => {
  router.push({ name: 'postDetail', params: {id: postId }, query: { page: page.value }})
}

onMounted(() => {
  postStore.getPosts(page.value)
})
</script>

<template>
  <div class="container">
    <div class="d-flex justify-space-between align-end">
      <h1>금융상품 <span class="color">자유</span> 게시판</h1>
      <v-btn
        v-if="userStore.isLogin"
        variant="flat"
        color="#1089FF"
        :to="{ name: 'postCreate' }"
      >글 쓰기</v-btn>
    </div>
    <v-table class="table  elevation-6">
      <thead>
        <tr>
          <th class="text-left pl-15">
            제목
          </th>
          <th class="text-left">
            작성자
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="post in postStore.posts"
          :key="post.id"
          @click="clickTr(post.id)"
        >
          <td class="pl-15">{{ post.title }}</td>
          <td width="25%" class="text-left">
            <v-avatar size="small">
                <v-img
                  cover
                  id="img"
                  :src="`${userStore.API_URL}${post.user.profile_img}`"
                  alt="profile-img"
                ></v-img>
              </v-avatar>
            {{ post.user.name }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="page"
      :length="postStore.totalPage"
      :total-visible="6"
      color="#1089FF"
      rounded="circle"
    ></v-pagination>
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  margin: 2rem auto;
}

.container > * {
  margin: 1rem;
}

.table {
  /* border: 1px solid gray; */
  border-radius: 5px;
}

tbody > tr {
  transition: 200ms;
  cursor: pointer;
}

tbody > tr:hover {
  background-color: rgb(247, 250, 253);
}
</style>
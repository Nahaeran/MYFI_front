<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/posts'
import { useUserStore } from '@/stores/users'

const postStore = usePostStore()
const userStore = useUserStore()
const router = useRouter()

// let id = 1
// const posts = [
//   {
//     id: id++,
//     title: "✨ ㅇㅇㅇ은행 ㅁㅁㅁㅁ금융상품 후기 !! ✨",
//     user: {
//       name: '나해란'
//     }
//   },
//   {
//     id: id++,
//     title: "ㅁㅁ은행의 XXX금융상품 추천합니다. ❗❗",
//     user: {
//       name: '송찬의'
//     }
//   },
//   {
//     id: id++,
//     title: "✨ ㅇㅇㅇ은행 ㅁㅁㅁㅁ금융상품 후기 !! ✨",
//     user: {
//       name: '나해란'
//     }
//   },
//   {
//     id: id++,
//     title: "ㅁㅁ은행의 XXX금융상품 추천합니다. ❗❗",
//     user: {
//       name: '송찬의'
//     }
//   },
//   {
//     id: id++,
//     title: "✨ ㅇㅇㅇ은행 ㅁㅁㅁㅁ금융상품 후기 !! ✨",
//     user: {
//       name: '나해란'
//     }
//   },
//   {
//     id: id++,
//     title: "ㅁㅁ은행의 XXX금융상품 추천합니다. ❗❗",
//     user: {
//       name: '송찬의'
//     }
//   },{
//     id: id++,
//     title: "✨ ㅇㅇㅇ은행 ㅁㅁㅁㅁ금융상품 후기 !! ✨",
//     user: {
//       name: '나해란'
//     }
//   },
//   {
//     id: id++,
//     title: "ㅁㅁ은행의 XXX금융상품 추천합니다. ❗❗",
//     user: {
//       name: '송찬의'
//     }
//   },
//   {
//     id: id++,
//     title: "✨ ㅇㅇㅇ은행 ㅁㅁㅁㅁ금융상품 후기 !! ✨",
//     user: {
//       name: '나해란'
//     }
//   },
//   {
//     id: id++,
//     title: "ㅁㅁ은행의 XXX금융상품 추천합니다. ❗❗",
//     user: {
//       name: '송찬의'
//     }
//   },
// ]

const clickTr = (postId) => {
  router.push({ name: 'postDetail', params: {id: postId}})
}

onMounted(() => {
  postStore.getPosts()
})
</script>

<template>
  <div class="container">
    <h1>금융 상품 <span class="color">후기</span> 게시판</h1>
    <v-table class="table">
      <thead>
        <tr>
          <!-- <th style="border-color: #e6f1fd;" class="text-left pl-10"> -->
          <th class="text-left pl-10">
            제목
          </th>
          <th class="text-center">
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
          <td class="pl-10">{{ post.title }}</td>
          <td width="30%" class="text-center">
            <v-avatar size="small">
                <v-img
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
      :length="15"
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
  border: 1px solid gray;
  border-radius: 5px;
}

/* thead > tr {
  background-color: #e6f1fd;
} */

.text-left {
  color: #1089FF;
  font-weight: 900;
}

tbody > tr {
  transition: 200ms;
  cursor: pointer;
}

tbody > tr:hover {
  background-color: rgb(247, 250, 253);
}
</style>
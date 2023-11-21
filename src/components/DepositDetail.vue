<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GoToBack from '@/components/GoToBack.vue'
import { useUserStore } from '@/stores/users'
import axios from 'axios'

const deposit = ref()

const route = useRoute()
const userStore = useUserStore()

const depositCode = route.params.depositCode

onMounted(() => {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/financial/deposit_list/${depositCode}/`
  })
    .then((res) => {
      deposit.value = res.data
      console.log(deposit.value)
    })
    .catch((err) => {
      console.log(err)
    })
})
</script>

<template>
  <div>
    <GoToBack />
    <div class="d-flex">
      <h1>정기 예금 상세</h1>
      <v-btn
        color="#1089FF"
      >가입하기</v-btn>
    </div>
    <v-divider class="my-3"></v-divider>

  </div>
</template>

<style scoped>

</style>
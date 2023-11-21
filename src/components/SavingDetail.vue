<script setup>
import { ref, onMounted } from 'vue'
import GoToBack from '@/components/GoToBack.vue'
import axios from 'axios'

const deposit = ref()
</script>

<template>
  <div>
    <GoToBack />
    <div class="d-flex">
      <h1>정기 적금 상세</h1>
      <v-btn
        color="#1089FF"
      >가입하기</v-btn>
    </div>
    <v-divider class="my-3"></v-divider>

  </div>
</template>

<style scoped>

</style>
<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

</script>

<template>
  <div class="container">
    <header class="d-flex align-center mb-7">
      <RouterLink :to="{ name: 'myPage'}" exact-active-class="active">회원 정보 관리</RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'productManage'}" exact-active-class="active">가입 상품 관리</RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'productRecommend'}" exact-active-class="active">상품 추천 받기</RouterLink>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  margin: 2rem auto;
}

a.active {
  color: #1089FF;
}

header {
  gap: 10px;
  font-size: 17px;
}

header a {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -1px;
  color: #222;
  text-decoration: none;
}
</style>
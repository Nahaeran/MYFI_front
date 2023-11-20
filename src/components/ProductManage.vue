<script setup>
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
</script>

<template>
  <div>
    <h1><span class="color">{{ userStore.userInfo.name }}</span>님의 가입 상품 관리 페이지</h1>
  </div>
</template>

<style scoped>

</style>
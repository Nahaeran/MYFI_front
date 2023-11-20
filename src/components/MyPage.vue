<script setup>
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
</script>

<template>
  <div>
    <h1><span class="color">{{ userStore.userInfo.name }}</span>님의 프로필 페이지</h1>
  </div>
</template>

<style scoped>

</style>
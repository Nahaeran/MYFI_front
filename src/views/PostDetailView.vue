<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

</script>

<template>
  <div>
    <h1>{{ postId }}번째 게시물입니다.</h1>
  </div>
</template>

<style scoped>

</style>
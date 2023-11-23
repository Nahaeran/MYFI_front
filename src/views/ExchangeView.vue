<script setup>
import ExchangeCalculater from '@/components/ExchangeCalculater.vue'
</script>

<template>
  <div class="container">
    <h1 class="mb-5"><span class="color">환율</span> 계산기</h1>
    <!-- <v-divider class="my-3"></v-divider> -->
    <ExchangeCalculater class="elevation-6"/>
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  height: 80vh;
  margin: 2rem auto;
}
</style>
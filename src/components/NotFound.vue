<script setup>

</script>

<template>
  <div class="container">
    <div class="d-flex flex-column align-center">
      <img src="@/assets/error-404-page.png" alt="not-found" />
      <h2>앗! <span class="color">페이지가</span> 없어요</h2>
      <v-btn color="#1089FF" :to="{ name: 'home' }">홈으로</v-btn>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}

img {
  width: 400px;
  height: 400px;
}
</style>
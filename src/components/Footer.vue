<script setup>

</script>

<template>
  <footer class="px-5 py-10">
    <div class="upper mx-3">
      <RouterLink class="logo" :to="{ name: 'home' }">
        <img src="@/assets/logo.png" alt="logo" />
        MYFI
      </RouterLink>
    </div>
    <v-divider class="my-3"></v-divider>
    <div class="d-flex flex-row-reverse mx-3">
      <div>
        <p class="font-weight-bold">본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.</p>
        <p class="font-italic">Copyright ©MYFI All Rights Reserved.</p>
      </div>
      
    </div>
    
  </footer>
</template>

<style scoped>
.container {
  width: 100vw;
}

footer {
  width: 100%;
  background-color: #ddd;
}

.logo {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #1089FF !important;
  font-size: 30px;
  text-decoration: none;
  font-family: 'Francois One', sans-serif;
  margin: 0 1rem;
}

.logo img {
  height: 36px;
}
</style>
<script setup>
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div>
    <header>
      <Nav></Nav>
      <div class="hr"></div>
    </header>
    <RouterView />
    <Footer class="footer"/>
  </div>
</template>

<style scoped>
.hr {
  height: 1px;
  background-color: #DBDBDB;
}

.footer {
  /* position: absolute;
  bottom: -200px; */
  position: relative;
  bottom: -150px;
  transform : translateY(100%);
}
</style>

<style>
.color {
  color: #1089FF;
}
</style>
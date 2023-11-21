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
    <Footer />
  </div>
</template>

<style scoped>
.hr {
  height: 1px;
  background-color: #DBDBDB;
}
</style>

<style>
.color {
  color: #1089FF;
}
</style>
<script setup>
import Nav from '@/components/Nav.vue'
</script>

<template>
  <div>
    <header>
      <Nav></Nav>
      <div class="hr"></div>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
.hr {
  height: 1px;
  background-color: #DBDBDB;
}
</style>
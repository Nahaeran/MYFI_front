<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const clickBack = function () {
  router.push({ name: 'postList'})
}
</script>

<template>
  <div>
    <v-btn
      class="mb-10"
      rounded="xl"
      variant="plain"
      color="grey-darken-2"
      @click="clickBack"
    >
      <v-icon
        class="mx-0"
        start
        icon="mdi-arrow-left"
      ></v-icon>
      Back
    </v-btn>
  </div>
</template>

<style scoped>
.mb-10 {
  left: -15px;
}
</style>
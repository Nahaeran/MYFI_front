<script setup>

</script>

<template>
  <div>
    <v-carousel
      cycle
      hide-delimiters
      show-arrows="hover"
    >
      <v-carousel-item>
        <img src="@/assets/carousel-1.jpeg" class="caro-item-img" width="400">
      </v-carousel-item>

      <v-carousel-item>
        <img src="@/assets/carousel-2.jpeg" class="caro-item-img" width="400">
      </v-carousel-item>

      <v-carousel-item>
        <img src="@/assets/carousel-3.jpeg" class="caro-item-img" width="400">
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style scoped>
.v-carousel {
  border-bottom: 1px solid #DBDBDB;
}

.caro-item-img {
  position: absolute;
  top: 2rem;
  right: 15vw;
}
</style>
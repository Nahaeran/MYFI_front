<script setup>
const props = defineProps({
  bank: String,
  name: String,
})
</script>

<template>
  <v-card
    max-width="280"
    elevation="7"
    class="card"
  >
    <v-card-item>
      <div class="text-overline mb-1">
        {{ bank }}
      </div>
      <div class="text-h6 font-weight-bold mb-1">
        {{ name }}
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn variant="tonal" color="#1089FF" class="ml-auto">
        상세보기
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<style scoped>
.card {
  transition: 300ms;
}
.card:hover {
  color: #1089FF;
  background-color: rgb(247, 250, 253);
}
</style>
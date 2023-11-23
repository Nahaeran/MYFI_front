<script setup>
const props = defineProps({
  currency: String,
  name: String,
})
</script>

<template>
  <v-card
    class="card"
  >
    <v-card-item>
      <div class="text-h6 font-weight-bold mb-1">
        {{ name }}
      </div>
      <img :src="`https://ssl.pstatic.net/imgfinance/chart/marketindex/area/month/FX_${currency}KRW.png`" alt="exchange graph" height="160">
    </v-card-item>

    <v-card-actions>
      <v-btn 
        ariant="tonal"
        color="#1089FF"
        class="ml-auto"
        :href="`https://finance.naver.com/marketindex/exchangeDetail.naver?marketindexCd=FX_${currency}KRW`"
      >
        {{ name }} 증권페이지 바로가기
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<style scoped>
.card {
  transition: 400ms;
}
.card:hover {
  color: #1089FF;
  transform: scale(1.02);
  /* background-color: rgb(247, 250, 253); */
}
</style>
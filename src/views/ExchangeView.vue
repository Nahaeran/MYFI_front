<script setup>
import { ref } from 'vue'
import ExchangeCalculater from '@/components/ExchangeCalculater.vue'
import ExchangeCard from '@/components/ExchangeCard.vue'

const currencies = ref()
const units = ref()

const passCurrency = function (cur, uni) {
  currencies.value = cur
  units.value = uni
  console.log(currencies.value)
  console.log(units.value)
}
</script>

<template>
  <div class="container">
    <h1 class="mb-5"><span class="color">환율</span> 계산기</h1>
    <!-- <v-divider class="my-3"></v-divider> -->
    <ExchangeCalculater class="elevation-6" @pass-currency="passCurrency"/>

    <div class="card-container">
      <v-container>
        <v-row align="center" justify="center">
          <v-col
            cols="6"
          >
            <ExchangeCard
              :currency="'USD'"
              :name="'미국 달러'"
            />
          </v-col>
          <v-col
            cols="6"
          >
            <ExchangeCard
              :currency="'JPY'"
              :name="'일본 옌'"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 1000px;
  height: 80vh;
  margin: 2rem auto;
}
</style>
<script setup>
import { ref } from 'vue'
import ExchangeCalculater from '@/components/ExchangeCalculater.vue'
import ExchangeCard from '@/components/ExchangeCard.vue'

// const currencies = ref()
// const units = ref()
const datas = ref([])

const passCurrency = function (cur, uni) {
  datas.value = []
  for (let i=0; i < cur.length; i++) {
    if (uni[i].includes('(100)')) {
      datas.value.push({ 'cur': cur[i], 'unit': uni[i].slice(0, 3) })
    } else if (uni[i] !== 'CNH')  {
      datas.value.push({ 'cur': cur[i], 'unit': uni[i] })
    }
    
  }
  // console.log(currencies.value)
  // console.log(units.value)
}
</script>

<template>
  <div class="container">
    <h1 class="mb-5"><span class="color">환율</span> 계산기</h1>
    <!-- <v-divider class="my-3"></v-divider> -->
    <ExchangeCalculater class="elevation-6" @pass-currency="passCurrency"/>

    <div class="card-container mt-10">
        <v-virtual-scroll :items="datas" height="600">
          <template v-slot:default="{ item }">
            <v-list-item>
                <ExchangeCard
                  v-for="data in datas"
                  :key="data.unit"
                  :currency="data.unit"
                  :name="data.cur"
                  width="450"
                  style="display: inline-block;"
                  class="ma-3"
                  elevation="5"
                />
            </v-list-item>
          </template>
        </v-virtual-scroll>
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
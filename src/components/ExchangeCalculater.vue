<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import axios from 'axios'

const currencies = ref()
const response = ref()
const selectedState = ref('송금 받으실 때')
const selectedCurrency = ref('미국 달러')
const selectedCurrencyUnit = ref('USD')
const selectedTtb = ref() // ttb: 송금 받으실 때
const selectedTts = ref() // tts: 송금 보내실 때
const selectedDeal = ref() // deal_bas_r : 매매 기준율

const calculateVariable = ref()
const krwInput = ref()
const otherInput = ref()

const states = ['송금 받으실 때', '송금 보내실 때', '매매 기준율']

const userStore = useUserStore()

onMounted(() => {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/exchange/`
  })
    .then((res) => {
      response.value = res.data.filter(data => data['ttb'] !== '0')

      currencies.value = response.value.map(item => item['cur_nm'])
      const usdInfo = response.value.find(item => item['cur_nm'] === '미국 달러')
      selectedTtb.value = Number(usdInfo['ttb'].replaceAll(',', ''))
      selectedTts.value = Number(usdInfo['tts'].replaceAll(',', ''))
      selectedDeal.value = Number(usdInfo['deal_bas_r'].replaceAll(',', ''))
      // console.log(selectedTtb.value, selectedTts.value, selectedDeal.value)
      calculateVariable.value = selectedTtb.value
    })
})

watch(selectedCurrency, () => {
  const selectedInfo = response.value.find(item => item['cur_nm'] === selectedCurrency.value)
  selectedCurrencyUnit.value = selectedInfo['cur_unit']
  if (selectedCurrency.value === '일본 옌' || selectedCurrency.value === "인도네시아 루피아") {
    selectedCurrencyUnit.value = selectedCurrencyUnit.value.replace('(100)', '')
    selectedTtb.value = Number(selectedInfo['ttb'].replaceAll(',', '')) / 100
    selectedTts.value = Number(selectedInfo['tts'].replaceAll(',', '')) / 100
    selectedDeal.value = Number(selectedInfo['deal_bas_r'].replaceAll(',', '')) / 100
  } else {
    selectedTtb.value = Number(selectedInfo['ttb'].replaceAll(',', ''))
    selectedTts.value = Number(selectedInfo['tts'].replaceAll(',', ''))
    selectedDeal.value = Number(selectedInfo['deal_bas_r'].replaceAll(',', ''))
  }
  if (selectedState.value === '송금 받으실 때') {
    calculateVariable.value = selectedTtb.value
  } else if (selectedState.value === '송금 보내실 때') {
    calculateVariable.value = selectedTts.value
  } else {
    calculateVariable.value = selectedDeal.value
  }
  inputEventOther()
  // krwInput.value = otherInput.value = ''
})

watch(selectedState, () => {
  if (selectedState.value === '송금 받으실 때') {
    calculateVariable.value = selectedTtb.value
  } else if (selectedState.value === '송금 보내실 때') {
    calculateVariable.value = selectedTts.value
  } else {
    calculateVariable.value = selectedDeal.value
  }
  inputEventOther()
})

const roundToTwo = (num) => {
  return +(Math.round(num + 'e+2') + 'e-2')
}

const inputEventKrw = function () {
  otherInput.value = krwInput.value / calculateVariable.value
  otherInput.value = Math.
  otherInput.value = roundToTwo(otherInput.value)
}

const inputEventOther = function () {
  krwInput.value = otherInput.value * calculateVariable.value
  krwInput.value = roundToTwo(krwInput.value)
}
</script>

<template>
  <v-card>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="3" offset="9">
            <v-select
              color="#1089FF"
              variant="outlined"
              :items="states"
              density="compact"
              label="기준"
              v-model="selectedState"
            ></v-select>
          </v-col>
        </v-row>

        <v-row no-gutter>
          <v-col cols="3">
            <v-select
              color="#1089FF"
              variant="outlined"
              label="통화 선택"
              :items="currencies"
              v-model="selectedCurrency"
            ></v-select>
          </v-col>
          <v-col cols="9">
            <v-text-field
              type="number"
              color="#1089FF"
              variant="outlined"
              :label="selectedCurrencyUnit"
              v-model="otherInput"
              @input="inputEventOther"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="my-0">
          <v-text-field
            type="number"
            append-inner-icon="mdi-currency-krw"
            color="#1089FF"
            variant="outlined"
            label="KRW"
            class="mx-3"
            v-model="krwInput"
            @input="inputEventKrw"
          ></v-text-field>
        </v-row>
        <!-- <v-row>
          <p class="text-caption mx-3 mb-3">* 엔화, 인도네시아 루피아는 100 단위, 나머지는 모두 1 단위입니다.</p>
        </v-row> -->
      </v-container>
    </v-form>    
  </v-card>
</template>

<style scoped>

</style>
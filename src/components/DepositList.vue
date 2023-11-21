<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import axios from 'axios'

const headers = [
  { title: '공시 제출일', align: 'start', sortable: false, key: 'dcls_month' },
  { title: '금융회사명', align: 'start', sortable: false, key: 'kor_co_nm' },
  { title: '상품명', align: 'center', sortable: false, key: 'name' },
  { title: '6개월 (Click to sort)', align: 'end', key: '6month' },
  { title: '12개월 (Click to sort)', align: 'end', key: '12month' },
  { title: '24개월 (Click to sort)', align: 'end', key: '24month' },
  { title: '36개월 (Click to sort)', align: 'end', key: '36month' },
]

const deposits = ref([])
const depositLength = computed(() => {
  return deposits.value.length
})
const banks = ref(['전체 보기'])
const selectedBank = ref('전체 보기')
const selectedRow = ref()

const userStore = useUserStore()
const router = useRouter()

const makeItems = function (item) {
  const result = {
    'deposit_code': item['deposit_code'],
    'dcls_month': item['dcls_month'],
    'kor_co_nm': item['kor_co_nm'],
    'name': item['name'],
    '6month': null,
    '12month': null,
    '24month': null,
    '35month': null,
  }

  for (const option of item['depositoption_set']) {
    const saveTrm = option['save_trm']

    if (saveTrm === "6") {
      result['6month'] = option['intr_rate']
    } else if (saveTrm === "12") {
      result['12month'] = option['intr_rate']
    } else if (saveTrm === "24") {
      result['24month'] = option['intr_rate']
    } else if (saveTrm === "36") {
      result['36month'] = option['intr_rate']
    }
  }

  return result
}

const getAllDeposit = function () {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/financial/deposit_list/`
  })
    .then((res) => {
      const results = res.data
      for (const item of results){
        deposits.value.push(makeItems(item))
        if (!banks.value.includes(item['kor_co_nm'])) {
          banks.value.push(item['kor_co_nm'])
        }
      }
      // console.log(deposits.value)
      // console.log(banks.value)
    })
}

onMounted(() => {
  getAllDeposit()
})

const clickBank = function () {
  if (selectedBank.value === '전체 보기') {
    getAllDeposit()
  } else {
    axios({
      method: 'get',
      url: `${userStore.API_URL}/financial/get_bank_deposit/${selectedBank.value}/`
    })
      .then((res) => {
        deposits.value = []
        const results = res.data
        for (const item of results){
          deposits.value.push(makeItems(item))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const clickRow = function (data) {
  router.push({ name: 'depositDetail', params: { depositCode: data['deposit_code']}})
}

</script>

<template>
  <div>
    <header class="d-flex">
      <h1><span class="color">정기예금</span> 검색하기</h1>
      <v-select
        label="은행"
        :items="banks"
        v-model="selectedBank"
        @update:modelValue="clickBank"
      ></v-select>
    </header>
    <v-divider class="my-3"></v-divider>

    <v-data-table-virtual
      v-if="depositLength !== 0"
      fixed-header
      :headers="headers"
      :items-length="depositLength"
      :items="deposits"
      item-value="deposit_code"
      height="600"
      class="table"
      v-model="selectedRow"
    >
      <template v-slot:item="{ item }">
        <tr @click="clickRow(item)">
          <td>{{ item['dcls_month'] }}</td>
          <td>{{ item['kor_co_nm'] }}</td>
          <td>{{ item['name'] }}</td>
          <td>{{ item['6month'] }}</td>
          <td>{{ item['12month'] }}</td>
          <td>{{ item['24month'] }}</td>
          <td>{{ item['36month'] }}</td>
        </tr>
      </template>
    </v-data-table-virtual>
    
    <div v-else class="loading">
      <v-progress-circular
        color="#1089FF"
        indeterminate
        size="80"
        ></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.loading { 
  display: flex;
  height: 80vh;
  align-items: center;
  justify-content: center;
}

tbody > tr {
  transition: 200ms;
  cursor: pointer;
}

tbody > tr:hover {
  background-color: rgb(247, 250, 253);
}
</style>
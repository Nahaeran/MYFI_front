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

const savings = ref([])
const savingLength = computed(() => {
  return savings.value.length
})
const banks = ref(['전체 보기'])
const selectedBank = ref('전체 보기')
const selectedRow = ref()

const userStore = useUserStore()
const router = useRouter()

const makeItems = function (item) {
  const result = {
    'saving_code': item['saving_code'],
    'dcls_month': item['dcls_month'],
    'kor_co_nm': item['kor_co_nm'],
    'name': item['name'],
    '6month': null,
    '12month': null,
    '24month': null,
    '35month': null,
  }

  for (const option of item['savingoption_set']) {
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

const getAllSaving = function () {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/financial/saving_list/`
  })
    .then((res) => {
      const results = res.data
      for (const item of results){
        savings.value.push(makeItems(item))
        if (!banks.value.includes(item['kor_co_nm'])) {
          banks.value.push(item['kor_co_nm'])
        }
      }
      // console.log(savings.value)
      // console.log(banks.value)
    })
}

onMounted(() => {
  getAllSaving()
})

const clickBank = function () {
  if (selectedBank.value === '전체 보기') {
    getAllSaving()
  } else {
    axios({
      method: 'get',
      url: `${userStore.API_URL}/financial/get_bank_saving/${selectedBank.value}/`
    })
      .then((res) => {
        savings.value = []
        const results = res.data
        for (const item of results){
          savings.value.push(makeItems(item))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const clickRow = function (data) {
  router.push({ name: 'savingDetail', params: { savingCode: data['saving_code']}})
}

</script>

<template>
  <div>
    <header class="d-flex">
      <h1><span class="color">정기적금</span> 검색하기</h1>
      <v-select
        label="은행"
        :items="banks"
        v-model="selectedBank"
        @update:modelValue="clickBank"
      ></v-select>
    </header>
    <v-divider class="my-3"></v-divider>

    <v-data-table-virtual
      v-if="savingLength !== 0"
      :headers="headers"
      fixed-header
      :items-length="savingLength"
      :items="savings"
      item-value="saving_code"
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
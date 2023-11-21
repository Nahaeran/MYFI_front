<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import axios from 'axios'

const headers = [
  { title: '공시 제출일', align: 'start', sortable: false, width:'10%',key: 'dcls_month' },
  { title: '금융회사명', align: 'start', sortable: false, key: 'kor_co_nm' },
  { title: '상품명', align: 'center', sortable: false, width:'32%', key: 'name' },
  { title: '6개월 (Click to sort)', align: 'end', width:'12%', key: '6month' },
  { title: '12개월 (Click to sort)', align: 'end', width:'12%', key: '12month' },
  { title: '24개월 (Click to sort)', align: 'end',  width:'12%', key: '24month' },
  { title: '36개월 (Click to sort)', align: 'end', width:'12%', key: '36month' },
]

const savings = ref([])
const savingLength = computed(() => {
  return savings.value.length
})
const banks = ref(['전체 보기'])
const selectedBank = ref('전체 보기')
const selectedRow = ref()
const selectedSavingSimple = ref()
const selectedSaving = ref()
const dialog = ref(false)

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

const close = function () {
  dialog.value = false
}

const clickRow = function (data) {
  // router.push({ name: 'savingDetail', params: { savingCode: data['saving_code']}})
  selectedSavingSimple.value = data
  getSaving()
  dialog.value = true
}

const getSaving = function () {
  const savingCode = selectedSavingSimple.value['saving_code']
  axios({
    method: 'get',
    url: `${userStore.API_URL}/financial/saving_list/${savingCode}/`
  })
    .then((res) => {
      const data = res.data
      selectedSaving.value = {
        '공시 제출월': data['dcls_month'],
        '금융 회사명': data['kor_co_nm'],
        '금융 상품명': data['name'],
        '가입 방법': data['join_way'],
        '만기 후 이자율': data['mtrt_int'],
        '우대 조건': data['spcl_cnd'],
        '가입 대상': data['join_member'],
        '가입 제한': data['join_deny'] === 1 ? '제한없음' : data['join_deny'] === 2 ? '서민전용' : '일부제한',
        '최고 한도': data['max_limit'],
        '기타 유의사항': data['etc_note']
      }
    })
    .catch((err) => {
      console.log(err)
    })
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

    <v-dialog v-model="dialog" width="800">
      <v-card v-if="selectedSaving" class="py-5 px-3">
        <v-card-title class="d-flex align-center justify-space-between">
          <h3>{{ selectedSaving['금융 상품명'] }}</h3>
          <v-btn
            color="#1089FF"
            variant="flat"
          >가입하기</v-btn>
        </v-card-title>

        <v-card-text>
          <v-table>
            <tbody>
              <tr
                v-for="(value, key) in selectedSaving"
                :key="key"
              >
                <td width="25%" class="font-weight-bold">{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#1089FF" variant="text" @click="close">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <td align="center">{{ item['name'] }}</td>
          <td align="center">{{ item['6month'] }}</td>
          <td align="center">{{ item['12month'] }}</td>
          <td align="center">{{ item['24month'] }}</td>
          <td align="center">{{ item['36month'] }}</td>
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
  color: #1089FF;
}
</style>
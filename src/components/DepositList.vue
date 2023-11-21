<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/users'
import axios from 'axios'

const headers = [
  { title: '공시 제출일', align: 'start', sortable: false, width:'10%', key: 'dcls_month' },
  { title: '금융회사명', align: 'start', sortable: false, key: 'kor_co_nm' },
  { title: '상품명', align: 'center', sortable: false, width:'32%', key: 'name' },
  { title: '6개월 (Click to sort)', align: 'center', width:'12%', key: '6month' },
  { title: '12개월 (Click to sort)', align: 'center', width:'12%', key: '12month' },
  { title: '24개월 (Click to sort)', align: 'center', width:'12%', key: '24month' },
  { title: '36개월 (Click to sort)', align: 'center', width:'12%', key: '36month' },
]

const deposits = ref([])
const depositLength = computed(() => {
  return deposits.value.length
})
const banks = ref(['전체 보기'])
const selectedBank = ref('전체 보기')
const selectedDepositSimple = ref()
const selectedDeposit = ref()
const selectedDepositCode = computed(() => {
  return selectedDepositSimple.value?.['deposit_code']
})
const dialog = ref(false)

const isContractDeposit = computed(() => {
  return userStore.userInfo?.contract_deposit.some(e => e['deposit_code'] === selectedDepositCode.value)
})

const userStore = useUserStore()

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
    .catch((err) => {
      console.log(err)
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

const close = function () {
  dialog.value = false
}

const clickRow = function (data) {
  // router.push({ name: 'depositDetail', params: { depositCode: data['deposit_code']}})
  selectedDepositSimple.value = data
  getDeposit()
  dialog.value = true
}

const getDeposit = function () {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/financial/deposit_list/${selectedDepositCode.value}/`
  })
    .then((res) => {
      const data = res.data
      selectedDeposit.value = {
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

const addDepositUser = function () {
  axios({
    method: 'post',
    url: `${userStore.API_URL}/financial/deposit_list/${selectedDepositCode.value}/contract/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      userStore.getUserInfo(userStore.userInfo.username)
    })
    .catch((err) => {
      console.log(err)
    })
}

const deleteDepositUser = function () {
  axios({
    method: 'delete',
    url: `${userStore.API_URL}/financial/deposit_list/${selectedDepositCode.value}/contract/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      userStore.getUserInfo(userStore.userInfo.username)
    })
    .catch((err) => {
      console.log(err)
    })
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
        class="ml-auto"
      ></v-select>
    </header>
    <v-divider class="my-3"></v-divider>

    <v-dialog v-model="dialog" width="800">
      <v-card v-if="selectedDeposit" class="py-5 px-3">
        <v-card-title class="d-flex align-center justify-space-between">
          <h3>{{ selectedDeposit['금융 상품명'] }}</h3>
          <div v-if="userStore.isLogin">
            <v-btn
              v-if=" isContractDeposit"
              color="red"
              variant="flat"
              @click.prevent="deleteDepositUser"
            >가입 취소하기</v-btn>
            <v-btn
              v-else
              color="#1089FF"
              variant="flat"
              @click.prevent="addDepositUser"
            >가입하기</v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-table>
            <tbody>
              <tr
                v-for="(value, key) in selectedDeposit"
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
      v-if="depositLength !== 0"
      fixed-header
      :headers="headers"
      :items-length="depositLength"
      :items="deposits"
      item-value="deposit_code"
      height="600"
      class="table"
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
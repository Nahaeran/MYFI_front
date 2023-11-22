<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import BarChart from '@/components/BarChart.vue'
import axios from 'axios'
import { SourceNode } from 'source-map-js/lib/source-node';

const userStore = useUserStore()

const products = ref([])
const dialog = ref(false)
const loading = ref(true)
const chartReady = ref(false)

const selectedProduct = ref()
const selectedProductSimple = ref()
const selectedProductCode = computed(() => {
  return selectedProductSimple.value?.code
})
const isContractProduct = computed(() => {
  if (selectedProductSimple.value?.type === '정기예금'){
    return userStore.userInfo?.contract_deposit.some(e => e['deposit_code'] === selectedProductCode.value)
  } else if (selectedProductSimple.value?.type === '정기적금'){
    return userStore.userInfo?.contract_saving.some(e => e['saving_code'] === selectedProductCode.value)
  }
})

const months = [
  { title: '6개월 금리', value: 6 }, 
  { title: '12개월 금리', value: 12 }, 
  { title: '24개월 금리', value: 24 }, 
  { title: '36개월 금리', value: 36 }
]

const selectedMonth = ref({ title: '6개월 금리', value: 6 })

const labels = ref([])
const filterLabels = function () {
  for (const product of products.value) {
    labels.value.push(product.name)
  }
}
watch(products, () => {
  chartReady.value = false
  loading.value = true
  labels.value = []
  intrRate.value = []
  intrRate2.value = []
  setTimeout(() => {
    Promise.all([changeMonth(), filterLabels()])
      .then((values) => {
        loading.value = false
        chartReady.value = true
      })
  }, 300);
})

const intrRate = ref([])
const intrRate2 = ref([])

const changeMonth = function () {
  const filteredProduct = products.value.map(e => {
    const tempMonth = selectedMonth.value.value || selectedMonth.value
    return e.options.filter(ele => ele.saveTrm == tempMonth)[0]
  })
  
  for (const product of filteredProduct) {
    intrRate.value.push(product?.intrRate)
    intrRate2.value.push(product?.intrRate2)
  }
}

watch(selectedMonth, () => {
  chartReady.value = false
  loading.value = true
  labels.value = []
  intrRate.value = []
  intrRate2.value = []
  setTimeout(() => {
    Promise.all([changeMonth(), filterLabels()])
      .then((values) => {
        loading.value = false
        chartReady.value = true
      })
  }, 300);
  
  
})

const getProducts = function () {
  // const deposits = userStore.userInfo?.contract_deposit
  // const savings = userStore.userInfo?.contract_saving
  const deposits = userStore.userContractDeposits
  const savings = userStore.userContractSavings
  let id = 1

  for (const deposit of deposits) {
    const temp = {
      id: id++,
      code: deposit.deposit_code,
      type: '정기예금',
      bankName: deposit.kor_co_nm,
      name: deposit.name,
      options: []
    }

    for (const option of deposit.depositoption_set) {
      const optionTemp = {
        'intrRate': option.intr_rate,
        'intrRate2': option.intr_rate2,
        'intrRateTypeNm': option.intr_rate_type_nm,
        saveTrm: option.save_trm
      }
      temp.options.push(optionTemp)
    }

    products.value.push(temp)
  }

  for (const saving of savings) {
    const temp = {
      id: id++,
      code: saving.saving_code,
      type: '정기적금',
      bankName: saving.kor_co_nm,
      name: saving.name,
      options: []
    }

    for (const option of saving.savingoption_set) {
      const optionTemp = {
        'intrRate': option.intr_rate,
        'intrRate2': option.intr_rate2,
        'intrRateTypeNm': option.intr_rate_type_nm,
        saveTrm: option.save_trm,
        rsrvTypeNm: option.rsrv_type_nm
      }
      temp.options.push(optionTemp)
    }
    products.value.push(temp)
  }
}

onMounted(() => {
  getProducts()
  Promise.all([changeMonth(), filterLabels()])
    .then((values) => {
      loading.value = false
      chartReady.value = true
    })
  // changeMonth()
  // filterLabels()
})

const close = function () {
  dialog.value = false
}

const clickDetail = function (data) {
  selectedProductSimple.value = data
  getProduct()
  dialog.value = true
}

const getProduct = function () {
  let url = ''
  if (selectedProductSimple.value.type === '정기예금') {
    url = `${userStore.API_URL}/financial/deposit_list/${selectedProductCode.value}/`
  } else if (selectedProductSimple.value.type === '정기적금'){
    url = `${userStore.API_URL}/financial/saving_list/${selectedProductCode.value}/`
  }

  axios({
    method: 'get',
    url: url
  })
    .then((res) => {
      const data = res.data
      selectedProduct.value = {
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

const deleteProductUser = function (data) {
  const anwser = window.confirm('정말 가입을 취소하시겠습니까?')

  if (anwser) {
    selectedProductSimple.value = data
    let url = ''
    if (selectedProductSimple.value.type === '정기예금') {
      url = `${userStore.API_URL}/financial/deposit_list/${selectedProductCode.value}/contract/`
    } else if (selectedProductSimple.value.type === '정기적금'){
      url = `${userStore.API_URL}/financial/saving_list/${selectedProductCode.value}/contract/`
    }

    axios({
      method: 'delete',
      url: url,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        loading.value = true
        userStore.getUserInfo(userStore.userInfo.username)
        products.value = []
        dialog.value = false
        setTimeout(() => {
          getProducts()
          loading.value = false
        }, 300)
        
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
}
</script>

<template>
  <div>
    <h1><span class="color">{{ userStore.userInfo.name }}</span>님의 가입 상품 관리 페이지</h1>
    <v-divider class="my-3"></v-divider>

    <v-dialog v-model="dialog" width="800">
      <v-card v-if="selectedProduct" class="py-5 px-3">
        <v-card-title class="d-flex align-center justify-space-between">
          <h3>{{ selectedProduct['금융 상품명'] }}</h3>
          <div v-if="userStore.isLogin">
            <v-btn
              v-if="isContractProduct"
              color="red"
              variant="flat"
              @click.prevent="deleteProductUser(selectedProductSimple)"
            >가입 취소하기</v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-table>
            <tbody>
              <tr
                v-for="(value, key) in selectedProduct"
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

    <v-container>
      <v-row>
        <v-col cols="3">
          <h2>가입한 상품들</h2>
        </v-col>
        <v-col cols="9" class="d-flex flex-column">
          <p
            v-for="product in products"
            :key="product.code"
            class="mb-2"
          >
            {{ product.id }} : ({{ product.type }}) {{ product.bankName }} - <span class="color">{{ product.name }}</span>
            <v-btn
              size="small"
              density="comfortable"
              variant="tonal"
              rounded="xl"
              color="blue-grey"
              class="mx-2"
              @click.prevent="clickDetail(product)"
            >상세 보기</v-btn>
            <v-btn
              size="small"
              density="comfortable"
              variant="tonal"
              rounded="xl"
              color="red"
              @click.prevent="deleteProductUser(product)"
            >가입 취소하기</v-btn>
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <h2>가입한 상품 금리</h2>
          <v-select
            variant="outlined"
            color="#1089FF"
            label="개월 선택"
            :items="months"
            item-text="title"
            item-value="value"
            v-model="selectedMonth"
            class="my-3"
          ></v-select>
        </v-col>
        <v-col v-if="chartReady" cols="9">
          <BarChart
            :labels="labels"
            :intr-rate="intrRate"
            :intr-rate2="intrRate2"
          />
        </v-col>
        <v-col v-else cols="9" style="height: 385px;">

        </v-col>
      </v-row>
    </v-container>
    <div v-if="loading" class="loading">
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
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  width: 100vw;
  height: 100vh;
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
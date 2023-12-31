<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import BarChart from '@/components/BarChart.vue'
import BarChartDetail from '@/components/BarChartDetail.vue'
import axios from 'axios'

const userStore = useUserStore()

const products = ref([])
const dialog = ref(false)
const loading = ref(true)
const chartReady = ref(false)
const detailChartReady = ref(false)
const isDeposit = ref(false)

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

const averageIntrRateDeposit = [3.45, 4.08, 3.4, 3.35]
const intrRateDeposit = ref([null, null, null, null])
const intrRate2Deposit = ref([null, null, null, null])

const averageIntrRateSaving = [2.78, 3.62, 3.57, 3.52]
const intrRateF = ref([null, null, null, null])
const intrRate2F = ref([null, null, null, null])
const intrRateS = ref([null, null, null, null])
const intrRate2S = ref([null, null, null, null])


const months = [
  { title: '6개월 금리', value: 6 }, 
  { title: '12개월 금리', value: 12 }, 
  { title: '24개월 금리', value: 24 }, 
  { title: '36개월 금리', value: 36 }
]

const selectedMonth = ref({ title: '6개월 금리', value: 6 })
const averageIntrRate = computed(() => {
  if (selectedMonth.value === 6) {
    return 3.45
  } else if (selectedMonth.value === 12) {
    return 4.08
  } else if (selectedMonth.value === 24) {
    return 3.4
  } else if (selectedMonth.value === 36) {
    return 3.35
  } else {
    return 3.45
  }
})

const labels = ref(['평균 금리'])
const filterLabels = function () {
  for (const product of products.value) {
    labels.value.push(product.name)
  }
}
watch(products, () => {
  chartReady.value = false
  loading.value = true
  labels.value = ['평균 금리']
  intrRate.value = [averageIntrRate.value]
  intrRate2.value = [undefined]
  setTimeout(() => {
    Promise.all([changeMonth(), filterLabels()])
      .then((values) => {
        loading.value = false
        chartReady.value = true
      })
  }, 300);
})

const intrRate = ref([averageIntrRate.value])
const intrRate2 = ref([undefined])

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
  labels.value = ['평균 금리']

  intrRate.value = [averageIntrRate.value]
  intrRate2.value = [undefined]
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
  detailChartReady.value = false
  selectedProductSimple.value = data
  isDeposit.value = data.type === '정기예금' ? true : false
  intrRateDeposit.value = []
  intrRate2Deposit.value = []
  intrRateF.value = []
  intrRate2F.value = []
  intrRateS.value = []
  intrRate2S.value = []
  getProduct()
  dialog.value = true
}

const getProduct = function () {
  let url = ''
  if (isDeposit.value) {
    url = `${userStore.API_URL}/financial/deposit_list/${selectedProductCode.value}/`
  } else {
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

      if (isDeposit.value) {
        const optionList = res.data.depositoption_set

        for (const option of optionList) {
          if (option.save_trm === "6") {
            intrRateDeposit.value[0] = option.intr_rate
            intrRate2Deposit.value[0] = option.intr_rate2
          } else if (option.save_trm === "12") {
            intrRateDeposit.value[1] = option.intr_rate
            intrRate2Deposit.value[1] = option.intr_rate2
          } else if (option.save_trm === "24") {
            intrRateDeposit.value[2] = option.intr_rate
            intrRate2Deposit.value[2] = option.intr_rate2
          } else if (option.save_trm === "36") {
            intrRateDeposit.value[3] = option.intr_rate
            intrRate2Deposit.value[3] = option.intr_rate2
          }
        }
      } else {
        const optionList = res.data.savingoption_set

        for (const option of optionList) {
          if (option.rsrv_type_nm === '자유적립식') {
            if (option.save_trm === "6") {
              intrRateF.value[0] = option.intr_rate
              intrRate2F.value[0] = option.intr_rate2
            } else if (option.save_trm === "12") {
              intrRateF.value[1] = option.intr_rate
              intrRate2F.value[1] = option.intr_rate2
            } else if (option.save_trm === "24") {
              intrRateF.value[2] = option.intr_rate
              intrRate2F.value[2] = option.intr_rate2
            } else if (option.save_trm === "36") {
              intrRateF.value[3] = option.intr_rate
              intrRate2F.value[3] = option.intr_rate2
            }
          } else {
            if (option.save_trm === "6") {
              intrRateS.value[0] = option.intr_rate
              intrRate2S.value[0] = option.intr_rate2
            } else if (option.save_trm === "12") {
              intrRateS.value[1] = option.intr_rate
              intrRate2S.value[1] = option.intr_rate2
            } else if (option.save_trm === "24") {
              intrRateS.value[2] = option.intr_rate
              intrRate2S.value[2] = option.intr_rate2
            } else if (option.save_trm === "36") {
              intrRateS.value[3] = option.intr_rate
              intrRate2S.value[3] = option.intr_rate2
            }
          }
        }
      }
      detailChartReady.value = true
    })
    .catch((err) => {
      console.log(err)
    })
}

const deleteProductUser = function (data) {
  const anwser = window.confirm('정말 가입을 취소하시겠습니까?')
  isDeposit.value = data.type === '정기예금' ? true : false

  if (anwser) {
    selectedProductSimple.value = data
    let url = ''
    if (isDeposit.value) {
      url = `${userStore.API_URL}/financial/deposit_list/${selectedProductCode.value}/contract/`
    } else {
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
                <td v-if="key === '최고 한도'">{{ value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                <td v-else>{{ value }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider class="my-3"></v-divider>

          <div v-if="detailChartReady">
            <div v-if="isDeposit" class="mx-auto">
              <BarChartDetail
                :title="selectedProductSimple.name"
                :average-intr-rate="averageIntrRateDeposit"
                :intr-rate="intrRateDeposit"
                :intr-rate2="intrRate2Deposit"
              />
              <p class="text-caption">* 개월별 평균 예금 금리는 2023년 11월 기준입니다.</p>
            </div>

            <div v-else class="mx-auto">
              <BarChartDetail
                :title="`${selectedProductSimple.name} (자유적립식)`"
                :average-intr-rate="averageIntrRateSaving"
                :intr-rate="intrRateF"
                :intr-rate2="intrRate2F"
              />
              <BarChartDetail
                :title="`${selectedProductSimple.name} (정액적립식)`"
                :average-intr-rate="averageIntrRateSaving"
                :intr-rate="intrRateS"
                :intr-rate2="intrRate2S"
              />
              <p class="text-caption">* 개월별 평균 예금 금리는 2023년 11월 기준입니다.</p>
            </div>
          </div>
          
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
            v-if="products.length !== 0"
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
          <p v-else class="mb-15">MIFI에서 가입한 상품이 없습니다! 금리 비교 탭에서 마음에 드는 상품을 선택해보세요 😊</p>
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
            :selected-month="selectedMonth"
            :labels="labels"
            :intr-rate="intrRate"
            :intr-rate2="intrRate2"
          />
          <p class="text-caption">* 개월별 평균 금리는 2023년 11월 기준입니다.</p>
        </v-col>
        <v-col v-else cols="9" style="height: 405px;">

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
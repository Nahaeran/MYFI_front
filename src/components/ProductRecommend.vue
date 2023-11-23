<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import BarChartDetail from '@/components/BarChartDetail.vue'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

const tab = ref('one')
const isExistInfo = ref(false)
const loading = ref(false)
const isNotSimilarUsers = ref(false)

const headers = [
  { title: '타입', align: 'start', sortable: false, width:'7%',key: 'type' },
  { title: '공시 제출일', align: 'start', sortable: false, width:'11%',key: 'dcls_month' },
  { title: '금융회사명', align: 'start', sortable: false, key: 'kor_co_nm' },
  { title: '상품명', align: 'center', sortable: false, width:'27%', key: 'name' },
  { title: '6개월 (Click to sort)', align: 'end', width:'11%', key: '6month' },
  { title: '12개월 (Click to sort)', align: 'end', width:'11%', key: '12month' },
  { title: '24개월 (Click to sort)', align: 'end',  width:'11%', key: '24month' },
  { title: '36개월 (Click to sort)', align: 'end', width:'11%', key: '36month' },
]

const recommend1 = ref([]) // 희망 예치 금액, 기간과 비슷한 상품 추천
const recommend2 = ref([]) // 나와 비슷한 사람들이 많이 가입한 상품 추천

const makeItems = function (item, isDeposit=true) {
  const codeName = isDeposit ? 'deposit_code' : 'saving_code'
  const state = isDeposit ? '정기예금' : '정기적금'

  const result = {
    'code': item[codeName],
    'type': state,
    'dcls_month': item['dcls_month'],
    'kor_co_nm': item['kor_co_nm'],
    'name': item['name'],
    '6month': null,
    '12month': null,
    '24month': null,
    '35month': null,
  }

  const setName = isDeposit ? 'depositoption_set' : "savingoption_set"

  for (const option of item[setName]) {
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


onMounted(() => {
  loading.value = true
  userStore.getUserInfo(userStore.userInfo.username)

  if (userStore.userInfo.age && userStore.userInfo.money && userStore.userInfo.salary && userStore.userInfo.desire_amount_deposit
      && userStore.userInfo.desire_amount_saving && userStore.userInfo.deposit_period && userStore.userInfo.saving_period
    ) {
    isExistInfo.value = true
    
    // 나와 비슷한 사람들이 많이 가입한 상품 추천
    axios({
      method: 'get',
      url: `${userStore.API_URL}/financial/recommend_product_two/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        // console.log(res.data)
        isNotSimilarUsers.value = res.data.is_not_similar_users

        const deposits = res.data.deposit
        const savings = res.data.saving

        for (const deposit of deposits) {
          recommend2.value.push(makeItems(deposit.deposit))
        }

        for (const saving of savings) {
          recommend2.value.push(makeItems(saving.saving, false))
        }
        loading.value = false
        // console.log(recommend2.value)
      })
      .catch((err) => {
        console.log(err)
      })

    // 희망 예치 금액, 기간과 비슷한 상품 추천
    axios({
      method: 'get',
      url: `${userStore.API_URL}/financial/recommend_product_one/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        // console.log(res.data)

        const deposits = res.data.deposit
        const savings = res.data.saving

        for (const deposit of deposits) {
          recommend1.value.push(makeItems(deposit))
        }

        for (const saving of savings) {
          recommend1.value.push(makeItems(saving, false))
        }
        
        // console.log(recommend1.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }
})

const dialog = ref(false)

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

const isDeposit = ref()

const averageIntrRateDeposit = [3.45, 4.08, 3.4, 3.35]
const intrRateDeposit = ref([null, null, null, null])
const intrRate2Deposit = ref([null, null, null, null])

const averageIntrRateSaving = [2.78, 3.62, 3.57, 3.52]
const intrRateF = ref([null, null, null, null])
const intrRate2F = ref([null, null, null, null])
const intrRateS = ref([null, null, null, null])
const intrRate2S = ref([null, null, null, null])

const clickRow = function (data) {
  chartReady.value = false
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
        '가입자 수 (MYFI 기준)': data.contract_user.length,
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
      chartReady.value = true
    })
    .catch((err) => {
      console.log(err)
    })
}

const close = function () {
  dialog.value = false
}

const addSavingUser = function () {
  let url = ''
  if (isDeposit.value) {
    url = `${userStore.API_URL}/financial/deposit_list/${selectedProductCode.value}/contract/`
  } else {
    url = `${userStore.API_URL}/financial/saving_list/${selectedProductCode.value}/contract/`
  }

  axios({
    method: 'post',
    url: url,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      userStore.getUserInfo(userStore.userInfo.username)
      const answer = window.confirm('저장이 완료되었습니다.\n가입 상품 관리 페이지로 가시겠습니까?')
      if (answer) {
        router.push({ name: 'productManage', params: { username: userStore.userInfo.username }})
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
        dialog.value = false
        setTimeout(() => {
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
    <h1><span class="color">{{ userStore.userInfo.name }}</span>님의 맞춤 상품 추천 받기</h1>
    <v-divider class="my-3"></v-divider>

    <div v-if="!isExistInfo" class="d-flex flex-column justify-center align-center">
      <img src="@/assets/question-mark.png" alt="sorry" width="400" height="400"/>
      <h1><span class="color">회원정보</span>가 있어야 추천이 가능합니다 😂</h1>
      <h1>회원 정보 관리 페이지에서 <span class="color">입력하지 않은 회원 정보</span>를 입력해주세요!</h1>
    </div>

    <div v-else-if="!loading">

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
              <v-btn
                v-else
                color="#1089FF"
                variant="flat"
                @click.prevent="addSavingUser"
              >가입하기</v-btn>
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

            <div v-if="chartReady">
              <div v-if="isDeposit" class="mx-auto">
                <BarChartDetail
                  :title="selectedProductSimple.name"
                  :average-intr-rate="averageIntrRateDeposit"
                  :intr-rate="intrRateDeposit"
                  :intr-rate2="intrRate2Deposit"
                />
                <p class="text-caption">* 개월별 평균 예금 금리는 2023년 11월 기준입니다.</p>
                <p class="text-caption">* 차트에 없는 이자율은 상품에 존재하지 않는 옵션입니다.</p>
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
                <p class="text-caption">* 차트에 없는 이자율은 상품에 존재하지 않는 옵션입니다.</p>
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


      <v-card class="elevation-6">
      <v-tabs
        grow
        v-model="tab"
        color="#1089FF"
        align-tabs="center"
      >
        <v-tab value="one">나와 비슷한 사람들이 많이 가입한 상품 추천</v-tab>
        <v-tab value="two">희망 예치 금액, 기간과 비슷한 상품 추천</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">

          <v-window-item value="one">
            <p>⭐️ 나와 나이, 자산, 연봉이 비슷한 유저들이 가입한 상품들을 추천해드립니다!</p>
            <p
              v-if="isNotSimilarUsers"
              class="ml-5"
            ><br>아쉽게도 내 나이, 자산, 연봉과 비슷한 유저가 없어요 🥲<br>대신 모든 유저들이 많이 가입한 상품 top 20을 준비했습니다!</p>

            <v-data-table-virtual
              :headers="headers"
              fixed-header
              :items="recommend2"
              item-value="code"
              height="600"
            >
            <template v-slot:item="{ item }">
              <tr @click="clickRow(item)">
                <td>{{ item['type'] }}</td>
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
          </v-window-item>

          <v-window-item value="two">
            <p>⭐️ 희망 예치 금액, 기간에서 ±50% 이내인 상품들 중, 이자율이 높은 상품을 추천해드립니다!</p>
            <v-data-table-virtual
              :headers="headers"
              fixed-header
              :items="recommend1"
              item-value="code"
              height="600"
            >
              <template v-slot:item="{ item }">
                <tr @click="clickRow(item)">
                  <td>{{ item['type'] }}</td>
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
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>
    </div>

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
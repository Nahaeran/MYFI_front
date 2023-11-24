<script setup>
import { useUserStore } from '@/stores/users'
import Map from '@/components/Map.vue'
import ExchangeCalculater from '@/components/ExchangeCalculater.vue'
import ExchangeCard from '@/components/ExchangeCard.vue'

const userStore = useUserStore()
</script>

<template>
  <div>
    <v-carousel
      cycle
      hide-delimiters
      show-arrows="hover"
    >
      <v-carousel-item>
        <div class="caro-item-text">
          <p><span class="color">예 ∙ 적금 금리</span>를 쉽게 비교하고</p>
          <div class="title">
            <p>나에게 맞는</p>
            <p><span class="color">금융상품</span>을 <span class="color">추천</span> 받자!</p>
          </div>
          <v-btn
            block
            rounded="xl"
            size="x-large"
            color="#1089FF"
            class="caro-item-btn"
            :to="userStore.isLogin ? { name: 'productRecommend', params: { username: userStore.userInfo.username }} : { name: 'signUp'}"
          >회원가입하고 추천받기</v-btn>
        </div> 
        <img src="@/assets/carousel-1.jpeg" class="caro-item-img" width="400">
      </v-carousel-item>

      <v-carousel-item>
        <div class="caro-item-text">
          <p>금융상품에 관한 이야기 어디서 할 수 있을까?</p>
          <div class="title">
            <p><span class="color">금융상품 자유 게시판</span>으로</p>
            <p>오세요!</p>
          </div>
          <v-btn
            block
            rounded="xl"
            size="x-large"
            color="#1089FF"
            class="caro-item-btn"
            :to="{ name: 'postList'}"
          >금융상품 자유 게시판 바로가기</v-btn>
        </div>
        <img src="@/assets/carousel-2.jpeg" class="caro-item-img" width="500">
      </v-carousel-item>

      <v-carousel-item>
        <div class="item3">
          <p><span class="color">금융</span>과 <span class="color">나</span>를 잇다.</p>
          <div class="title">
            <p><span class="color text-h1">MYFI</span></p>
          </div>
          <v-btn
            block
            rounded="xl"
            size="x-large"
            color="#1089FF"
            class="caro-item-btn"
            :to="userStore.isLogin ? { name: 'productRecommend', params: { username: userStore.userInfo.username }} : { name: 'signUp'}"
          >회원가입하고 추천받기</v-btn>
        </div> 
        <img src="@/assets/carousel-3.jpeg" class="caro-item-img" width="400">
      </v-carousel-item>
    </v-carousel>
  </div>

  <div class="container d-flex justify-space-between align-center">
    <div class="d-flex flex-column w-100">

      <div>
        <ExchangeCard
          :currency="'USD'"
          :name="'미국 달러'"
          width="47%"
          style="display: inline-block;"
          class="mb-5"
          elevation="5"
        />
        <ExchangeCard
          :currency="'JPY'"
          :name="'일본 옌'"
          width="47%"
          style="display: inline-block;"
          class="mb-5 ml-3"
          elevation="5"
        />
      </div>

      <div class="calculater">
        <h1><span class="color">환율</span> 계산기</h1>
        <ExchangeCalculater class="elevation-4"/>
      </div>
      
    </div>
    
    
    <Map 
      :width="350"
      :height="600"
      class="mt-5"
    />
  </div>

  
</template>

<style scoped>
.v-carousel {
  border-bottom: 1px solid #DBDBDB;
}

.calculater {
  width: 95%;
  position: relative;
}

.calculater > h1 {
  position: absolute;
  z-index: 100;
  top: 20px;
  left: 18px;
}

.caro-item-text {
  position: absolute;
  top: 30%;
  left: 15vw;
}

.item3 {
  position: absolute;
  top: 30%;
  left: 28vw;
}

.item3 > p {
  margin-left: 5px;
  font-size: 20px;
  font-weight: 600;
}

.caro-item-text > p {
  margin-left: 5px;
  font-size: 20px;
  font-weight: 600;
}

.title {
  margin: 5px 0;
  font-size: 40px;
  font-weight: 900;
  letter-spacing: -2px;
}

.caro-item-btn {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -1px;
}

.caro-item-img {
  position: absolute;
  top: 2rem;
  right: 17vw;
}

@media (max-width: 1250px) {
  .caro-item-img {
    right: 10vw;
  }
}

@media (min-width: 1600px) {
  .caro-item-img {
    right: 20vw;
  }

  .caro-item-text {
    left: 20vw;
  }
}

.container {
  width: 1400px;
  margin: 2rem auto;
}
</style>
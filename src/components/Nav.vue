<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const items = ref(['click1', 'click2'])
</script>

<template>
  <div class="nav">
    <RouterLink class="logo" :to="{ name: 'home' }">
      <img src="@/assets/logo.png" alt="logo" />
      MYFI
    </RouterLink>
    
    <div class="menus">
      <RouterLink :to="{ name: 'depositList' }">
        금리비교
      </RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'exchange' }">
        환율계산
      </RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'bankMap' }">
        주변은행
      </RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'postList' }">
        커뮤니티
      </RouterLink>
    </div>

    <div v-if="!userStore.isLogin" class="sign">
      <v-btn
        color="#1089FF"
        variant="outlined"
        :to="{ name: 'signIn'}"
      >
        로그인
      </v-btn>
      <v-btn
        color="#1089FF"
        variant="flat"
        :to="{ name: 'signUp'}"
      >
        회원가입
      </v-btn>
    </div>
    <div v-else class="sign">
      <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar>
              <v-img
                id="img"
                :src="`${userStore.API_URL}${userStore.userInfo.profile_img}`"
                alt="profile-img"
                v-bind="props"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-card class="card">
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar size="large">
                <v-img
                  id="img"
                  :src="`${userStore.API_URL}${userStore.userInfo.profile_img}`"
                  alt="profile-img"
                ></v-img>
              </v-avatar>
              <h2 class="mt-2">{{ userStore.userInfo.name }}</h2>
              <p class="text-subtitle-1 mt-1">
                {{ userStore.userInfo.email }}
              </p>
              <v-divider class="my-2"></v-divider>
              <v-btn
                rounded
                variant="text"
                size="large"
                :to="{ name: 'myPage', params: { username: userStore.userInfo.username }}"
              >
                마이페이지
              </v-btn>
              <v-divider class="my-2"></v-divider>
              <v-btn
                rounded
                variant="text"
                size="large"
                @click.prevent="userStore.logOut"
              >
                로그아웃
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<style scoped>
.nav {
  height: 80px;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #1089FF !important;
  font-size: 30px;
  text-decoration: none;
  font-family: 'Francois One', sans-serif;
  margin: 0 1rem;
}

.logo img {
  height: 36px;
}

.menus {
  display: flex;
  gap: 10px;
  font-size: 17px;
  margin-top: 5px;
}

.menus a {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -1px;
  color: #222;
  text-decoration: none;
}

.sign {
  margin: 5px 1rem 0 auto;
}

.sign * {
  margin: 5px;
}

.card {
  width: 180px;
}
</style>
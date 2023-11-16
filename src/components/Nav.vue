<script setup>

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

    <div class="sign">
      <v-btn
        color="#1089FF"
        variant="outlined"
        :to="{ name: 'signIn'}"
      >
        Sign in
      </v-btn>
      <v-btn
        color="#1089FF"
        variant="flat"
        :to="{ name: 'signUp'}"
      >
        Sign up
      </v-btn>
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
</style>
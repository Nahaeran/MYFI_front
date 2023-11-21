<script setup>
import Map from '@/components/Map.vue'
</script>

<template>
  <div class="container">
    <h1>주변 은행 검색</h1>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            label="광역시 / 도"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            label="시/군/구"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            label="은행"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-btn>
            찾기
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <Map
      :width="1200"
      :height="600"
    />
  </div>
</template>

<style scoped>
.container {
  width: 1200px;
  margin: 2rem auto;
}
</style>
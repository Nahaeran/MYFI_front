<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'

const userInfo = ref()
const dialog = ref(false)
const updateValue = ref('')
const selectedKey = ref('')

const userStore = useUserStore()

onMounted(() => {
  userInfo.value = {
    '회원번호': userStore.userInfo.id,
    '아이디': userStore.userInfo.username,
    '이름': userStore.userInfo.name,
    '이메일': userStore.userInfo.email,
    '나이': userStore.userInfo.age,
    '현재 가진 금액': userStore.userInfo.money,
    '연봉': userStore.userInfo.salary,
  }
})

const editValue = function (key, value) {
  console.log(key, value)
  selectedKey.value = key
  dialog.value = true
}

const close = function () {
  dialog.value = false
}

const save = function () {
  console.log('click save')
}
</script>

<template>
  <div>
    <h1><span class="color">{{ userStore.userInfo.name }}</span>님의 프로필 페이지</h1>
    <v-divider class="my-3"></v-divider>

    <div v-if="userInfo" class="d-flex align-center justify-space-evenly warpper">
      <div class="profile-img">
        <div class="d-flex flex-column justify-center">
          <v-avatar
            size="300"
            class="mb-5"
          >
            <v-img cover :src="`${userStore.API_URL}${userStore.userInfo.profile_img}`"></v-img>
          </v-avatar>
          <v-btn
            variant="flat"
            color="#1089FF"
          >
            프로필 이미지 변경
          </v-btn>
        </div>
      </div>

      <div class="user-info">
        <v-table>

          <v-dialog v-model="dialog" width="400">
            <v-card>
              <v-card-title>
                <span class="mx-2 font-weight-bold">정보 수정</span>
              </v-card-title>

              <v-card-text>
                <v-text-field
                  color="#1089FF"
                  v-model="updateValue"
                  :label="selectedKey"
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#1089FF" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="#1089FF" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <tbody>
            <tr
              v-for="(value, key) in userInfo"
              :key="key"
            >
              <td class="font-weight-bold">{{ key }}</td>
              <td>{{ value }}</td>
              <td>
                <v-icon
                  v-if="key === '나이' || key === '현재 가진 금액' || key === '연봉'"
                  size="small"
                  class="me-2"
                  @click="editValue(key, value)"
                >
                  mdi-pencil
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
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
.warpper {
  height: 600px;
}
</style>
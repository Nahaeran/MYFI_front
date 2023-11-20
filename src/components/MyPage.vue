<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'
import { useVuelidate } from '@vuelidate/core'
import { required, integer, helpers } from '@vuelidate/validators'
import axios from 'axios'

const userInfo = ref()
const dialog = ref(false)
const isShowProfileInput = ref(false)
const image = ref()
const selectedKey = ref('')
const state = ref({
  updateValue: ''
})

const userStore = useUserStore()
const usernameTemp = userStore.userInfo.username

const rules = {
  updateValue: {
    required: helpers.withMessage('필수 정보입니다.', required),
    integer: helpers.withMessage('숫자를 입력해야합니다.', integer)
  }
}

const v$ = useVuelidate(rules, state)

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
  state.value.updateValue = userInfo.value[key]
  dialog.value = true
}

const close = function () {
  dialog.value = false
}

const save = function () {
  v$.value.$validate()

  if (!v$.value.$error) {
    const key = ref('')
    if (selectedKey.value === '나이') {
      key.value = 'age'
    } else if (selectedKey.value === '현재 가진 금액') {
      key.value = 'money'
    } else if (selectedKey.value === '연봉') {
      key.value = 'salary'
    }

    axios({
      method: 'put',
      url: `${userStore.API_URL}/users/${usernameTemp}/info/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      },
      data: {
        [key.value]: state.value.updateValue
      }
    })
      .then((res) => {
        userStore.getUserInfo(usernameTemp)
        userInfo.value[selectedKey.value] = state.value.updateValue
        selectedKey.value = state.value.updateValue = ''
        dialog.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const editProfileImg = function (event) {
  if (isShowProfileInput.value === false) {
    isShowProfileInput.value = true
  } else {
    console.log(event)
    console.log(image.value)
    axios({
      method: 'put',
      url: `${userStore.API_URL}/users/${usernameTemp}/profile/`,
      headers: {
        Authorization: `Token ${userStore.token}`,
        "Content-Type": 'multipart/form-data'
      },
      data: {
        'profile_img': image.value
      }
    })
      .then((res) => {
        // console.log(res.data)
        userStore.getUserInfo(usernameTemp)
        isShowProfileInput.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }
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
            @click.prevent="editProfileImg"
          >
            프로필 이미지 변경
          </v-btn>
          <v-file-input
            v-show="isShowProfileInput"
            accept="image/png, image/jpeg, image/bmp"
            variant="underlined"
            label="프로필 이미지"
            v-model="image"
            class="mt-4"
          >
          </v-file-input>
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
                  type="number"
                  color="#1089FF"
                  v-model="state.updateValue"
                  :label="selectedKey"
                  :error-messages="v$.updateValue.$errors.map(e => e.$message)"
                  @input="v$.updateValue.$touch"
                  @blur="v$.updateValue.$touch"
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
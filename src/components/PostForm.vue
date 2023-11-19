<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: String,
  content: String,
  btnString: String,
  v$: Object
})

const title = ref('')
const content = ref('')

onMounted(() => {
  title.value = props.title,
  content.value = props.content
})

const emit = defineEmits(['submitForm'])

const submitForm = function () {
  emit('submitForm', title.value, content.value)
}
</script>

<template>
  <v-form class="my-5" @submit.prevent="submitForm">
    <v-text-field
      variant="outlined"
      color="#1089FF"
      label="제목"
      v-model="title"
      :error-messages="v$.title.$errors.map(e => e.$message)"
      @input="v$.title.$touch"
      @blur="v$.title.$touch"
    ></v-text-field>
    <v-textarea
      variant="outlined"
      color="#1089FF"
      label="내용"
      v-model="content"
      auto-grow
      rows="15"
      row-height="25"
      shaped
      :error-messages="v$.content.$errors.map(e => e.$message)"
      @input="v$.content.$touch"
      @blur="v$.content.$touch"
    ></v-textarea>
    <v-btn
      block
      variant="flat"
      color="#1089FF"
      @click.prevent="submitForm"
    >
      {{ btnString }}
    </v-btn>
  </v-form>
</template>

<style scoped>
form * {
  text-align: start;
  margin: 0.6rem 0;
}
</style>
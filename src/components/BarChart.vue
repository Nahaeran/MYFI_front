<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'
import colors from 'vuetify/util/colors'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from 'chart.js'

const userStore = useUserStore()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  labels: Array,
  intrRate: Array,
  intrRate2: Array
})

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: '저축 금리',
      data: props.intrRate,
      backgroundColor: '#1089FF',
      stack: 'Stack 0'
    },
    {
      label: '최고 우대 금리',
      data: props.intrRate2,
      backgroundColor: colors.red.accent2,
      stack: 'Stack 1'
    }
  ]
}

const chartOptions = ref({
  plugins: {
    title: {
      display: true,
      text: `${userStore.userInfo.name}님의 가입한 상품 금리`
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: {
        maxRotation: 30,
        minRotation: 0,
        font: {
          size: 8
        }
      }
    },
  },
})
</script>

<template>
  <div>
    <Bar
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<style scoped>

</style>
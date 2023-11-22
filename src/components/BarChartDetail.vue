<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'
import colors from 'vuetify/util/colors'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from 'chart.js'

const userStore = useUserStore()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  title: String,
  averageIntrRate: Array,
  intrRate: Array,
  intrRate2: Array
})

const chartData = {
  labels: ['6개월 금리', '12개월 금리', '24개월 금리', '36개월 금리'],
  datasets: [
    {
      label: '평균 금리',
      data: props.averageIntrRate,
      backgroundColor: colors.grey.base,
      stack: 'Stack 0'
    },
    {
      label: '저축 금리',
      data: props.intrRate2,
      backgroundColor: '#1089FF',
      stack: 'Stack 1'
    },
    {
      label: '최고 우대 금리',
      data: props.intrRate2,
      backgroundColor: colors.red.accent2,
      stack: 'Stack 2'
    },
  ]
}

const chartOptions = ref({
  plugins: {
    title: {
      display: true,
      text: `<${props.title}> 상품의 저축 금리`
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        font: {
          size: 10
        }
      }
    },
  },
})
</script>

<template>
  <div>
    <Bar
      class="mx-auto"
      style="width: 100%;"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<style scoped>

</style>
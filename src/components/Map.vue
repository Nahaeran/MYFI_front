<script setup>
import { ref, onMounted } from 'vue'

const MAP_API_KEY = import.meta.env.MAP_API_KEY

const props = defineProps({
  width: Number,
  height: Number
})

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    const script = document.createElement('script')

    script.onload = () => kakao.maps.load(initMap)
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${MAP_API_KEY}`
    document.head.appendChild(script)
  }
})

const initMap = () => {
  const container = document.getElementById('map')

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentPosition = [ position.coords.latitude, position.coords.longitude ]
      console.log(currentPosition)

      const options = {
        center: new kakao.maps.LatLng(currentPosition[0], currentPosition[1]),
        level: 5,
      }

      const map = new kakao.maps.Map(container, options)

    })
  }

  // const options = {
  //   center: new kakao.maps.LatLng(currentPosition.value[0], currentPosition.value[1]),
  //   level: 5,
  // }

  // 지도 객체를 등록
  // 지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언
  // const map = new kakao.maps.Map(container, options)
}
</script>

<template>
  <div>
    <div id="map" :style="`width: ${width}px; height: ${height}px;`"></div>
  </div>
</template>

<style scoped>

</style>

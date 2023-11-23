<script setup>
import { ref, onMounted } from 'vue'

const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY

const props = defineProps({
  width: Number,
  height: Number,
  keyWord: String
})

const center = ref([37.566826, 126.9786567])
const level = ref(3)

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    const script = document.createElement('script')

    script.onload = () => kakao.maps.load(initMap)
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${MAP_API_KEY}&libraries=services`
    document.head.appendChild(script)
  }
})

const initMap = () => {
  // const container = document.getElementById('map')

  // if ("geolocation" in navigator) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const currentPosition = [ position.coords.latitude, position.coords.longitude ]
  //     console.log(currentPosition)

  //     const options = {
  //       center: new kakao.maps.LatLng(currentPosition[0], currentPosition[1]),
  //       level: 5,
  //     }

  //     const map = new kakao.maps.Map(container, options)

  //   })
  // }

  // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
  const infowindow = new kakao.maps.InfoWindow({zIndex:1});

  const mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = {
          center: new kakao.maps.LatLng(center.value[0], center.value[1]), // 지도의 중심좌표
          // level: 3 // 지도의 확대 레벨
          level: level.value // 지도의 확대 레벨
      };  

  // 지도를 생성합니다    
  var map = new kakao.maps.Map(mapContainer, mapOption); 
  map.setDraggable(true);

  kakao.maps.event.addListener(map, 'center_changed', function() {

  // 지도의  레벨을 얻어옵니다
  const levelMap = map.getLevel();
  
  level.value = levelMap


  // 지도의 중심좌표를 얻어옵니다 
  const latlng = map.getCenter(); 
  // const lat = latlng.getLat()
  // const lng = latlng.getLng()
  center.value = [latlng.getLat(), latlng.getLng()]

  // console.log(`위도 : ${center.value[0]} 경도 : ${center.value[1]}`)

  // mapOption = {
  //         center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
  //         level: 3 // 지도의 확대 레벨
  //     }; 
  });

  // 장소 검색 객체를 생성합니다
  const ps = new kakao.maps.services.Places(map); 
  
  // 키워드에 따라 은행을 검색합니다
  // if (props.keyWord === '전체보기') {
  //   ps.categorySearch('BK9', placesSearchCB, {useMapBounds:true}); 
  // } else {
  //   ps.keywordSearch(props.keyWord, placesSearchCB, {useMapBounds:true}); 
  // }
  // ps.keywordSearch(props.keyWord, placesSearchCB); 
  ps.categorySearch('BK9', placesSearchCB, {useMapBounds:true}); 
  

  

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB (data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
          for (var i=0; i<data.length; i++) {
              displayMarker(data[i]);    
          }       
      }
  }

  // 지도에 마커를 표시하는 함수입니다
  function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      const marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.y, place.x) 
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function() {
          // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
          infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
          infowindow.open(map, marker);
      });
  }
}

const clickCurrentSearch = function () {
  // 장소 검색 객체를 생성합니다

  initMap()
}
</script>

<template>
  <div class="map-container">
    <v-btn
      variant="text"
      color="#1089FF"
      @click="clickCurrentSearch"
      class="current-search-btn"
      rounded="xl"
      elevation="8"
      size="large"
    > 
        <v-icon class="me-1">
          mdi-reload
        </v-icon>
      현 지도에서 검색</v-btn>
    <div id="map" :style="`width: ${width}px; height: ${height}px;`" class="elevation-5"></div>
  </div>
</template>

<style scoped>
#map {
  border-radius: 10px;
}

.map-container {
  position: relative;
  border-radius: 10px;
}

.current-search-btn {
  position: absolute;
  top: 10px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);
  background-color: white;
}
</style>

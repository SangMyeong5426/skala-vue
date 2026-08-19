<script setup>
import { ref } from 'vue'

// [요구사항 1] 배열 렌더링용 날씨 데이터 (4일차 API 연동 시 응답 구조로 대체될 자리)
// 커스터마이징: 자료 기본 3개 도시에 '대전', '제주'를 추가하고 humidity(습도) 필드를 확장
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70 },
  { id: 'city_04', name: '대전', temp: 23, status: '흐림', humidity: 64 },
  { id: 'city_05', name: '제주', temp: 29, status: '맑음', humidity: 75 },
])

// 커스터마이징: 날씨 상태 문자열을 아이콘으로 매핑하는 조회용 객체
const weatherIcons = {
  맑음: '☀️',
  비: '🌧️',
  구름: '⛅',
  흐림: '☁️',
}

// [요구사항 3] 검색어 상태 (v-model 대신 :value + @input으로 한글 즉시 동기화)
const searchQuery = ref('')

// [요구사항 4] 상태바 문구
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

// 커스터마이징: 현재 선택된 카드 id (선택 시 하이라이트 처리용)
const selectedCityId = ref('')

// [요구사항 3] input 이벤트마다 검색어 상태를 직접 갱신
// v-model은 한글 조합(IME) 중에는 값을 반영하지 않으므로, 즉시 동기화를 위해 수동 처리
const handleSearchInput = (e) => {
  searchQuery.value = e.target.value
}

// [요구사항 4] 카드 클릭 시 상태바 갱신
const selectCard = (city) => {
  selectedCityId.value = city.id
  statusMessage.value = `${city.name}이(가) 선택되었습니다.`
}

// [요구사항 4] 상세보기 버튼 클릭 시 알림창 (@click.stop으로 카드 클릭 이벤트 버블링 차단)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 영역 -->
    <section class="search-box">
      <h3>🔍 도시 검색 (한글 즉시 동기화)</h3>
      <input
        type="text"
        placeholder="검색할 도시 이름 입력"
        :value="searchQuery"
        @input="handleSearchInput"
      />
      <p>
        검색 중인 도시:
        <strong v-if="searchQuery">{{ searchQuery }}</strong>
        <span v-else class="placeholder-text">(아직 입력하지 않았습니다)</span>
      </p>
    </section>

    <!-- 지역별 날씨 현황 목록 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>
      <div
        v-for="city in weatherList"
        :key="city.id"
        class="weather-card"
        :class="{ selected: selectedCityId === city.id }"
        @click="selectCard(city)"
      >
        <h4>{{ weatherIcons[city.status] }} {{ city.name }} ({{ city.status }})</h4>
        <p>현재 기온: {{ city.temp }}°C</p>
        <p class="humidity">습도: {{ city.humidity }}%</p>

        <!-- [요구사항 2] 기온 25도 기준 조건부 라벨 -->
        <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>
    </section>

    <!-- 상태 표시줄 -->
    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>
/* 커스터마이징: 선택된 카드 강조 (v-bind:class 객체 구문 활용) */
.weather-card.selected {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.weather-card h4 {
  margin: 0 0 6px 0;
}
.humidity {
  color: #7f8c8d;
  font-size: 13px;
}
.placeholder-text {
  color: #b2bec3;
}
</style>

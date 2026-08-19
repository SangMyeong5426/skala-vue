<script setup>
import { ref } from 'vue'

// [요구사항 1] 배열 렌더링용 날씨 데이터 (4일차 API 연동 시 응답 구조로 대체될 자리)
// 커스터마이징: 자료 기본 3개 도시에 '대전', '제주'를 추가하고
//               humidity(습도) / pm10(미세먼지) / forecast(주간 예보) 필드를 확장
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    pm10: 95,
    forecast: [
      { day: '월', temp: 27, status: '맑음' },
      { day: '화', temp: 29, status: '맑음' },
      { day: '수', temp: 26, status: '구름' },
      { day: '목', temp: 24, status: '비' },
      { day: '금', temp: 25, status: '흐림' },
    ],
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 82,
    pm10: 18,
    forecast: [
      { day: '월', temp: 23, status: '비' },
      { day: '화', temp: 22, status: '비' },
      { day: '수', temp: 25, status: '흐림' },
      { day: '목', temp: 27, status: '구름' },
      { day: '금', temp: 28, status: '맑음' },
    ],
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 70,
    pm10: 62,
    forecast: [
      { day: '월', temp: 26, status: '구름' },
      { day: '화', temp: 27, status: '맑음' },
      { day: '수', temp: 28, status: '맑음' },
      { day: '목', temp: 26, status: '흐림' },
      { day: '금', temp: 24, status: '비' },
    ],
  },
  {
    id: 'city_04',
    name: '대전',
    temp: 23,
    status: '흐림',
    humidity: 64,
    pm10: 168,
    forecast: [
      { day: '월', temp: 22, status: '흐림' },
      { day: '화', temp: 24, status: '구름' },
      { day: '수', temp: 25, status: '맑음' },
      { day: '목', temp: 23, status: '비' },
      { day: '금', temp: 21, status: '비' },
    ],
  },
  {
    id: 'city_05',
    name: '제주',
    temp: 29,
    status: '맑음',
    humidity: 75,
    pm10: 25,
    forecast: [
      { day: '월', temp: 29, status: '맑음' },
      { day: '화', temp: 30, status: '맑음' },
      { day: '수', temp: 28, status: '구름' },
      { day: '목', temp: 27, status: '구름' },
      { day: '금', temp: 26, status: '비' },
    ],
  },
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

// 커스터마이징: 현재 선택된 카드 id (하이라이트 + 주간 예보 노출 기준)
const selectedCityId = ref('')

// [요구사항 3] input 이벤트마다 검색어 상태를 직접 갱신
// v-model은 한글 조합(IME) 중에는 값을 반영하지 않으므로, 즉시 동기화를 위해 수동 처리
const handleSearchInput = (e) => {
  searchQuery.value = e.target.value
}

// 커스터마이징: 도시명 끝 글자의 받침 유무로 주격 조사('이'/'가')를 판별
// 한글 음절 코드에서 (코드 - 0xAC00) % 28 이 0이면 받침이 없다
const getSubjectJosa = (word) => {
  const lastCode = word.charCodeAt(word.length - 1)
  if (lastCode < 0xac00 || lastCode > 0xd7a3) return '이' // 한글이 아니면 기본값
  return (lastCode - 0xac00) % 28 === 0 ? '가' : '이'
}

// [요구사항 4] 카드 클릭 시 상태바 갱신 + 주간 예보 대상 도시 선택
const selectCard = (city) => {
  selectedCityId.value = city.id
  statusMessage.value = `${city.name}${getSubjectJosa(city.name)} 선택되었습니다.`
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
        <p class="sub-info">습도: {{ city.humidity }}%</p>

        <!-- [요구사항 2] 기온 25도 기준 조건부 라벨 -->
        <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>
    </section>

    <!-- [요구사항 5-A] 커스터마이징 Mockup: 대기질(미세먼지) 현황 -->
    <section class="list-box">
      <h3>🌫️ 대기질 현황 (미세먼지 PM10)</h3>
      <div v-for="city in weatherList" :key="city.id" class="air-row">
        <span class="air-city">{{ city.name }}</span>
        <span class="air-value">{{ city.pm10 }}㎍/㎥</span>

        <!-- 환경부 PM10 기준에 따른 4단계 등급 분기 -->
        <span v-if="city.pm10 <= 30" class="badge air-good">😊 좋음</span>
        <span v-else-if="city.pm10 <= 80" class="badge air-normal">🙂 보통</span>
        <span v-else-if="city.pm10 <= 150" class="badge air-bad">😷 나쁨</span>
        <span v-else class="badge air-worst">🤢 매우 나쁨</span>
      </div>
    </section>

    <!-- [요구사항 5-B] 커스터마이징 Mockup: 선택한 도시의 주간 예보 (중첩 v-for) -->
    <section class="list-box">
      <h3>📅 주간 예보</h3>

      <!-- 바깥 v-for(도시) → 안쪽 v-for(예보)로 중첩 반복.
           선택된 도시만 렌더링하기 위해 template에 v-for, 내부 요소에 v-if를 건다.
           (같은 요소에 v-for와 v-if를 함께 쓰면 v-if가 먼저 평가되어 city를 못 읽는다)
           ※ 2일차에 computed로 선택 도시를 추출하는 방식으로 리팩터링 예정 -->
      <template v-for="city in weatherList" :key="city.id">
        <div v-if="selectedCityId === city.id">
          <p class="forecast-title">{{ city.name }}의 5일 예보</p>
          <ul class="forecast-list">
            <li v-for="item in city.forecast" :key="`${city.id}-${item.day}`" class="forecast-item">
              <span class="forecast-day">{{ item.day }}</span>
              <span class="forecast-icon">{{ weatherIcons[item.status] }}</span>
              <span class="forecast-temp">{{ item.temp }}°C</span>
            </li>
          </ul>
        </div>
      </template>

      <p v-if="!selectedCityId" class="placeholder-text">
        위 목록에서 도시 카드를 클릭하면 주간 예보가 표시됩니다.
      </p>
    </section>

    <!-- 상태 표시줄 -->
    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>
/* practice.css와 exercise.css의 전역 input 규칙이 서로 덮어쓰므로,
   과제 검색창 크기는 컴포넌트 scoped 규칙으로 고정한다 */
.search-box input {
  width: 90%;
  padding: 8px;
}

/* 커스터마이징: 선택된 카드 강조 (v-bind:class 객체 구문 활용) */
.weather-card.selected {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.weather-card h4 {
  margin: 0 0 6px 0;
}
.sub-info {
  color: #7f8c8d;
  font-size: 13px;
}
.placeholder-text {
  color: #b2bec3;
}

/* 대기질 현황 */
.air-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}
.air-city {
  width: 48px;
  font-weight: 600;
}
.air-value {
  flex: 1;
  color: #7f8c8d;
  font-size: 13px;
}
.air-good {
  background-color: #00b894;
}
.air-normal {
  background-color: #0984e3;
}
.air-bad {
  background-color: #e17055;
}
.air-worst {
  background-color: #d63031;
}

/* 주간 예보 */
.forecast-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.forecast-list {
  display: flex;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.forecast-item {
  flex: 1;
  text-align: center;
  padding: 10px 4px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}
.forecast-day {
  display: block;
  font-weight: 600;
  font-size: 13px;
  color: #636e72;
}
.forecast-icon {
  display: block;
  font-size: 20px;
  margin: 4px 0;
}
.forecast-temp {
  display: block;
  font-size: 13px;
}
</style>

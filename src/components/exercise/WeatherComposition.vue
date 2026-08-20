<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// [요구사항 1] 1일차와 동일한 반응형 상태 - 날씨 데이터 배열
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

// [요구사항 1] 검색어 / 선택된 도시 안내 문구
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 선택된 카드 id (하이라이트 + 주간 예보 노출 기준)
const selectedCityId = ref('')

// [커스터마이징] 최근 검색어 이력 (추가 반응형 상태 변수)
const searchHistory = ref([])

// ────────────────────────────────────────────────
// [요구사항 2] computed - 검색어가 포함된 도시만 필터링
// ────────────────────────────────────────────────
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  // 검색어가 비어 있으면 원본 목록을 그대로 반환한다
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

// [커스터마이징] computed - 선택된 도시 객체를 추출
// 1일차에는 template v-for로 전체 도시를 훑으며 v-if로 걸러냈지만,
// computed로 뽑아내면 순회 없이 바로 접근할 수 있고 템플릿도 단순해진다
const selectedCity = computed(() =>
  weatherList.value.find((city) => city.id === selectedCityId.value),
)

// [커스터마이징] 즐겨찾기 - 브라우저를 닫았다 열어도 유지되도록 localStorage에 보관
const FAVORITE_STORAGE_KEY = 'skala-vue:favorite-cities'
const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]')
  } catch {
    return [] // 저장된 값이 깨져 있어도 앱이 죽지 않도록 방어
  }
}
const favoriteIds = ref(loadFavorites())
const showFavoritesOnly = ref(false)

const isFavorite = (cityId) => favoriteIds.value.includes(cityId)
const toggleFavorite = (cityId) => {
  favoriteIds.value = isFavorite(cityId)
    ? favoriteIds.value.filter((id) => id !== cityId)
    : [...favoriteIds.value, cityId]
}

// [커스터마이징] 정렬 기준 (none | temp | pm10 | name)
const sortKey = ref('none')
const sortOrder = ref('desc')
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

// [커스터마이징] computed 3단 체이닝
// weatherList → filteredWeatherList(검색) → visibleWeatherList(즐겨찾기 + 정렬)
const visibleWeatherList = computed(() => {
  let list = filteredWeatherList.value

  if (showFavoritesOnly.value) {
    list = list.filter((city) => favoriteIds.value.includes(city.id))
  }
  if (sortKey.value === 'none') return list

  const direction = sortOrder.value === 'asc' ? 1 : -1
  // toSorted()는 ES2023에 추가된 불변성 메서드로 원본 배열을 훼손하지 않는다.
  // computed 안에서 sort()를 쓰면 원본 weatherList의 순서가 뒤섞여 버린다.
  return list.toSorted((a, b) =>
    sortKey.value === 'name'
      ? a.name.localeCompare(b.name) * direction
      : (a[sortKey.value] - b[sortKey.value]) * direction,
  )
})

// [커스터마이징] computed - 현재 표시 중인 목록의 요약 통계 (체이닝의 마지막 단계)
const weatherSummary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return null

  const temps = list.map((city) => city.temp)
  const total = temps.reduce((sum, temp) => sum + temp, 0)

  return {
    count: list.length,
    average: Math.round((total / list.length) * 10) / 10,
    hottest: list.reduce((a, b) => (a.temp >= b.temp ? a : b)),
    coldest: list.reduce((a, b) => (a.temp <= b.temp ? a : b)),
  }
})

// ────────────────────────────────────────────────
// [요구사항 3] watch - 상태바 문구 변화 감시
// ────────────────────────────────────────────────
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구 변경: "${oldInfo}" → "${newInfo}"`)
})

// [요구사항 3] watchEffect - 검색어 자동 추적
// 감시 대상을 명시하지 않아도 내부에서 읽은 searchQuery를 자동으로 의존성에 등록한다
watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// [커스터마이징] watch - 검색 결과 건수 변화를 감시하고 검색 이력을 남긴다
// filteredWeatherList(computed)도 감시 대상이 될 수 있다
watch(filteredWeatherList, (newList) => {
  const query = searchQuery.value.trim()
  console.log(`🔎 [watch 감지] 검색 결과 ${newList.length}건 (검색어: '${query || '전체'}')`)

  // 결과가 있는 검색어만 중복 없이 최근 5건까지 보관
  if (!query || newList.length === 0) return
  if (searchHistory.value[0] === query) return
  searchHistory.value = [query, ...searchHistory.value.filter((q) => q !== query)].slice(0, 5)
})

// [커스터마이징] watch - 즐겨찾기 변경 시 localStorage에 영속화
// watch의 실제 용도는 콘솔 로그가 아니라 이런 '부수 효과' 처리다.
// 배열 내부 변화를 감지해야 하므로 deep 옵션이 필요하다.
watch(
  favoriteIds,
  (ids) => {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(ids))
    console.log(`⭐ [watch 감지] 즐겨찾기 ${ids.length}건을 localStorage에 저장했습니다.`)
  },
  { deep: true },
)

// ────────────────────────────────────────────────
// 이벤트 핸들러
// ────────────────────────────────────────────────
const handleSearchInput = (e) => {
  searchQuery.value = e.target.value
}

// 도시명 끝 글자의 받침 유무로 주격 조사('이'/'가')를 판별
const getSubjectJosa = (word) => {
  const lastCode = word.charCodeAt(word.length - 1)
  if (lastCode < 0xac00 || lastCode > 0xd7a3) return '이'
  return (lastCode - 0xac00) % 28 === 0 ? '가' : '이'
}

const selectCard = (city) => {
  selectedCityId.value = city.id
  selectedCityInfo.value = `${city.name}${getSubjectJosa(city.name)} 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// [커스터마이징] 검색 이력을 클릭하면 그 검색어로 다시 검색
const applyHistory = (query) => {
  searchQuery.value = query
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
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

      <!-- [커스터마이징] 최근 검색어 - watch로 수집한 이력 -->
      <div v-if="searchHistory.length > 0" class="history-box">
        <span class="history-label">최근 검색어</span>
        <button
          v-for="query in searchHistory"
          :key="query"
          class="history-chip"
          @click="applyHistory(query)"
        >
          {{ query }}
        </button>
      </div>
    </section>

    <!-- [커스터마이징] computed 체이닝으로 만든 요약 통계 -->
    <section v-if="weatherSummary" class="list-box summary-box">
      <h3>📊 조회 결과 요약</h3>
      <p>
        표시 중인 도시 <strong>{{ weatherSummary.count }}곳</strong> / 평균 기온
        <strong>{{ weatherSummary.average }}°C</strong>
      </p>
      <p class="sub-info">
        가장 더운 곳: {{ weatherSummary.hottest.name }} ({{ weatherSummary.hottest.temp }}°C) / 가장
        선선한 곳: {{ weatherSummary.coldest.name }} ({{ weatherSummary.coldest.temp }}°C)
      </p>
    </section>

    <!-- 지역별 날씨 현황 (필터 결과 기준) -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- [커스터마이징] 정렬 / 즐겨찾기 필터 컨트롤 -->
      <div class="control-bar">
        <label>정렬 기준:</label>
        <select v-model="sortKey">
          <option value="none">기본 순서</option>
          <option value="temp">기온</option>
          <option value="pm10">미세먼지</option>
          <option value="name">이름</option>
        </select>
        <button :disabled="sortKey === 'none'" @click="toggleSortOrder">
          {{ sortOrder === 'desc' ? '내림차순 ↓' : '오름차순 ↑' }}
        </button>
        <label class="fav-filter">
          <input type="checkbox" v-model="showFavoritesOnly" />
          즐겨찾기만 보기 ({{ favoriteIds.length }})
        </label>
      </div>

      <div
        v-for="city in visibleWeatherList"
        :key="city.id"
        class="weather-card"
        :class="{ selected: selectedCityId === city.id }"
        @click="selectCard(city)"
      >
        <h4>
          <!-- [커스터마이징] 즐겨찾기 토글 (카드 클릭으로 전파되지 않도록 .stop) -->
          <button
            class="btn-fav"
            :class="{ on: isFavorite(city.id) }"
            @click.stop="toggleFavorite(city.id)"
          >
            {{ isFavorite(city.id) ? '⭐' : '☆' }}
          </button>
          {{ weatherIcons[city.status] }} {{ city.name }} ({{ city.status }})
        </h4>
        <p>현재 기온: {{ city.temp }}°C</p>
        <p class="sub-info">습도: {{ city.humidity }}%</p>

        <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>

      <!-- [요구사항 4] 검색 결과가 없을 때 안내 -->
      <!-- [커스터마이징] 결과가 0건인 원인(검색 / 즐겨찾기 필터)을 구분해 안내 -->
      <p v-if="filteredWeatherList.length === 0" class="no-result">
        😭 '{{ searchQuery }}' 와(과) 일치하는 도시가 없습니다.
      </p>
      <p v-else-if="visibleWeatherList.length === 0" class="no-result fav-empty">
        ⭐ 즐겨찾기한 도시가 없습니다. 카드의 별을 눌러 추가해 보세요.
      </p>
    </section>

    <!-- 대기질 현황 (필터 결과 연동) -->
    <section class="list-box">
      <h3>🌫️ 대기질 현황 (미세먼지 PM10)</h3>
      <div v-for="city in visibleWeatherList" :key="city.id" class="air-row">
        <span class="air-city">{{ city.name }}</span>
        <span class="air-value">{{ city.pm10 }}㎍/㎥</span>
        <span v-if="city.pm10 <= 30" class="badge air-good">😊 좋음</span>
        <span v-else-if="city.pm10 <= 80" class="badge air-normal">🙂 보통</span>
        <span v-else-if="city.pm10 <= 150" class="badge air-bad">😷 나쁨</span>
        <span v-else class="badge air-worst">🤢 매우 나쁨</span>
      </div>
      <p v-if="visibleWeatherList.length === 0" class="placeholder-text">
        표시할 대기질 정보가 없습니다.
      </p>
    </section>

    <!-- 주간 예보 - selectedCity computed 덕분에 순회 없이 바로 접근 -->
    <section class="list-box">
      <h3>📅 주간 예보</h3>
      <div v-if="selectedCity">
        <p class="forecast-title">{{ selectedCity.name }}의 5일 예보</p>
        <ul class="forecast-list">
          <li v-for="item in selectedCity.forecast" :key="item.day" class="forecast-item">
            <span class="forecast-day">{{ item.day }}</span>
            <span class="forecast-icon">{{ weatherIcons[item.status] }}</span>
            <span class="forecast-temp">{{ item.temp }}°C</span>
          </li>
        </ul>
      </div>
      <p v-else class="placeholder-text">
        위 목록에서 도시 카드를 클릭하면 주간 예보가 표시됩니다.
      </p>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
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
/* 조회 결과 요약 */
.summary-box {
  background: #f1f8ff;
  border-color: #74b9ff;
}
/* 최근 검색어 */
.history-box {
  margin-top: 8px;
}
.history-label {
  margin-right: 8px;
  font-size: 13px;
  color: #7f8c8d;
}
.history-chip {
  margin-right: 6px;
  padding: 3px 10px;
  border: 1px solid #b2bec3;
  border-radius: 999px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}
.history-chip:hover {
  border-color: #3498db;
  color: #3498db;
}
/* 정렬 / 즐겨찾기 컨트롤 바 */
.control-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #dee2e6;
  font-size: 14px;
}
/* exercise.css의 전역 input 규칙(width:90%)이 체크박스까지 늘리는 것을 방지 */
.control-bar input[type='checkbox'] {
  width: auto;
  margin-right: 4px;
}
.fav-filter {
  display: flex;
  align-items: center;
  margin-left: auto;
  cursor: pointer;
}
/* 즐겨찾기 별 버튼 */
.btn-fav {
  padding: 0 4px;
  border: none;
  background: none;
  font-size: 15px;
  line-height: 1;
  color: #b2bec3;
  cursor: pointer;
}
.btn-fav.on {
  color: #fdcb6e;
}
.fav-empty {
  color: #e17055;
}
/* 검색 결과 없음 */
.no-result {
  padding: 10px 0;
  text-align: center;
  color: #e74c3c;
}
</style>

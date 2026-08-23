<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import FilterControlBar from '@/components/exercise/FilterControlBar.vue'
import AirQualityList from '@/components/exercise/AirQualityList.vue'
import ForecastPanel from '@/components/exercise/ForecastPanel.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { evaluateMosquito, getMosquitoGrade } from '@/components/exercise/mosquitoScore'
import mosquitoIcon from '@/assets/mosquito.png'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const weatherList = computed(() => weatherStore.cities)

const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택하면 상세 정보를 볼 수 있습니다.')

const selectedCityId = ref('')

const searchHistory = ref([])

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const selectedCity = computed(() =>
  weatherList.value.find((city) => city.id === selectedCityId.value),
)

const FAVORITE_STORAGE_KEY = 'skala-vue:favorite-cities'
const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
const favoriteIds = ref([])
const showFavoritesOnly = ref(false)

const isFavorite = (cityId) => favoriteIds.value.includes(cityId)
const toggleFavorite = (cityId) => {
  favoriteIds.value = isFavorite(cityId)
    ? favoriteIds.value.filter((id) => id !== cityId)
    : [...favoriteIds.value, cityId]
}

const sortKey = ref('none')
const sortOrder = ref('desc')
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const visibleWeatherList = computed(() => {
  let list = filteredWeatherList.value

  if (showFavoritesOnly.value) {
    list = list.filter((city) => favoriteIds.value.includes(city.id))
  }
  if (sortKey.value === 'none') return list

  const direction = sortOrder.value === 'asc' ? 1 : -1
  const valueOf = (city) =>
    sortKey.value === 'mosquito' ? evaluateMosquito(city).score : city[sortKey.value]

  return [...list].sort((a, b) =>
    sortKey.value === 'name'
      ? a.name.localeCompare(b.name) * direction
      : (valueOf(a) - valueOf(b)) * direction,
  )
})

const weatherSummary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return null

  const scored = list.map((city) => ({ city, ...evaluateMosquito(city) }))

  let tempSum = 0
  let scoreSum = 0
  let hottest = list[0]
  let coldest = list[0]
  let worst = scored[0]

  for (const city of list) {
    tempSum += city.temp
    if (city.temp > hottest.temp) hottest = city
    if (city.temp < coldest.temp) coldest = city
  }
  for (const item of scored) {
    scoreSum += item.score
    if (item.score > worst.score) worst = item
  }

  return {
    count: list.length,
    average: Math.round((tempSum / list.length) * 10) / 10,
    hottest,
    coldest,
    mosquitoAvg: Math.round(scoreSum / scored.length),
    mosquitoGrade: getMosquitoGrade(Math.round(scoreSum / scored.length)),
    mosquitoWorst: worst,
  }
})

const AUTO_REFRESH_MS = 300000
const autoRefresh = ref(true)
let refreshTimer = null

const refreshWeather = () => weatherStore.fetchAll()

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구 변경: "${oldInfo}" → "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

watch(filteredWeatherList, (newList) => {
  const query = searchQuery.value.trim()
  console.log(`🔎 [watch 감지] 목록 필터 결과 ${newList.length}건 (검색어: '${query || '전체'}')`)
})

const handleSubmitSearch = (keyword) => {
  if (!keyword) return
  searchHistory.value = [keyword, ...searchHistory.value.filter((q) => q !== keyword)].slice(0, 5)
  console.log(`📝 [검색 실행] 이력에 '${keyword}' 추가`)
}

watch(
  favoriteIds,
  (ids) => {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(ids))
    console.log(`⭐ [watch 감지] 즐겨찾기 ${ids.length}건을 localStorage에 저장했습니다.`)
  },
  { deep: true },
)

onMounted(() => {
  favoriteIds.value = loadFavorites()
  weatherStore.restoreAdded()
  weatherStore.ensureLoaded()
  refreshTimer = setInterval(() => {
    if (autoRefresh.value) refreshWeather()
  }, AUTO_REFRESH_MS)
  console.log('🟢 [onMounted] 즐겨찾기 복원 · API 조회 · 자동 갱신 타이머 시작')
})

onUnmounted(() => {
  clearInterval(refreshTimer)
  refreshTimer = null
  console.log('🔴 [onUnmounted] 자동 갱신 타이머를 정리했습니다.')
})

const getSubjectJosa = (word) => {
  const lastCode = word.charCodeAt(word.length - 1)
  if (lastCode < 0xac00 || lastCode > 0xd7a3) return '이'
  return (lastCode - 0xac00) % 28 === 0 ? '가' : '이'
}

const handleSelectCard = (city) => {
  selectedCityId.value = city.id
  selectedCityInfo.value = `${city.name}${getSubjectJosa(city.name)} 선택되었습니다.`
}

// WeatherCard의 click-detail 수신
const handleDetailJump = (city) => {
  router.push(`/weather/${city.id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <p v-if="weatherStore.isOffline" class="offline-banner">
      ⚠️ 실시간 데이터를 불러오지 못해 예시 데이터를 표시하고 있습니다.
      {{ weatherStore.errorMessage }}
    </p>

    <BaseDashboardCard class="search-card">
      <template #title>➕ 도시 검색</template>
      <SearchBar
        :current-query="searchQuery"
        :search-history="searchHistory"
        @update-query="(val) => (searchQuery = val)"
        @submit-search="handleSubmitSearch"
      />
    </BaseDashboardCard>

    <div class="dashboard-grid">
      <div class="col-main">
        <BaseDashboardCard>
          <template #title>🏙️ 지역별 모기활동지수 ({{ weatherStore.cities.length }}곳)</template>

          <FilterControlBar
            :sort-key="sortKey"
            :sort-order="sortOrder"
            :favorites-only="showFavoritesOnly"
            :favorite-count="favoriteIds.length"
            @change-sort-key="(key) => (sortKey = key)"
            @toggle-sort-order="toggleSortOrder"
            @change-favorites-only="(checked) => (showFavoritesOnly = checked)"
          />

          <p v-if="weatherStore.isLoading && !weatherStore.isReady" class="loading-text">
            🔄 기상 데이터를 불러오는 중입니다
          </p>

          <template v-else>
            <div class="card-grid">
              <WeatherCard
                v-for="item in visibleWeatherList"
                :key="item.id"
                :city-item="item"
                :is-selected="selectedCityId === item.id"
                :is-favorite="isFavorite(item.id)"
                :is-removable="weatherStore.isRemovable(item.id)"
                @select-card="handleSelectCard"
                @click-detail="handleDetailJump"
                @toggle-favorite="toggleFavorite"
                @remove-city="weatherStore.removeCity"
              />
            </div>

            <el-empty
              v-if="filteredWeatherList.length === 0"
              :description="`목록에 '${searchQuery}' 검색 결과가 없습니다`"
              :image-size="70"
            >
              <span class="empty-hint">
                검색창에서 Enter를 누르면 새 도시를 추가할 수 있습니다.
              </span>
            </el-empty>
            <el-empty
              v-else-if="visibleWeatherList.length === 0"
              description="즐겨찾기한 도시가 없습니다"
              :image-size="70"
            >
              <span class="empty-hint">카드의 별 아이콘을 누르면 즐겨찾기에 추가됩니다.</span>
            </el-empty>
          </template>
        </BaseDashboardCard>

        <BaseDashboardCard collapsible>
          <template #title="{ isOpen }">
            📅 주간 모기 예보
            <small v-if="!isOpen && selectedCity" class="title-hint"
              >— {{ selectedCity.name }}</small
            >
          </template>
          <ForecastPanel :city="selectedCity" />
        </BaseDashboardCard>
      </div>

      <aside class="col-side">
        <BaseDashboardCard v-if="weatherSummary" tone="summary">
          <template #title>📊 오늘의 모기 요약</template>

          <template #action>
            <button
              class="btn-refresh"
              :class="{ on: autoRefresh }"
              @click="autoRefresh = !autoRefresh"
            >
              {{ autoRefresh ? '🔄 자동 갱신 켜짐' : '⏸️ 자동 갱신 꺼짐' }}
            </button>
          </template>

          <div class="summary-head">
            <div class="summary-main">
              <span class="summary-label">{{ weatherSummary.count }}곳 평균</span>
              <span class="summary-score" :class="weatherSummary.mosquitoGrade.tone">
                <img class="inline-icon" :src="mosquitoIcon" alt="" />{{
                  weatherSummary.mosquitoAvg
                }}점
                <small>{{ weatherSummary.mosquitoGrade.label }}</small>
              </span>
            </div>
            <div class="summary-track">
              <div
                class="summary-fill"
                :class="weatherSummary.mosquitoGrade.tone"
                :style="{ width: weatherSummary.mosquitoAvg + '%' }"
              ></div>
            </div>
          </div>

          <p class="sub-info">
            모기활동지수가 가장 높은 곳 —
            <strong>{{ weatherSummary.mosquitoWorst.city.name }}</strong>
            {{ weatherSummary.mosquitoWorst.score }}점 ·
            {{ weatherSummary.mosquitoWorst.grade.label }}
          </p>
          <p class="sub-info">{{ weatherSummary.mosquitoGrade.action }}</p>
          <p class="sub-info">
            평균 기온 {{ configStore.toDisplayTemp(weatherSummary.average)
            }}{{ configStore.unitSymbol }} · 가장 더운 곳 {{ weatherSummary.hottest.name }} · 가장
            시원한 곳 {{ weatherSummary.coldest.name }}
          </p>
          <p class="sub-info">
            마지막 갱신 {{ weatherStore.lastUpdatedLabel }} · 5분마다 자동 갱신
          </p>
        </BaseDashboardCard>

        <BaseDashboardCard collapsible>
          <template #title="{ isOpen }">
            🌫️ 대기질 (PM10)
            <small v-if="!isOpen" class="title-hint">— {{ visibleWeatherList.length }}곳</small>
          </template>
          <AirQualityList :cities="visibleWeatherList" />
        </BaseDashboardCard>
      </aside>
    </div>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
}

.search-card {
  position: relative;
  z-index: 30;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
  gap: 14px;
  align-items: start;
}
.col-main,
.col-side {
  min-width: 0;
}

.col-side {
  position: sticky;
  top: 84px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}
@media (max-width: 1080px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .col-side {
    position: static;
  }
}
/* 상태 바 스타일은 이 화면에서만 쓰이므로 여기에 둔다 */
.status-bar {
  padding: 11px;
  text-align: center;
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.035);
  border: 1px solid var(--glass-line);
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 13px;
}

.summary-head {
  margin-bottom: 12px;
}
.summary-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 9px;
}
.summary-label {
  font-size: 12.5px;
  color: var(--ink-soft);
}
.summary-score {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}
.summary-score small {
  margin-left: 5px;
  font-size: 13px;
  font-weight: 700;
}
.summary-track {
  height: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.summary-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s var(--ease);
}
.summary-score.ok {
  color: var(--grade-ok);
}
.summary-score.soft {
  color: var(--grade-soft);
}
.summary-score.warn {
  color: var(--grade-warn);
}
.summary-score.danger {
  color: var(--grade-danger);
}
.summary-fill.ok {
  background-color: var(--grade-ok);
}
.summary-fill.soft {
  background-color: var(--grade-soft);
}
.summary-fill.warn {
  background-color: var(--grade-warn);
}
.summary-fill.danger {
  background-color: var(--grade-danger);
}

.sub-info {
  margin: 5px 0 0;
  color: var(--ink-mute);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.sub-info strong {
  color: var(--ink-soft);
}

.title-hint {
  margin-left: 4px;
  font-weight: 400;
  font-size: 12px;
  color: var(--ink-mute);
}

.btn-refresh {
  padding: 4px 12px;
  border: 1px solid var(--glass-line);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.022);
  font-size: 11.5px;
  color: var(--ink-mute);
  cursor: pointer;
  transition: all 0.18s var(--ease);
}
.btn-refresh.on {
  border-color: rgba(0, 0, 0, 0.28);
  color: var(--grade-soft);
}

.loading-text {
  padding: 22px 0;
  text-align: center;
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 13px;
}

.offline-banner {
  margin-bottom: 14px;
  padding: 11px 14px;
  border: 1px solid var(--glass-line-strong);
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.05);
  color: var(--ink);
  font-size: 12.5px;
}

.empty-hint {
  font-size: 12px;
  color: var(--ink-mute);
}
.no-result {
  padding: 16px 0;
  text-align: center;
  color: var(--ink-soft);
  font-size: 13px;
}
.no-result small {
  color: var(--ink-mute);
}
.fav-empty {
  color: var(--ink-mute);
}
</style>

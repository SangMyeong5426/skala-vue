import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchAllCities,
  fetchCityById,
  fetchCityByCoords,
  searchCityByName,
  hasApiKey,
} from '@/api/weatherApi'
import { createWeatherList } from '@/data/weatherMock'

const ADDED_CITIES_KEY = 'skala-vue:added-cities'

export const useWeatherStore = defineStore('weather', () => {
  const cities = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastUpdatedAt = ref(null)
  const isOffline = ref(false)

  const addedCities = ref([])
  const searchResults = ref([])
  const isSearching = ref(false)

  const isReady = computed(() => cities.value.length > 0)
  function findCity(cityId) {
    return cities.value.find((city) => city.id === cityId)
  }
  const lastUpdatedLabel = computed(() =>
    lastUpdatedAt.value ? lastUpdatedAt.value.toLocaleTimeString('ko-KR') : '–',
  )

  // 전체 도시 실시간 조회 — 기본 도시 + 사용자가 추가한 도시
  async function fetchAll() {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [defaults, added] = await Promise.all([
        fetchAllCities(),
        Promise.all(addedCities.value.map((city) => fetchCityByCoords(city))),
      ])
      cities.value = [...defaults, ...added]
      isOffline.value = false
      lastUpdatedAt.value = new Date()
      console.log('🟢 [weatherStore] 실시간 기상 데이터 동기화 완료', cities.value)
    } catch (error) {
      console.error('🔴 [weatherStore] API 연동 실패 — Mock 데이터로 대체합니다:', error)
      errorMessage.value = hasApiKey()
        ? 'API 응답을 받지 못했습니다. 키 활성화 여부나 네트워크를 확인하세요.'
        : 'API 키가 설정되지 않았습니다. .env.local에 VITE_OPENWEATHER_API_KEY를 넣어 주세요.'
      if (!isReady.value) cities.value = createWeatherList()
      isOffline.value = true
      lastUpdatedAt.value = new Date()
    } finally {
      isLoading.value = false
    }
  }

  async function ensureLoaded() {
    if (isReady.value || isLoading.value) return
    await fetchAll()
  }

  // 상세 페이지 단건 조회.
  async function loadCityDetail(cityId) {
    try {
      const detail = await fetchCityById(cityId)
      if (detail) {
        const saved = findCity(cityId)
        if (saved) {
          return { ...detail, short: saved.short, name: saved.name, detailName: saved.detailName }
        }
        return detail
      }
    } catch (error) {
      console.error(`🔴 [weatherStore] 상세 조회 실패(${cityId}) — 목록 값으로 대체합니다:`, error)
    }
    return findCity(cityId) ?? null
  }

  async function search(query) {
    if (!query.trim()) {
      searchResults.value = []
      return
    }
    isSearching.value = true
    try {
      searchResults.value = await searchCityByName(query)
    } catch (error) {
      console.error('🔴 [weatherStore] 도시 검색 실패:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  function clearSearch() {
    searchResults.value = []
  }

  async function addCity(place) {
    if (cities.value.some((city) => city.id === place.id)) return
    const entry = {
      id: place.id,
      short: place.short,
      name: place.name,
      detailName: place.detailName,
      lat: place.lat,
      lon: place.lon,
    }
    addedCities.value = [...addedCities.value, entry]
    persistAdded()
    try {
      cities.value = [...cities.value, await fetchCityByCoords(entry)]
    } catch (error) {
      console.error(`🔴 [weatherStore] '${place.name}' 조회 실패:`, error)
      removeCity(place.id)
    }
  }

  function removeCity(cityId) {
    addedCities.value = addedCities.value.filter((city) => city.id !== cityId)
    cities.value = cities.value.filter((city) => city.id !== cityId)
    persistAdded()
  }

  function isRemovable(cityId) {
    return addedCities.value.some((city) => city.id === cityId)
  }

  function persistAdded() {
    try {
      localStorage.setItem(ADDED_CITIES_KEY, JSON.stringify(addedCities.value))
    } catch {
      // 저장소가 없으면 저장만 건너뛴다
    }
  }

  function restoreAdded() {
    try {
      const saved = JSON.parse(localStorage.getItem(ADDED_CITIES_KEY) || '[]')
      if (Array.isArray(saved)) addedCities.value = saved
    } catch {
      addedCities.value = []
    }
  }

  return {
    cities,
    addedCities,
    searchResults,
    isSearching,
    search,
    clearSearch,
    addCity,
    removeCity,
    isRemovable,
    restoreAdded,
    isLoading,
    errorMessage,
    lastUpdatedAt,
    isOffline,
    isReady,
    findCity,
    lastUpdatedLabel,
    fetchAll,
    ensureLoaded,
    loadCityDetail,
  }
})

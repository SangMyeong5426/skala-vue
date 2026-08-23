import axios from 'axios'
import { CITY_CATALOG, makeCityId, parseCityId } from '@/data/cities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const COMMON = `appid=${API_KEY}&units=metric&lang=kr`

export const hasApiKey = () => Boolean(API_KEY)

export const normalizeStatus = (weatherId) => {
  if (weatherId === 800) return '맑음'
  if (weatherId >= 801 && weatherId <= 803) return '구름'
  if (weatherId === 804) return '흐림'
  if (weatherId >= 600 && weatherId < 700) return '눈'
  if (weatherId >= 700 && weatherId < 800) return '흐림'
  if (weatherId >= 200 && weatherId < 600) return '비'
  return '흐림'
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const toLocal = (unixSeconds, timezoneSeconds) => new Date((unixSeconds + timezoneSeconds) * 1000)

const pad = (n) => String(n).padStart(2, '0')

const formatObservedAt = (unixSeconds, timezoneSeconds) => {
  const d = toLocal(unixSeconds, timezoneSeconds)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

const buildForecast = (forecastData) => {
  const tzSeconds = forecastData.city?.timezone ?? 0

  const items = forecastData.list.map((entry) => {
    const local = toLocal(entry.dt, tzSeconds)
    return {
      entry,
      dateKey: `${local.getUTCFullYear()}-${local.getUTCMonth()}-${local.getUTCDate()}`,
      day: DAY_LABELS[local.getUTCDay()],
      hour: local.getUTCHours(),
    }
  })

  const dateKeys = []
  for (const item of items) {
    if (!dateKeys.includes(item.dateKey)) dateKeys.push(item.dateKey)
  }

  return dateKeys.slice(0, 5).map((dateKey) => {
    const sameDay = items.filter((item) => item.dateKey === dateKey)

    let maxTemp = sameDay[0].entry.main.temp
    let noon = sameDay[0]
    for (const item of sameDay) {
      maxTemp = Math.max(maxTemp, item.entry.main.temp)
      if (Math.abs(item.hour - 12) < Math.abs(noon.hour - 12)) noon = item
    }

    return {
      day: noon.day,
      temp: Math.round(maxTemp),
      status: normalizeStatus(noon.entry.weather[0].id),
      humidity: noon.entry.main.humidity,
      wind: noon.entry.wind.speed,
    }
  })
}

const fetchCityBundle = async (city) => {
  const coords = `lat=${city.lat}&lon=${city.lon}`

  const [current, air, forecast] = await Promise.all([
    axios.get(`${BASE_URL}/weather?${coords}&${COMMON}`),
    axios.get(`${BASE_URL}/air_pollution?${coords}&${COMMON}`),
    axios.get(`${BASE_URL}/forecast?${coords}&${COMMON}`),
  ])

  const now = current.data
  return {
    id: city.id,
    lat: city.lat,
    lon: city.lon,
    short: city.short ?? now.name,
    name: city.name ?? now.name,
    detailName: city.detailName ?? now.name,
    temp: Math.round(now.main.temp),
    feelsLike: Math.round(now.main.feels_like),
    status: normalizeStatus(now.weather[0].id),
    statusText: now.weather[0].description,
    humidity: now.main.humidity,
    wind: now.wind.speed,
    pm10: Math.round(air.data.list[0].components.pm10),
    observedAt: formatObservedAt(now.dt, now.timezone),
    forecast: buildForecast(forecast.data),
  }
}

// 전체 도시를 병렬로 조회 — 5개 도시를 순차로 돌면 5배 느리다.
export const fetchAllCities = async () => {
  if (!hasApiKey()) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 없습니다. .env.local을 확인하세요.')
  }
  return Promise.all(CITY_CATALOG.map((city) => fetchCityBundle(city)))
}

export const searchCityByName = async (query) => {
  const keyword = query.trim()
  if (!keyword || !hasApiKey()) return []

  const url = `${GEO_URL}/direct?q=${encodeURIComponent(keyword)},KR&limit=8&appid=${API_KEY}`
  const response = await axios.get(url)

  const korean = response.data.filter((place) => place.country === 'KR')

  return korean.map((place) => {
    const name = place.local_names?.ko ?? place.name
    const region = place.state ?? '대한민국'
    return {
      id: makeCityId(place.lat, place.lon),
      short: name,
      name,
      detailName: `${name} (${region})`,
      region,
      lat: place.lat,
      lon: place.lon,
    }
  })
}

export const fetchCityByCoords = async (city) => {
  if (!hasApiKey()) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 없습니다. .env.local을 확인하세요.')
  }
  return fetchCityBundle(city)
}

// 상세 페이지용 단건 조회
export const fetchCityById = async (cityId) => {
  const city = parseCityId(cityId)
  if (!city) return null
  if (!hasApiKey()) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 없습니다. .env.local을 확인하세요.')
  }
  return fetchCityBundle(city)
}

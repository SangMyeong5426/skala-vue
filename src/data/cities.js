export const CITY_CATALOG = [
  {
    id: 'city_seoul',
    short: '서울',
    name: '서울',
    detailName: '서울특별시',
    lat: 37.5665,
    lon: 126.978,
  },
  {
    id: 'city_daejeon',
    short: '대전',
    name: '대전',
    detailName: '대전광역시',
    lat: 36.3504,
    lon: 127.3845,
  },
  {
    id: 'city_gwangju',
    short: '광주',
    name: '광주',
    detailName: '광주광역시',
    lat: 35.1595,
    lon: 126.8526,
  },
  {
    id: 'city_busan',
    short: '부산',
    name: '부산',
    detailName: '부산광역시',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    id: 'city_jeju',
    short: '제주',
    name: '제주',
    detailName: '제주특별자치도 제주시',
    lat: 33.4996,
    lon: 126.5312,
  },
]

export const findCity = (cityId) => CITY_CATALOG.find((city) => city.id === cityId) ?? null

const round4 = (n) => Math.round(n * 10000) / 10000

export const makeCityId = (lat, lon) => `geo_${round4(lat)}_${round4(lon)}`

export const parseCityId = (cityId) => {
  const known = findCity(cityId)
  if (known) return known

  const parts = (cityId ?? '').split('_')
  if (parts.length !== 3 || parts[0] !== 'geo') return null

  const lat = Number(parts[1])
  const lon = Number(parts[2])
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  return { id: cityId, lat, lon }
}

export const isKnownCity = (cityId) => Boolean(parseCityId(cityId))

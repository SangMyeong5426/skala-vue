import axios from 'axios'

// 일출·일몰 조회 (sunrise-sunset.org) — 키가 필요 없는 공개 API
const SUN_URL = 'https://api.sunrise-sunset.org/json'

// tzid를 넘기면 '2026-08-23T19:16:24+09:00'처럼 현지 시각으로 돌려준다.
// 앞에서 시:분만 잘라 쓰면 시간대 계산을 따로 하지 않아도 된다.
const toHourMinute = (isoText) => isoText.slice(11, 16)

const toHourValue = (isoText) => {
  const parts = toHourMinute(isoText).split(':')
  return Number(parts[0]) + Number(parts[1]) / 60
}

export const fetchSunTimes = async (city) => {
  const query = `lat=${city.lat}&lng=${city.lon}&tzid=Asia/Seoul&formatted=0`
  const response = await axios.get(`${SUN_URL}?${query}`)
  const result = response.data.results

  return {
    sunriseLabel: toHourMinute(result.sunrise),
    sunsetLabel: toHourMinute(result.sunset),
    sunrise: toHourValue(result.sunrise),
    sunset: toHourValue(result.sunset),
  }
}

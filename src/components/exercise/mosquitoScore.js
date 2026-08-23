const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const TEMP_PEAK = 28
const TEMP_COLD_SPAN = 13
const TEMP_HOT_SPAN = 7

export const getTempScore = (temp) => {
  const span = temp <= TEMP_PEAK ? TEMP_COLD_SPAN : TEMP_HOT_SPAN
  const ratio = Math.abs(temp - TEMP_PEAK) / span
  return 50 * clamp(1 - ratio * ratio, 0, 1)
}

export const getTempNote = (temp) => {
  if (temp >= 35) return '폭염이라 모기도 활동을 멈춥니다'
  if (temp >= 33) return '너무 더워 여름잠에 듭니다'
  if (temp >= 32) return '더위로 활동이 줄기 시작합니다'
  if (temp >= 30) return '조금 덥지만 아직 활발합니다'
  if (temp >= 26) return '모기가 가장 활발한 기온대입니다'
  if (temp >= 22) return '활동하기 좋은 기온입니다'
  if (temp >= 18) return '활동이 눈에 띄게 둔해집니다'
  if (temp >= 15) return '날아다니기도 힘든 기온입니다'
  return '겨울잠에 드는 기온입니다'
}

const HUMID_ACTIVE = 60
export const getHumidityScore = (humidity) => {
  if (humidity <= HUMID_ACTIVE) return 18 * clamp((humidity - 35) / (HUMID_ACTIVE - 35), 0, 1)
  return 18 + 12 * clamp((humidity - HUMID_ACTIVE) / (100 - HUMID_ACTIVE), 0, 1)
}

export const getHumidityNote = (humidity) => {
  if (humidity >= 80) return '아주 습해 번식하기 좋습니다'
  if (humidity >= 60) return '습해서 활동이 활발합니다'
  if (humidity >= 40) return '활동에 무난한 습도입니다'
  return '건조해서 활동이 어렵습니다'
}

const WIND_HEIGHT_FACTOR = 0.6
const WIND_CALM = 0.3
const WIND_STOP = 2.2

export const toMosquitoLevelWind = (stationWind) => (stationWind ?? 0) * WIND_HEIGHT_FACTOR

export const getWindScore = (stationWind) => {
  const wind = toMosquitoLevelWind(stationWind)
  if (wind <= WIND_CALM) return 20
  return 20 * clamp(1 - (wind - WIND_CALM) / (WIND_STOP - WIND_CALM), 0, 1)
}

// 풍속이 아니라 점수로 문구를 정한다.
// 풍속으로 나누면 점수가 0에 가까워지는 구간이 두 문구에 걸쳐
// '크게 방해 +0'과 '날지 못합니다 +0'이 같이 나올 수 있다.
export const getWindNote = (stationWind) => {
  const score = Math.round(getWindScore(stationWind))
  if (score === 0) return '바람이 강해 날지 못합니다'
  if (score <= 6) return '바람이 활동을 크게 방해합니다'
  if (score <= 13) return '바람이 활동을 다소 방해합니다'
  if (score <= 19) return '약한 바람이 붑니다'
  return '바람이 거의 없어 날기 좋습니다'
}

export const getMosquitoScore = (city) => {
  const tempScore = getTempScore(city.temp)
  const total = tempScore + getHumidityScore(city.humidity) + getWindScore(city.wind)

  const cap = 5 + tempScore * 1.9
  return Math.round(Math.min(total, cap))
}

export const MOSQUITO_GRADES = [
  {
    min: 76,
    step: 4,
    label: '불쾌',
    tone: 'danger',
    action: '야외 활동을 줄이고 긴 옷을 입으세요',
  },
  { min: 51, step: 3, label: '주의', tone: 'warn', action: '외출할 때 기피제를 챙기세요' },
  { min: 26, step: 2, label: '관심', tone: 'soft', action: '창문 방충망에 틈이 없는지 확인하세요' },
  { min: 0, step: 1, label: '쾌적', tone: 'ok', action: '특별히 대비하지 않아도 괜찮습니다' },
]

export const getMosquitoGrade = (score) => MOSQUITO_GRADES.find((grade) => score >= grade.min)

export const evaluateMosquito = (city) => {
  const score = getMosquitoScore(city)
  return {
    score,
    grade: getMosquitoGrade(score),
    temp: { score: Math.round(getTempScore(city.temp)), note: getTempNote(city.temp) },
    humidity: {
      score: Math.round(getHumidityScore(city.humidity)),
      note: getHumidityNote(city.humidity),
    },
    wind: { score: Math.round(getWindScore(city.wind)), note: getWindNote(city.wind) },
  }
}

export const TEMP_CURVE = [12, 15, 18, 21, 24, 26, 28, 30, 32, 34, 36].map((temp) => ({
  temp,
  score: Math.round(getTempScore(temp)),
}))

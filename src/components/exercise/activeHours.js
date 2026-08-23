// 모기는 박모성(crepuscular) 곤충이라 한낮이 아니라 해 질 무렵과 동틀 무렵에 흡혈이 몰린다.
// 국내 주택가에서 가장 흔한 집모기 기준으로, 일몰 직후 두 시간이 가장 활발하고
// 일출 직전 한 시간이 그다음이다.
const DUSK_HOURS = 2
const DAWN_HOURS = 1

const clampHour = (hour) => Math.min(24, Math.max(0, hour))

export const toClock = (hourValue) => {
  const total = Math.round(clampHour(hourValue) * 60)
  const hour = Math.floor(total / 60) % 24
  const minute = total % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const getActiveHours = (sun) => {
  if (!sun) return []

  const bands = [
    {
      key: 'dusk',
      label: '일몰 직후',
      rank: '활동 정점',
      from: sun.sunset,
      to: sun.sunset + DUSK_HOURS,
    },
    {
      key: 'dawn',
      label: '일출 직전',
      rank: '두 번째 정점',
      from: sun.sunrise - DAWN_HOURS,
      to: sun.sunrise,
    },
  ]

  return bands.map((band) => {
    const from = clampHour(band.from)
    const to = clampHour(band.to)
    return {
      ...band,
      from,
      to,
      range: `${toClock(from)} ~ ${toClock(to)}`,
      // 24시간 막대 위에 올릴 위치와 폭
      left: (from / 24) * 100,
      width: ((to - from) / 24) * 100,
    }
  })
}

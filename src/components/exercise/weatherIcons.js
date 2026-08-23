export const WEATHER_ICONS = {
  맑음: '☀️',
  비: '🌧️',
  구름: '⛅',
  흐림: '☁️',
  눈: '🌨️',
}

export const getWeatherIcon = (status) => WEATHER_ICONS[status] ?? '🌡️'

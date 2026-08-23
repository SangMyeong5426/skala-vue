import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const UNIT_STORAGE_KEY = 'skala-vue:temp-unit'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  function toDisplayTemp(celsius) {
    if (celsius === null || celsius === undefined) return celsius
    return unit.value === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
  }

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function restoreUnit() {
    try {
      const saved = localStorage.getItem(UNIT_STORAGE_KEY)
      if (saved === 'celsius' || saved === 'fahrenheit') {
        unit.value = saved
      }
    } catch {
      // 저장소가 없으면 기본값을 쓴다
    }
  }

  watch(unit, (value) => {
    try {
      localStorage.setItem(UNIT_STORAGE_KEY, value)
      console.log(`🌡️ [configStore] 표시 단위를 '${value}'로 변경했습니다.`)
    } catch {
      // 저장소가 없으면 저장만 건너뛴다
    }
  })

  return {
    unit,
    unitSymbol,
    toDisplayTemp,
    toggleUnit,
    restoreUnit,
  }
})

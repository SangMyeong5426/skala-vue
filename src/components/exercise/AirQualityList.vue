<script setup>
// [요구사항 7 - 추가 Component] 대기질(PM10) 현황.
defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="air-inner">
    <div v-for="city in cities" :key="city.id" class="air-row">
      <span class="air-city">{{ city.name }}</span>
      <span class="air-value">{{ city.pm10 }}㎍/㎥</span>
      <span v-if="city.pm10 <= 30" class="badge air-good">😊 좋음</span>
      <span v-else-if="city.pm10 <= 80" class="badge air-normal">🙂 보통</span>
      <span v-else-if="city.pm10 <= 150" class="badge air-bad">😷 나쁨</span>
      <span v-else class="badge air-worst">🤢 매우 나쁨</span>
    </div>
    <p v-if="cities.length === 0" class="placeholder-text">표시할 대기질 정보가 없습니다</p>
  </div>
</template>

<style scoped>
.air-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--glass-line);
}
.air-row:last-child {
  border-bottom: none;
}
.air-city {
  width: 56px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
}
.air-value {
  flex: 1;
  color: var(--ink-mute);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.badge {
  font-size: 11.5px;
  font-weight: 700;
}
.air-good {
  color: var(--grade-ok);
}
.air-normal {
  color: var(--grade-soft);
}
.air-bad {
  color: var(--grade-warn);
}
.air-worst {
  color: var(--grade-danger);
}
.placeholder-text {
  color: var(--ink-mute);
  font-size: 13px;
}
</style>

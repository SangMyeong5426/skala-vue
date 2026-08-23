<script setup>
// 선택된 도시의 5일 예보.
import { computed } from 'vue'
import { getWeatherIcon } from './weatherIcons'
import { evaluateMosquito } from './mosquitoScore'
import mosquitoIcon from '@/assets/mosquito.png'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
})

const days = computed(() =>
  (props.city?.forecast ?? []).map((day) => ({
    ...day,
    mosquito: evaluateMosquito(day),
  })),
)

const worstDay = computed(() => {
  let worst = null
  for (const day of days.value) {
    if (!worst || day.mosquito.score > worst.mosquito.score) worst = day
  }
  return worst
})
</script>

<template>
  <div class="forecast-inner">
    <div v-if="city">
      <p class="forecast-title">{{ city.name }}의 5일 예보</p>

      <ul class="forecast-list">
        <li v-for="item in days" :key="item.day" class="forecast-item">
          <span class="forecast-day">{{ item.day }}</span>
          <span class="forecast-icon">{{ getWeatherIcon(item.status) }}</span>
          <span class="forecast-temp">
            {{ configStore.toDisplayTemp(item.temp) }}{{ configStore.unitSymbol }}
          </span>

          <span class="mosquito-bar">
            <span
              class="mosquito-fill"
              :class="item.mosquito.grade.tone"
              :style="{ height: Math.max(item.mosquito.score, 4) + '%' }"
            ></span>
          </span>
          <span class="mosquito-score" :class="item.mosquito.grade.tone">
            <img class="inline-icon sm" :src="mosquitoIcon" alt="" />{{ item.mosquito.score }}
          </span>
        </li>
      </ul>

      <p v-if="worstDay" class="forecast-summary">
        이번 주는
        <strong :class="worstDay.mosquito.grade.tone">{{ worstDay.day }}요일</strong>의
        모기활동지수가 가장 높습니다 ({{ worstDay.mosquito.score }}점 ·
        {{ worstDay.mosquito.grade.label }}) {{ worstDay.mosquito.grade.action }}.
      </p>
    </div>

    <p v-else class="placeholder-text">도시를 선택하면 5일 예보를 볼 수 있습니다.</p>
  </div>
</template>

<style scoped>
.forecast-title {
  margin: 0 0 10px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink-soft);
}
.forecast-list {
  display: flex;
  gap: 7px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.forecast-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 11px 4px;
  background: rgba(0, 0, 0, 0.022);
  border: 1px solid var(--glass-line);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s var(--ease);
}
.forecast-item:hover {
  background: rgba(0, 0, 0, 0.05);
}
.forecast-day {
  font-weight: 700;
  font-size: 12px;
  color: var(--ink-soft);
}
.forecast-icon {
  font-size: 19px;
}
.forecast-temp {
  font-size: 12px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.mosquito-bar {
  display: flex;
  align-items: flex-end;
  width: 9px;
  height: 32px;
  margin-top: 2px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.mosquito-fill {
  width: 100%;
  border-radius: 999px;
  transition: height 0.5s var(--ease);
}
.mosquito-score {
  font-size: 11px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.forecast-summary {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.022);
  border: 1px solid var(--glass-line);
  font-size: 12.5px;
  color: var(--ink-soft);
}
.placeholder-text {
  color: var(--ink-mute);
  font-size: 13px;
}

.ok {
  color: var(--grade-ok);
}
.soft {
  color: var(--grade-soft);
}
.warn {
  color: var(--grade-warn);
}
.danger {
  color: var(--grade-danger);
}
.mosquito-fill.ok {
  background-color: var(--grade-ok);
}
.mosquito-fill.soft {
  background-color: var(--grade-soft);
}
.mosquito-fill.warn {
  background-color: var(--grade-warn);
}
.mosquito-fill.danger {
  background-color: var(--grade-danger);
}
</style>

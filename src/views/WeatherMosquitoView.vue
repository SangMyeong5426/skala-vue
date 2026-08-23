<script setup>
// [요구사항 6] 본인 추가 View — 모기활동지수 랭킹
import { computed, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { evaluateMosquito, MOSQUITO_GRADES } from '@/components/exercise/mosquitoScore'
import { getWeatherIcon } from '@/components/exercise/weatherIcons'
import mosquitoIcon from '@/assets/mosquito.png'
import { useConfigStore } from '@/stores/configStore'

const weatherStore = useWeatherStore()
const configStore = useConfigStore()

onMounted(() => weatherStore.ensureLoaded())

const ranking = computed(() => {
  const scored = weatherStore.cities.map((city) => ({ city, ...evaluateMosquito(city) }))
  return [...scored].sort((a, b) => b.score - a.score)
})

const worst = computed(() => ranking.value[0] ?? null)
const RANK_MARKS = ['🥇', '🥈', '🥉']

const gradeLegend = [...MOSQUITO_GRADES].reverse()
</script>

<template>
  <div class="mosquito-wrapper">
    <header class="page-head">
      <h3><img class="title-icon" :src="mosquitoIcon" alt="" />오늘의 모기활동지수</h3>
      <p class="page-sub">기온 50점 · 습도 30점 · 바람 20점 — 총 100점</p>
    </header>

    <el-skeleton v-if="weatherStore.isLoading && !weatherStore.isReady" :rows="6" animated />

    <p v-else-if="!worst" class="loading-text">표시할 도시 데이터가 없습니다.</p>

    <div v-else class="rank-layout">
      <aside class="rank-aside">
        <section class="spotlight" :class="worst.grade.tone">
          <span class="spotlight-eyebrow">오늘 가장 주의할 곳</span>
          <strong class="spotlight-city">{{ worst.city.name }}</strong>
          <span class="spotlight-score">{{ worst.score }}<small>점</small></span>
          <span class="spotlight-grade">{{ worst.grade.step }}단계 · {{ worst.grade.label }}</span>
          <p class="spotlight-action">{{ worst.grade.action }}</p>
        </section>

        <section class="legend">
          <p class="legend-title">단계 기준 — 서울시 모기예보제와 같은 4단계</p>
          <div class="legend-row">
            <span v-for="g in gradeLegend" :key="g.step" class="legend-item" :class="g.tone">
              {{ g.step }}단계 {{ g.label }}
              <small>{{ g.min }}점~</small>
            </span>
          </div>
        </section>
      </aside>

      <ol class="rank-list">
        <li v-for="(item, i) in ranking" :key="item.city.id" class="rank-item">
          <span class="rank-no">{{ RANK_MARKS[i] ?? i + 1 }}</span>

          <div class="rank-main">
            <div class="rank-title">
              <RouterLink :to="`/weather/${item.city.id}`" class="rank-city">
                {{ getWeatherIcon(item.city.status) }} {{ item.city.name }}
              </RouterLink>
              <span class="rank-grade" :class="item.grade.tone">{{ item.grade.label }}</span>
            </div>

            <div class="score-track">
              <div
                class="score-fill"
                :class="item.grade.tone"
                :style="{ width: item.score + '%' }"
              ></div>
            </div>

            <ul class="reasons">
              <li>
                <span class="reason-key">🌡️ 기온</span>
                <span class="reason-val"
                  >{{ configStore.toDisplayTemp(item.city.temp) }}{{ configStore.unitSymbol }}</span
                >
                <span class="reason-note">{{ item.temp.note }}</span>
                <span class="reason-pt">+{{ item.temp.score }}</span>
              </li>
              <li>
                <span class="reason-key">💧 습도</span>
                <span class="reason-val">{{ item.city.humidity }}%</span>
                <span class="reason-note">{{ item.humidity.note }}</span>
                <span class="reason-pt">+{{ item.humidity.score }}</span>
              </li>
              <li>
                <span class="reason-key">🍃 바람</span>
                <span class="reason-val">{{ item.city.wind ?? 0 }}m/s</span>
                <span class="reason-note">{{ item.wind.note }}</span>
                <span class="reason-pt">+{{ item.wind.score }}</span>
              </li>
            </ul>
          </div>

          <span class="rank-score" :class="item.grade.tone">{{ item.score }}</span>
        </li>
      </ol>
    </div>

    <p class="hint">
      도시 이름을 누르면 상세 페이지로 이동합니다.
      <span v-if="weatherStore.isOffline">
        · ⚠️ 실시간 데이터를 불러오지 못해 예시 데이터를 표시하고 있습니다.</span
      >
    </p>
  </div>
</template>

<style scoped>
.mosquito-wrapper {
  width: 100%;
}

.rank-layout {
  display: grid;
  grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.rank-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (max-width: 1000px) {
  .rank-layout {
    grid-template-columns: 1fr;
  }
  .rank-aside {
    position: static;
  }
}
.page-head {
  margin-bottom: 18px;
}
.title-icon {
  width: 1.1em;
  height: 1.1em;
  vertical-align: -0.18em;
  margin-right: 7px;
  object-fit: contain;
}
.page-head h3 {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--ink);
}
.page-sub {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-mute);
}
.loading-text {
  padding: 22px 0;
  text-align: center;
  color: var(--grade-soft);
  font-weight: 700;
  font-size: 13px;
}

.spotlight {
  margin-bottom: 0 !important;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  padding: 22px 24px;
  margin-bottom: 18px;
  border-radius: var(--radius-lg);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}
.spotlight-eyebrow {
  grid-column: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.spotlight-city {
  grid-column: 1;
  color: var(--ink);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
}
.spotlight-score {
  grid-column: 2;
  grid-row: 1 / 3;
  font-size: 46px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.spotlight-score small {
  font-size: 16px;
  font-weight: 700;
}
.spotlight-grade {
  grid-column: 2;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
}
.spotlight-action {
  grid-column: 1 / -1;
  margin: 12px 0 0;
  padding-top: 11px;
  border-top: 1px solid var(--glass-line);
  font-size: 12.5px;
  color: var(--ink-soft);
}

.rank-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.rank-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--glass-line);
  background: none;
  transition:
    background-color 0.2s var(--ease),
    border-color 0.2s var(--ease);
}
.rank-item:hover {
  background: rgba(0, 0, 0, 0.045);
  border-color: var(--glass-line-strong);
}
.rank-no {
  width: 26px;
  padding-top: 2px;
  font-size: 17px;
  text-align: center;
}
.rank-main {
  flex: 1;
  min-width: 0;
}
.rank-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}
.rank-city {
  font-weight: 700;
  font-size: 14.5px;
  color: var(--ink);
  text-decoration: none;
}
.rank-city:hover {
  color: var(--grade-soft);
}
.rank-grade {
  font-size: 11px;
  font-weight: 800;
}
.score-track {
  height: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.score-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s var(--ease);
}

.reasons {
  margin: 11px 0 0;
  padding: 0;
  list-style: none;
  font-size: 11.5px;
}
.reasons li {
  display: grid;
  grid-template-columns: 50px 56px 1fr 30px;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  color: var(--ink-mute);
}
.reason-key {
  font-weight: 600;
  color: var(--ink-soft);
}
.reason-val {
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.reason-note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reason-pt {
  text-align: right;
  font-weight: 800;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}
.rank-score {
  width: 46px;
  padding-top: 2px;
  text-align: right;
  font-size: 24px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.legend {
  margin-top: 0;
  padding: 18px 20px;
  border: 1px solid var(--glass-line);
  background: #fff;
}
.legend-title {
  margin: 0 0 9px;
  font-size: 11.5px;
  color: var(--ink-mute);
}
.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.legend-item {
  font-size: 11.5px;
  font-weight: 800;
}
.legend-item small {
  margin-left: 3px;
  font-weight: 600;
  opacity: 0.75;
}
.hint {
  margin-top: 14px;
  color: var(--ink-mute);
  font-size: 12px;
}

.rank-grade.ok,
.legend-item.ok,
.spotlight.ok {
  color: var(--grade-ok);
}
.score-fill.ok {
  background-color: var(--grade-ok);
}
.rank-grade.soft,
.legend-item.soft,
.spotlight.soft {
  color: var(--grade-soft);
}
.score-fill.soft {
  background-color: var(--grade-soft);
}
.rank-grade.warn,
.legend-item.warn,
.spotlight.warn {
  color: var(--grade-warn);
}
.score-fill.warn {
  background-color: var(--grade-warn);
}
.rank-grade.danger,
.legend-item.danger,
.spotlight.danger {
  color: var(--grade-danger);
}
.score-fill.danger {
  background-color: var(--grade-danger);
}
.rank-score.ok {
  color: var(--grade-ok);
}
.rank-score.soft {
  color: var(--grade-soft);
}
.rank-score.warn {
  color: var(--grade-warn);
}
.rank-score.danger {
  color: var(--grade-danger);
}
</style>

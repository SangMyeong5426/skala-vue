<script setup>
// [요구사항 4] 지역별 상세 기상 관측 정보 페이지
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { isKnownCity } from '@/data/cities'
import { getWeatherIcon } from '@/components/exercise/weatherIcons'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { evaluateMosquito } from '@/components/exercise/mosquitoScore'
import { getActiveHours } from '@/components/exercise/activeHours'
import { fetchSunTimes } from '@/api/sunApi'
import mosquitoIcon from '@/assets/mosquito.png'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const cityData = ref(null)
const sunTimes = ref(null)
const isLoading = ref(false)

const activeHours = computed(() => getActiveHours(sunTimes.value))

const displayTemp = computed(() => configStore.toDisplayTemp(cityData.value?.temp))
const displayFeelsLike = computed(() => configStore.toDisplayTemp(cityData.value?.feelsLike))

const mosquito = computed(() => (cityData.value ? evaluateMosquito(cityData.value) : null))

const factors = computed(() => {
  if (!cityData.value || !mosquito.value) return []
  return [
    {
      icon: '🌡️',
      name: '기온',
      max: 50,
      score: mosquito.value.temp.score,
      value: `${displayTemp.value}${configStore.unitSymbol}`,
      note: mosquito.value.temp.note,
    },
    {
      icon: '💧',
      name: '습도',
      max: 30,
      score: mosquito.value.humidity.score,
      value: `${cityData.value.humidity}%`,
      note: mosquito.value.humidity.note,
    },
    {
      icon: '🍃',
      name: '바람',
      max: 20,
      score: mosquito.value.wind.score,
      value: `${cityData.value.wind}m/s`,
      note: mosquito.value.wind.note,
    },
  ]
})

const loadCity = async (id) => {
  if (!isKnownCity(id)) {
    cityData.value = null
    return
  }
  isLoading.value = true
  sunTimes.value = null
  try {
    cityData.value = await weatherStore.loadCityDetail(id)
  } finally {
    isLoading.value = false
  }

  // 일출·일몰은 없어도 본문을 보는 데 지장이 없으므로 실패하면 조용히 건너뛴다
  if (cityData.value) {
    try {
      sunTimes.value = await fetchSunTimes(cityData.value)
    } catch (error) {
      console.error('🔴 [상세] 일출·일몰 조회 실패:', error)
    }
  }
}

// [요구사항 4] 첫 진입 시 동적 경로의 cityId를 읽어 해당 도시를 조회
onMounted(() => {
  loadCity(route.params.cityId)
  console.log(`📄 [onMounted] 상세 페이지 진입 — cityId: ${route.params.cityId}`)
})

onBeforeRouteUpdate((to) => {
  if (!isKnownCity(to.params.cityId)) {
    console.warn(`🚧 [onBeforeRouteUpdate] 등록되지 않은 도시 코드: ${to.params.cityId}`)
    return { name: 'NotFound', params: { pathMatch: to.path.slice(1).split('/') } }
  }
  loadCity(to.params.cityId)
  console.log(`🔄 [onBeforeRouteUpdate] 도시 전환 — cityId: ${to.params.cityId}`)
  return true
})

// [요구사항 3] Programmatic Navigation — 대시보드에서 왔는지 랭킹에서 왔는지 모르니
// 목적지를 정해 보내지 않고 방문 기록을 한 칸 되돌린다
const goBack = () => router.back()
</script>

<template>
  <div class="detail-wrapper">
    <h3>📊 지역 상세 정보</h3>
    <hr />

    <el-skeleton v-if="isLoading" :rows="5" animated />

    <section v-else-if="cityData && mosquito" class="mosquito-hero" :class="mosquito.grade.tone">
      <div class="hero-left">
        <span class="hero-city">{{ cityData.detailName ?? cityData.name }}</span>
        <span class="hero-grade">{{ mosquito.grade.step }}단계 · {{ mosquito.grade.label }}</span>
      </div>
      <span class="hero-score"
        ><img class="hero-icon" :src="mosquitoIcon" alt="" />{{ mosquito.score
        }}<small>점</small></span
      >
      <p class="hero-action">{{ mosquito.grade.action }}</p>
    </section>

    <div v-if="!isLoading && factors.length" class="factor-grid">
      <article v-for="f in factors" :key="f.name" class="factor">
        <div class="factor-head">
          <span class="factor-name">{{ f.icon }} {{ f.name }}</span>
          <span class="factor-score"
            >{{ f.score }}<small>/{{ f.max }}</small></span
          >
        </div>
        <p class="factor-value">{{ f.value }}</p>
        <div class="factor-track">
          <div class="factor-fill" :style="{ width: (f.score / f.max) * 100 + '%' }"></div>
        </div>
        <p class="factor-note">{{ f.note }}</p>
      </article>
    </div>

    <div v-if="activeHours.length" class="info-card sun-card">
      <h4>🌇 오늘 조심할 시간</h4>
      <p class="sun-lead">
        모기는 해 질 무렵과 동틀 무렵에 흡혈 활동이 가장 활발합니다. 오늘
        {{ cityData.short }}의 일출은 {{ sunTimes.sunriseLabel }}, 일몰은
        {{ sunTimes.sunsetLabel }}입니다.
      </p>

      <div class="sun-track">
        <span
          v-for="band in activeHours"
          :key="band.key"
          class="sun-band"
          :class="band.key"
          :style="{ left: band.left + '%', width: band.width + '%' }"
        ></span>
      </div>
      <div class="sun-scale">
        <span>0시</span>
        <span>6시</span>
        <span>12시</span>
        <span>18시</span>
        <span>24시</span>
      </div>

      <ul class="sun-list">
        <li v-for="band in activeHours" :key="band.key" class="sun-item">
          <span class="sun-dot" :class="band.key"></span>
          <span class="sun-label">{{ band.label }}</span>
          <span class="sun-range">{{ band.range }}</span>
          <span class="sun-rank">{{ band.rank }}</span>
        </li>
      </ul>
    </div>

    <div v-if="!isLoading && cityData" class="info-card">
      <h4>📍 그 밖의 관측값</h4>
      <p>
        기상 현황: {{ getWeatherIcon(cityData.status) }} {{ cityData.status }}

        <span v-if="cityData.statusText" class="raw-status"
          >(API 원문: {{ cityData.statusText }})</span
        >
      </p>
      <p>체감 기온: {{ displayFeelsLike }}{{ configStore.unitSymbol }}</p>
      <p>
        미세먼지: {{ cityData.pm10 }}㎍/㎥

        <span v-if="cityData.pm10 <= 30" class="badge air-good">😊 좋음</span>
        <span v-else-if="cityData.pm10 <= 80" class="badge air-normal">🙂 보통</span>
        <span v-else-if="cityData.pm10 <= 150" class="badge air-bad">😷 나쁨</span>
        <span v-else class="badge air-worst">🤢 매우 나쁨</span>
      </p>
      <p class="observed">관측 시각: {{ cityData.observedAt }}</p>
    </div>

    <div v-else class="info-card empty">
      <p>해당 지역의 관측 데이터를 찾을 수 없습니다.</p>
    </div>

    <el-button round @click="goBack">← 이전으로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.detail-wrapper {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.detail-wrapper h3 {
  margin: 0 0 4px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--ink);
}
.detail-wrapper hr {
  border: none;
  border-top: 1px solid var(--glass-line);
  margin: 12px 0 0;
}

.mosquito-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
  padding: 20px 22px;
  margin: 16px 0;
  background: #ffffff;
  border: 1px solid var(--glass-line);
  border-left: 4px solid var(--ink-mute);
  border-radius: var(--radius-lg);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}
.mosquito-hero.ok {
  border-left-color: var(--grade-ok);
}
.mosquito-hero.soft {
  border-left-color: var(--grade-soft);
}
.mosquito-hero.warn {
  border-left-color: var(--grade-warn);
}
.mosquito-hero.danger {
  border-left-color: var(--grade-danger);
}
.mosquito-hero.ok .hero-score,
.mosquito-hero.ok .hero-grade,
.mosquito-hero.ok .hero-action {
  color: var(--grade-ok);
}
.mosquito-hero.soft .hero-score,
.mosquito-hero.soft .hero-grade,
.mosquito-hero.soft .hero-action {
  color: var(--grade-soft);
}
.mosquito-hero.warn .hero-score,
.mosquito-hero.warn .hero-grade,
.mosquito-hero.warn .hero-action {
  color: var(--grade-warn);
}
.mosquito-hero.danger .hero-score,
.mosquito-hero.danger .hero-grade,
.mosquito-hero.danger .hero-action {
  color: var(--grade-danger);
}
.hero-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hero-city {
  color: var(--ink);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.hero-grade {
  font-size: 12px;
  font-weight: 700;
}
.hero-score {
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.hero-icon {
  width: 0.72em;
  height: 0.72em;
  vertical-align: -0.05em;
  margin-right: 6px;
  object-fit: contain;
}
.hero-score small {
  font-size: 14px;
  font-weight: 700;
}
.hero-action {
  grid-column: 1 / -1;
  margin: 12px 0 0;
  padding-top: 11px;
  border-top: 1px solid var(--glass-line);
  font-size: 12.5px;
  font-weight: 700;
}

/* 점수 근거 — 항목마다 값·점수·설명을 한 칸에 모아 시선이 좌우로 튀지 않게 한다 */
.factor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.factor {
  padding: 15px 17px;
  background: #ffffff;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
}
.factor-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.factor-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}
.factor-score {
  font-size: 15px;
  font-weight: 800;
  color: var(--grade-soft);
  font-variant-numeric: tabular-nums;
}
.factor-score small {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-mute);
}
.factor-value {
  margin: 6px 0 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.factor-track {
  height: 4px;
  margin: 9px 0 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.factor-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--grade-soft);
}
.factor-note {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--ink-soft);
}
.loading-text {
  padding: 22px 0;
  text-align: center;
  color: var(--grade-soft);
  font-weight: 700;
  font-size: 13px;
}
/* 오늘 조심할 시간 — 24시간 막대에 활동 구간 두 개를 얹는다 */
.sun-lead {
  margin: 0 0 14px !important;
  line-height: 1.7 !important;
}
.sun-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.sun-band {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
}
.sun-band.dusk {
  background: var(--grade-danger);
}
.sun-band.dawn {
  background: var(--grade-warn);
}
.sun-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 10.5px;
  color: var(--ink-mute);
}
.sun-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}
.sun-item {
  display: grid;
  grid-template-columns: 8px auto auto 1fr;
  align-items: center;
  gap: 9px;
  padding: 7px 0;
  border-top: 1px solid var(--glass-line);
  font-size: 12.5px;
}
.sun-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
.sun-dot.dusk {
  background: var(--grade-danger);
}
.sun-dot.dawn {
  background: var(--grade-warn);
}
.sun-label {
  font-weight: 700;
  color: var(--ink);
}
.sun-range {
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}
.sun-rank {
  text-align: right;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-mute);
}
.raw-status {
  margin-left: 6px;
  color: var(--ink-mute);
  font-size: 12px;
}
.info-card {
  padding: 22px 24px;
  margin: 18px 0;
  background: #fff;
  border: 1px solid var(--glass-line);
}
.info-card h4 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}
.info-card p {
  margin: 6px 0;
  font-size: 13px;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}
.info-card strong {
  color: var(--ink);
}
.info-card.empty {
  color: var(--grade-danger);
}
.feels {
  margin-left: 6px;
  color: var(--ink-mute);
  font-size: 12px;
}
.observed {
  margin-top: 12px !important;
  color: var(--ink-mute);
  font-size: 11.5px;
}
.badge {
  display: inline-block;
  margin-left: 6px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  color: #ffffff;
}
.air-good {
  background-color: var(--grade-ok);
}
.air-normal {
  background-color: var(--grade-soft);
}
.air-bad {
  background-color: var(--grade-warn);
}
.air-worst {
  background-color: var(--grade-danger);
}
@media (max-width: 720px) {
  .factor-grid {
    grid-template-columns: 1fr;
  }
}
</style>

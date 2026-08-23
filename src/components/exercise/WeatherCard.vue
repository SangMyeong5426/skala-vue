<script setup>
// [요구사항 4] 선택된 도시 객체를 전달받아 표시하고(props),
import { computed } from 'vue'
import { getWeatherIcon } from './weatherIcons'
import { evaluateMosquito } from './mosquitoScore'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
    validator: (city) => ['id', 'name', 'temp', 'status'].every((key) => key in city),
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isRemovable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite', 'remove-city'])

const configStore = useConfigStore()

const displayTemp = computed(() => configStore.toDisplayTemp(props.cityItem.temp))

const HOT_THRESHOLD = 25
const displayThreshold = computed(() => configStore.toDisplayTemp(HOT_THRESHOLD))

const mosquito = computed(() => evaluateMosquito(props.cityItem))
</script>

<template>
  <div
    class="weather-card"
    :class="{ selected: isSelected }"
    @click="emit('select-card', cityItem)"
  >
    <h4>
      <button
        class="btn-fav"
        :class="{ on: isFavorite }"
        @click.stop="emit('toggle-favorite', cityItem.id)"
      >
        {{ isFavorite ? '⭐' : '☆' }}
      </button>
      {{ getWeatherIcon(cityItem.status) }} {{ cityItem.name }} ({{ cityItem.status }})
    </h4>

    <div class="mosquito-row">
      <span class="mosquito-badge" :class="mosquito.grade.tone">
        {{ mosquito.score }}<small>{{ mosquito.grade.label }}</small>
      </span>
      <span class="mosquito-track">
        <span
          class="mosquito-fill"
          :class="mosquito.grade.tone"
          :style="{ width: mosquito.score + '%' }"
        ></span>
      </span>
    </div>

    <p class="sub-info">
      기온 {{ displayTemp }}{{ configStore.unitSymbol }} · 습도 {{ cityItem.humidity }}% · 바람
      {{ cityItem.wind ?? 0 }}m/s
    </p>

    <span v-if="cityItem.temp >= HOT_THRESHOLD" class="badge hot">
      🔥 더움 ({{ displayThreshold }}{{ configStore.unitSymbol }} 이상)
    </span>
    <span v-else class="badge cool">
      ❄️ 선선함 ({{ displayThreshold }}{{ configStore.unitSymbol }} 미만)
    </span>

    <button
      v-if="isRemovable"
      class="btn-remove"
      title="목록에서 삭제"
      @click.stop="emit('remove-city', cityItem.id)"
    >
      ✕
    </button>

    <div v-if="isSelected" class="card-detail">
      <p class="cd-line">
        <span class="cd-key">🌡️ 기온</span>
        <span class="cd-pt">+{{ mosquito.temp.score }}</span>
        <span class="cd-note">{{ mosquito.temp.note }}</span>
      </p>
      <p class="cd-line">
        <span class="cd-key">💧 습도</span>
        <span class="cd-pt">+{{ mosquito.humidity.score }}</span>
        <span class="cd-note">{{ mosquito.humidity.note }}</span>
      </p>
      <p class="cd-line">
        <span class="cd-key">🍃 바람</span>
        <span class="cd-pt">+{{ mosquito.wind.score }}</span>
        <span class="cd-note">{{ mosquito.wind.note }}</span>
      </p>
      <p class="cd-action" :class="mosquito.grade.tone">{{ mosquito.grade.action }}</p>
    </div>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem)">
      상세보기 <span aria-hidden="true">→</span>
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  padding: 18px 18px 44px;
  background: #fff;
  border: 1px solid var(--glass-line);
  border-top: 2px solid var(--ink);
  cursor: pointer;
  transition: border-color 0.2s var(--ease);
}
.weather-card:hover {
  border-color: var(--ink-mute);
  border-top-color: var(--ink);
}
.weather-card.selected {
  border-color: var(--ink);
  box-shadow: 0 0 0 2px var(--ink);
}

/* 카드를 고르면 그 자리에서 점수 근거가 펼쳐진다 */
.card-detail {
  margin-top: 12px;
  padding-top: 11px;
  border-top: 1px dashed var(--glass-line-strong);
}
.cd-line {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin: 0 0 4px;
  font-size: 11.5px;
  color: var(--ink-soft);
}
.cd-key {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--ink);
}
.cd-pt {
  flex-shrink: 0;
  font-weight: 800;
  color: var(--grade-soft);
  font-variant-numeric: tabular-nums;
}
.cd-note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cd-action {
  margin: 8px 0 0;
  font-size: 11.5px;
  font-weight: 700;
}
.cd-action.ok {
  color: var(--grade-ok);
}
.cd-action.soft {
  color: var(--grade-soft);
}
.cd-action.warn {
  color: var(--grade-warn);
}
.cd-action.danger {
  color: var(--grade-danger);
}
.weather-card h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--ink);
}
.mosquito-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}
.mosquito-badge {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}
.mosquito-badge small {
  margin-left: 5px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
}
.mosquito-track {
  flex: 1;
  height: 3px;
  background: rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.mosquito-fill {
  display: block;
  height: 100%;
  transition: width 0.5s var(--ease);
}
.mosquito-badge.ok,
.mosquito-fill.ok {
  color: var(--grade-ok);
  background-color: var(--grade-ok);
}
.mosquito-badge.soft,
.mosquito-fill.soft {
  color: var(--grade-soft);
  background-color: var(--grade-soft);
}
.mosquito-badge.warn,
.mosquito-fill.warn {
  color: var(--grade-warn);
  background-color: var(--grade-warn);
}
.mosquito-badge.danger,
.mosquito-fill.danger {
  color: var(--grade-danger);
  background-color: var(--grade-danger);
}
.mosquito-badge.ok,
.mosquito-badge.soft,
.mosquito-badge.warn,
.mosquito-badge.danger {
  background: none;
}
.sub-info {
  margin: 0;
  color: var(--ink-mute);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.badge {
  display: inline-block;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-mute);
}
.hot,
.cool {
  background: none;
}
.btn-detail {
  position: absolute;
  right: 16px;
  bottom: 13px;
  padding: 5px 12px;
  border: 1px solid var(--glass-line-strong);
  border-radius: 999px;
  background: #ffffff;
  color: var(--ink-soft);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s var(--ease);
}
.btn-detail:hover {
  border-color: var(--ink);
  background: var(--ink);
  color: #ffffff;
}
.weather-card.selected .btn-detail {
  border-color: var(--ink);
  background: var(--ink);
  color: #ffffff;
}
.btn-fav {
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 1;
  color: var(--ink-mute);
  cursor: pointer;
}
.btn-fav.on {
  color: var(--ink);
}
.btn-remove {
  position: absolute;
  right: 16px;
  top: 14px;
  padding: 0 4px;
  border: none;
  background: none;
  color: var(--ink-mute);
  font-size: 12px;
  cursor: pointer;
}
.btn-remove:hover {
  color: var(--grade-danger);
}
</style>

<script setup>
// 검색 입력 컴포넌트.
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'

const props = defineProps({
  currentQuery: {
    type: String,
    required: true,
  },
  searchHistory: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update-query', 'submit-search'])

const weatherStore = useWeatherStore()
const isOpen = ref(false)

const runSearch = async () => {
  const keyword = props.currentQuery.trim()
  if (!keyword) return
  isOpen.value = true
  await weatherStore.search(keyword)
  emit('submit-search', keyword)
}

const handleInput = (event) => {
  emit('update-query', event.target.value)
  if (isOpen.value) {
    isOpen.value = false
    weatherStore.clearSearch()
  }
}

const clearAll = () => {
  emit('update-query', '')
  weatherStore.clearSearch()
  isOpen.value = false
}

const handleAdd = async (place) => {
  await weatherStore.addCity(place)
  clearAll()
}

const searchFromHistory = async (keyword) => {
  emit('update-query', keyword)
  isOpen.value = true
  await weatherStore.search(keyword)
}

const isAlreadyAdded = (place) => weatherStore.cities.some((city) => city.id === place.id)
</script>

<template>
  <div class="search-bar">
    <div class="input-wrap">
      <span class="input-icon">🔍</span>
      <!-- v-model 대신 :value + @input.
           한글은 조합 중에도 input 이벤트가 발생해 목록 필터가 즉시 반응한다.
           도시 검색은 여기서 부르지 않고 엔터/버튼에서만 부른다. -->
      <input
        class="search-input"
        type="text"
        :value="currentQuery"
        placeholder="도시 이름을 입력하세요 (예: 성남, 포항, 강릉)"
        @input="handleInput"
        @keyup.enter="runSearch"
      />
      <button v-if="currentQuery" class="btn-clear" title="지우기" @click="clearAll">✕</button>
      <button class="btn-search" :disabled="!currentQuery.trim()" @click="runSearch">찾기</button>
    </div>

    <p class="hint-line">
      입력하면 아래 목록이 걸러지고, <strong>Enter</strong>를 누르면 새 도시를 검색해 추가합니다.
      국내 도시만 지원합니다.
    </p>

    <div v-if="isOpen" class="dropdown">
      <p v-if="weatherStore.isSearching" class="dropdown-state">검색 중…</p>

      <div v-else-if="weatherStore.searchResults.length">
        <div class="dropdown-head">
          <span class="dropdown-label">추가할 도시를 선택하세요</span>
          <button class="btn-close" @click="isOpen = false">닫기</button>
        </div>
        <button
          v-for="place in weatherStore.searchResults"
          :key="place.id"
          class="dropdown-item"
          :disabled="isAlreadyAdded(place)"
          @click="handleAdd(place)"
        >
          <span class="place-name">{{ place.name }}</span>
          <span class="place-region">{{ place.region }}</span>
          <span class="place-action">{{ isAlreadyAdded(place) ? '추가됨' : '+ 추가' }}</span>
        </button>
      </div>

      <p v-else class="dropdown-state">
        '{{ currentQuery }}' 검색 결과가 없습니다.<br />
        <small>한글로 찾아지지 않으면 영문으로 입력해 보세요 (예: 강릉 → Gangneung)</small>
      </p>
    </div>

    <div v-if="searchHistory.length" class="history">
      <span class="history-label">최근 검색어</span>
      <button
        v-for="keyword in searchHistory"
        :key="keyword"
        class="history-chip"
        @click="searchFromHistory(keyword)"
      >
        {{ keyword }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
}
.hint-line {
  margin: 8px 0 0;
  font-size: 11.5px;
  color: var(--ink-mute);
}
.hint-line strong {
  color: var(--ink-soft);
}
/* 검색창 스타일은 공용 CSS가 아니라 이 컴포넌트가 갖는다 */
.input-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
  transition: border-color 0.18s var(--ease);
}
.input-wrap:focus-within {
  border-color: var(--grade-soft);
}
.input-icon {
  font-size: 14px;
  opacity: 0.6;
}
.search-input {
  flex: 1;
  padding: 11px 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--ink);
}
.search-input::placeholder {
  color: var(--ink-mute);
}
.btn-clear {
  padding: 2px 6px;
  border: none;
  background: none;
  color: var(--ink-mute);
  font-size: 13px;
  cursor: pointer;
}
.btn-clear:hover {
  color: var(--ink);
}
.btn-search {
  padding: 6px 15px;
  border: none;
  border-radius: 999px;
  background: #18181b;
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.18s var(--ease);
}
.btn-search:disabled {
  opacity: 0.35;
  cursor: default;
}
.dropdown-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px 2px;
}
.btn-close {
  border: none;
  background: none;
  color: var(--ink-mute);
  font-size: 11.5px;
  cursor: pointer;
}
.btn-close:hover {
  color: var(--ink);
}

.dropdown {
  position: absolute;
  z-index: 40;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  padding: 6px;
  background: #ffffff;
  border: 1px solid var(--glass-line-strong);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.dropdown-label,
.dropdown-state {
  margin: 0;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--ink-mute);
  line-height: 1.6;
}
.dropdown-state small {
  color: var(--ink-mute);
  opacity: 0.85;
}
.dropdown-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 9px;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s ease;
}
.dropdown-item:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.045);
}
.dropdown-item:disabled {
  cursor: default;
  opacity: 0.5;
}
.place-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}
.place-region {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--ink-mute);
}
.place-action {
  font-size: 12px;
  font-weight: 700;
  color: var(--grade-soft);
}

.history {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  margin-top: 9px;
}
.history-label {
  font-size: 11.5px;
  color: var(--ink-mute);
}
.history-chip {
  padding: 4px 11px;
  border: 1px solid var(--glass-line);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.03);
  font-size: 11.5px;
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.18s var(--ease);
}
.history-chip:hover {
  border-color: var(--grade-soft);
  color: var(--grade-soft);
}
</style>

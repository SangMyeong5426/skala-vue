<script setup>
// 검색박스와 리스트박스의 디자인을 공통화한 껍데기 컴포넌트.
import { ref } from 'vue'

defineProps({
  tone: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'summary', 'recommend'].includes(value),
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
})

const isOpen = ref(true)
const toggle = () => (isOpen.value = !isOpen.value)
</script>

<template>
  <div class="base-dashboard-card" :class="`tone-${tone}`">
    <div v-if="$slots.title" class="card-header">
      <h3 class="card-title">
        <slot name="title" :is-open="isOpen"></slot>
      </h3>
      <div class="card-action">
        <slot name="action"></slot>
        <button v-if="collapsible" class="btn-collapse" @click="toggle">
          {{ isOpen ? '접기 ▲' : '펼치기 ▼' }}
        </button>
      </div>
    </div>

    <div v-show="isOpen">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  padding: 22px 24px;
  margin-bottom: 18px;
  background: #fff;
  border: 1px solid var(--glass-line);
  border-radius: 4px;
}
.tone-summary,
.tone-recommend {
  background: #fff;
  border-color: var(--glass-line);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--glass-line);
}
.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.card-action {
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-collapse {
  padding: 3px 0;
  border: none;
  background: none;
  font-size: 11.5px;
  color: var(--ink-mute);
  cursor: pointer;
}
.btn-collapse:hover {
  color: var(--ink);
}
</style>

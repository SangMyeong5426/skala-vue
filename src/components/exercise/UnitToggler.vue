<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨 단위
      <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>
    <button class="toggle-btn" @click="configStore.toggleUnit">단위 변경</button>
  </div>
</template>

<style scoped>
/* [요구사항 5] 컴포넌트 스타일은 이 파일 안에서만 관리한다.
   내비게이션 바가 flex라 margin-left: auto로 우측 끝에 붙인다. */
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding-right: 6px;
}
.unit-label {
  font-size: 12px;
  color: var(--ink-mute);
}
.unit-label strong {
  color: var(--ink);
}
.toggle-btn {
  padding: 6px 12px;
  border: 1px solid var(--glass-line);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.035);
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 11.5px;
  cursor: pointer;
  transition: all 0.18s var(--ease);
}
.toggle-btn:hover {
  border-color: var(--grade-soft);
  color: var(--ink);
  background: rgba(0, 0, 0, 0.09);
}
</style>

<script setup>
import { ref } from 'vue'
import PropsEmitsChild from '@/components/practices/component/PropsEmitsChild.vue'
import PropsEmitsModelChild from '@/components/practices/component/PropsEmitsModelChild.vue'

// 1. 상위 컴포넌트의 로컬 반응형 상태 정의
const message = ref('Parent 초기 메시지')

// 2. 하위 컴포넌트의 커스텀 이벤트를 수신했을 때 실행될 핸들러 함수
// 인자(newValue)로 하위 컴포넌트가 보낸 페이로드가 자동 주입된다.
const handleUpdateRequest = (newValue) => {
  message.value = newValue
  pushLog('update-request', newValue)
}

// [커스터마이징] 자식에게 내려보낼 props를 부모에서 직접 조작해 유효성 검사를 확인
const score = ref(80)
const badgeLabel = ref('')
const level = ref(1)

// [커스터마이징] 수신한 이벤트 기록 - 어떤 페이로드가 올라오는지 눈으로 확인
const eventLog = ref([])
const pushLog = (name, payload) => {
  eventLog.value.unshift({
    id: eventLog.value.length + 1,
    name,
    payload: typeof payload === 'object' ? JSON.stringify(payload) : String(payload),
  })
  if (eventLog.value.length > 5) eventLog.value.pop()
}

const handleReport = (payload) => {
  pushLog('report', payload)
}
</script>

<template>
  <div class="practice-section">
    <h2>Props & Emits</h2>

    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>

      <!-- [커스터마이징] 내려보낼 props 제어판 -->
      <div class="prop-panel">
        <label>
          score (0~100 검증)
          <input type="number" v-model.number="score" step="10" />
        </label>
        <label>
          level (다중 타입)
          <input v-model="level" placeholder="숫자 또는 문자열" />
        </label>
        <label>
          badgeLabel (비우면 기본값)
          <input v-model="badgeLabel" placeholder="비워두면 default 적용" />
        </label>
      </div>

      <!-- HTML 속성은 kebab-case, 자식의 props 선언은 camelCase (자료 p.161) -->
      <PropsEmitsChild
        :parent-data="message"
        :score="score"
        :level="level"
        :badge-label="badgeLabel || undefined"
        @update-request="handleUpdateRequest"
        @report="handleReport"
      />

      <!-- [커스터마이징] v-model 심화 -->
      <PropsEmitsModelChild v-model="message" />

      <!-- [커스터마이징] 수신 이벤트 로그 -->
      <h3>📨 수신한 이벤트 (최근 5건)</h3>
      <p v-if="eventLog.length === 0" class="hint">아직 수신한 이벤트가 없습니다.</p>
      <ul v-else class="event-log">
        <li v-for="log in eventLog" :key="log.id">
          <code>{{ log.name }}</code>
          <span class="payload">{{ log.payload }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.parent-container {
  margin: 0 auto;
  padding: 20px;
  border: 2px solid #2ecc71;
  border-radius: 8px;
  background-color: #f8f9fa;
}
.prop-panel {
  display: flex;
  gap: 12px;
  margin: 12px 0;
  padding: 10px 12px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
}
.prop-panel label {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  color: #636e72;
}
.event-log {
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
}
.event-log code {
  display: inline-block;
  min-width: 120px;
  color: #6c5ce7;
  font-weight: 600;
}
.event-log .payload {
  color: #2c3e50;
}
.hint {
  color: #b2bec3;
  font-size: 13px;
}
</style>

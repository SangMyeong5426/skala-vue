<script setup>
import { ref } from 'vue'
import LifecycleChild from '@/components/practices/component/LifecycleChild.vue'

const isShow = ref(true)

// [커스터마이징] 소멸 시 타이머 정리 여부를 스위치로 제어해 메모리 누수를 실증한다
const autoCleanup = ref(true)

// [커스터마이징] 자식이 보고한 훅 실행 순서를 화면에 기록 (콘솔을 열지 않아도 확인 가능)
const timeline = ref([])
const ghostTicks = ref(0)

const handleLifecycle = ({ hook, desc }) => {
  timeline.value.push({
    seq: timeline.value.length + 1,
    hook,
    desc,
    at: new Date().toLocaleTimeString('ko-KR'),
  })
}

// 이미 소멸한 컴포넌트의 타이머가 부모의 콜백을 계속 호출한다
const handleGhostTick = () => {
  ghostTicks.value++
}

const resetLog = () => {
  timeline.value = []
  ghostTicks.value = 0
}
</script>

<template>
  <div class="practice-section">
    <h2>Lifecycle Hook</h2>

    <button class="toggle-btn" @click="isShow = !isShow">
      {{ isShow ? '🛑 실습 컴포넌트 파괴하기 (v-if="false")' : '🟢 실습 컴포넌트 다시 살리기' }}
    </button>

    <!-- [커스터마이징] 타이머 정리 여부 스위치 -->
    <div class="option-row">
      <label>
        <input type="checkbox" v-model="autoCleanup" />
        소멸 시 타이머 정리 (onUnmounted에서 clearInterval 호출)
      </label>
      <button class="reset-btn" @click="resetLog">기록 초기화</button>
    </div>
    <p v-if="!autoCleanup" class="warn-text">
      ⚠️ 정리를 끈 상태로 파괴하면 타이머가 계속 돌아 메모리 누수가 발생합니다.
    </p>

    <hr />

    <LifecycleChild
      v-if="isShow"
      :auto-cleanup="autoCleanup"
      :on-ghost-tick="handleGhostTick"
      @lifecycle="handleLifecycle"
    />
    <p v-else class="destroyed-text">컴포넌트가 소멸된 상태입니다.</p>

    <!-- [커스터마이징] 훅 실행 순서 타임라인 -->
    <h3>🧭 훅 실행 순서 기록</h3>
    <p v-if="timeline.length === 0" class="hint">
      아직 기록이 없습니다. 위 버튼으로 파괴/생성해 보세요.
    </p>
    <ol v-else class="timeline">
      <li v-for="item in timeline" :key="item.seq">
        <code>{{ item.hook }}</code>
        <span class="desc">{{ item.desc }}</span>
        <span class="time">{{ item.at }}</span>
      </li>
    </ol>

    <p v-if="ghostTicks > 0" class="ghost-box">
      👻 소멸된 컴포넌트의 타이머가 <strong>{{ ghostTicks }}회</strong> 더 실행되었습니다. 콘솔의
      경고 로그를 확인해 보세요.
    </p>
  </div>
</template>

<style scoped>
.toggle-btn {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
}
.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 14px;
}
.reset-btn {
  padding: 4px 10px;
  font-size: 13px;
}
.warn-text {
  margin: 0 0 8px 0;
  color: #e17055;
  font-size: 13px;
}
.destroyed-text {
  padding: 20px;
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  color: #b2bec3;
  text-align: center;
}
.hint {
  color: #b2bec3;
  font-size: 13px;
}
.timeline {
  margin: 0;
  padding-left: 20px;
}
.timeline li {
  margin-bottom: 4px;
  font-size: 14px;
}
.timeline code {
  display: inline-block;
  min-width: 150px;
  color: #6c5ce7;
  font-weight: 600;
}
.timeline .desc {
  color: #2c3e50;
}
.timeline .time {
  margin-left: 8px;
  color: #b2bec3;
  font-size: 12px;
}
.ghost-box {
  margin-top: 10px;
  padding: 10px 14px;
  border: 1px solid #d63031;
  border-radius: 6px;
  background: #fff5f5;
  color: #d63031;
}
</style>

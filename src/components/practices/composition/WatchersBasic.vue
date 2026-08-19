<script setup>
import { ref, watch } from 'vue'

const currentCity = ref('서울')
const logMessage = ref('아직 감시 시스템이 작동하지 않았습니다.')

// currentCity 변수를 유심히 감시하는 watch 시스템 가동
// watch()는 감시를 중단할 수 있는 '중지 핸들' 함수를 반환한다
const stopWatcher = watch(currentCity, (newValue, oldValue) => {
  // 값이 바뀌는 순간, 바뀐 값 두 개가 자동으로 주입된다
  logMessage.value = `📍 감시자 발동! [${oldValue}]에서 [${newValue}]로 변경됨.`
  // 실무 활용처 시뮬레이션
  console.log(`🤖 [서버 요청 완료] 기상청 서버에서 ${newValue}의 날씨 API를 다시 조회합니다...`)
})

// [커스터마이징] immediate 옵션 - 값이 바뀌기를 기다리지 않고 생성 직후 1회 즉시 실행
// 초기 데이터 로딩에 사용한다 (watchEffect와 유사하지만 감시 대상을 명시할 수 있음)
const immediateLog = ref('')
watch(
  currentCity,
  (newValue) => {
    immediateLog.value = `[immediate] 현재 도시 = ${newValue}`
  },
  { immediate: true },
)

// [커스터마이징] 감시 중지 - 핸들 함수를 호출하면 그 이후 변경은 감지하지 않는다
const isWatching = ref(true)
const handleStopWatch = () => {
  stopWatcher()
  isWatching.value = false
  logMessage.value += ' (이후 감시 중지됨)'
}
</script>

<template>
  <div class="practice-section">
    <h2>감시자 watch()의 원리와 실무 활용</h2>
    <h3>🏙️ 지역 선택 제어판</h3>
    <p>현재 선택된 도시: {{ currentCity }}</p>
    <button @click="currentCity = '서울'">서울 선택</button>
    &nbsp;
    <button @click="currentCity = '수원'">수원 선택</button>
    &nbsp;
    <button @click="currentCity = '부산'">부산 선택</button>

    <div class="monitor">
      <h3>👁️‍🗨️ 파수꾼(watch) 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small style="color: gray">(버튼을 누른 후 브라우저 콘솔창 F12를 확인해 보세요)</small>
    </div>

    <!-- [커스터마이징] immediate 옵션 결과 -->
    <div class="monitor immediate">
      <p>⚡ immediate: true 모니터 (새로고침 직후 이미 값이 채워져 있음)</p>
      <p>{{ immediateLog }}</p>
    </div>

    <!-- [커스터마이징] 감시 중지 -->
    <h3>감시 제어 (추가 실습)</h3>
    <p>감시 상태: {{ isWatching ? '감시 중' : '중지됨' }}</p>
    <button :disabled="!isWatching" @click="handleStopWatch">첫 번째 감시자 중지하기</button>
    <small style="color: gray">
      &nbsp;중지 후 도시를 바꾸면 위 모니터는 멈추지만 immediate 모니터는 계속 동작합니다.
    </small>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #0984e3;
  border-radius: 6px;
  background: #e3fafc;
}
.immediate {
  border-color: #fdcb6e;
  background: #fff8e1;
}
</style>

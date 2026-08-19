<script setup>
import { ref, watchEffect } from 'vue'

const username = ref('홍길동')
const age = ref(20)
const logMessage = ref('대기 중...')

// watchEffect 가동: 감시 대상을 지정하는 파라미터가 없다
watchEffect(() => {
  // Vue가 이 내부 코드를 읽고 'username'과 'age'를 자동으로 감시 리스트에 등록한다
  logMessage.value = `[자동 감지] 이름: ${username.value} / 나이: ${age.value}세`

  // 화면이 처음 켜질 때 1등으로 즉시 실행되는 증거를 콘솔에서 확인한다
  console.log('🤖 watchEffect가 내부 변수 변경을 감지하여 실행되었습니다.')
})

// [커스터마이징] onCleanup 콜백으로 디바운스 구현
// watchEffect는 다음 실행 직전에 cleanup 함수를 먼저 호출한다.
// 이 성질을 이용하면 타이핑이 멈춘 뒤에만 요청을 보내는 디바운스를 만들 수 있다.
const searchKeyword = ref('')
const searchLog = ref('입력을 기다리는 중...')

watchEffect((onCleanup) => {
  const keyword = searchKeyword.value

  if (!keyword) {
    searchLog.value = '입력을 기다리는 중...'
    return
  }

  searchLog.value = `"${keyword}" 입력 중... (0.5초 후 요청)`
  const timerId = setTimeout(() => {
    searchLog.value = `✅ "${keyword}" 검색 요청을 전송했습니다.`
  }, 500)

  // 다음 실행 직전(= 다음 글자 입력 시) 이전 타이머를 취소한다
  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <div class="practice-section">
    <h2>자동 감시자 watchEffect()</h2>
    <p>이름: {{ username }} / 나이: {{ age }}세</p>
    <button @click="username = username === '홍길동' ? '이순신' : '홍길동'">이름 변경</button>
    &nbsp;
    <button @click="age++">나이 한 살 추가 (age++)</button>

    <div class="monitor">
      <h3>👁️‍🗨️ watchEffect 자동 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small style="color: gray">
        ※ 새로고침하자마자 버튼을 안 눌러도 로그가 이미 찍혀있는 특징을 주목하세요!
      </small>
    </div>

    <!-- [커스터마이징] onCleanup을 이용한 디바운스 -->
    <h3>onCleanup으로 만드는 디바운스 (추가 실습)</h3>
    <input type="text" v-model="searchKeyword" placeholder="검색어를 빠르게 입력해 보세요" />
    <div class="monitor debounce">
      <p>{{ searchLog }}</p>
      <small>※ 타이핑을 멈춘 뒤 0.5초가 지나야 요청이 전송됩니다.</small>
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  background: #fff5f5;
  font-weight: bold;
}
.monitor small {
  font-weight: normal;
  color: #636e72;
}
.debounce {
  border-color: #6c5ce7;
  background: #efe5ff;
}
</style>

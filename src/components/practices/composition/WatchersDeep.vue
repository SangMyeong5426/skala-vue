<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: '홍길동',
  age: 20,
})

const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')
const logSnapshot = ref('아직 반응 없음')

// 실패하는 예시 (가장 많이 범하는 오류)
// watch(user, () => { console.log('이 로그는 영원히 안 찍힙니다.') })
// → ref가 감싼 객체는 '주소'가 그대로이므로 내부 속성 변경을 감지하지 못한다

// 해결책 1: deep 옵션을 켜서 객체 하위 속성 전체 감시하기
watch(
  user,
  (newVal, oldVal) => {
    // [커스터마이징] deep 감시의 함정을 화면에서 직접 확인한다
    // newVal과 oldVal이 '같은 객체'를 가리키므로 이전 값을 추적할 수 없다
    logDeep.value =
      `[deep 감지] 이름: ${newVal.name}, 나이: ${newVal.age}세` +
      ` / oldVal.age = ${oldVal.age} (newVal과 동일한 객체인가? ${newVal === oldVal})`
  },
  { deep: true },
)

// 해결책 2: 화살표 함수로 특정 속성(age)만 콕 집어 감시하기 (★이전 값 추적 가능!)
watch(
  () => user.value.age,
  (newAge, oldAge) => {
    logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
  },
)

// [커스터마이징] 해결책 3: 스냅샷을 직접 떠서 이전 상태 전체를 보존하기
// 감시 대상 속성이 여러 개라 타겟 감시로는 부족할 때 실무에서 쓰는 우회법
let snapshot = { ...user.value }
watch(
  user,
  (newVal) => {
    logSnapshot.value = `[스냅샷] ${snapshot.name}(${snapshot.age}세) ➡️ ${newVal.name}(${newVal.age}세)`
    snapshot = { ...newVal } // 다음 비교를 위해 현재 상태를 복사해 둔다
  },
  { deep: true },
)
</script>

<template>
  <div class="practice-section">
    <h2>ref 객체/배열 감시</h2>
    <h3>👨‍💻 회원 데이터 조작 panel</h3>
    <p>이름: {{ user.name }} / 나이: {{ user.age }}세</p>
    <button @click="user.name = user.name === '홍길동' ? '이순신' : '홍길동'">이름만 변경</button>
    &nbsp;
    <button @click="user.age++">나이만 변경 (age++)</button>

    <div class="monitor">
      <p>👁️‍🗨️ 1) deep: true 모니터 (전체 감시)</p>
      <p>{{ logDeep }}</p>
      <small>※ 이전 값과 현재 값이 같은 객체라 oldVal로는 과거를 알 수 없다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 2) 화살표 함수 모니터 (나이만 타겟 감시)</p>
      <p>{{ logTarget }}</p>
    </div>

    <!-- [커스터마이징] 스냅샷 방식 -->
    <div class="monitor snapshot">
      <p>📸 3) 스냅샷 모니터 (추가 실습 - 이름·나이 모두 이전 값 추적)</p>
      <p>{{ logSnapshot }}</p>
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #0984e3;
  border-radius: 6px;
  background: #e3fafc;
  font-weight: bold;
}
.monitor small {
  font-weight: normal;
  color: #636e72;
}
.target {
  border-color: #6c5ce7;
  background: #efe5ff;
}
.snapshot {
  border-color: #e17055;
  background: #fff1ec;
}
</style>

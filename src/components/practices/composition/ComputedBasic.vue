<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const dummy = ref(0) // computed와 무관한 변수

// 1. 일반 함수: 화면이 조금이라도 리렌더링되면 무조건 재실행
const getMethodResult = () => {
  console.log('❌ 일반 함수 실행됨!')
  return count.value * 2
}

// 2. Computed: count가 바뀔 때만 재연산 (dummy가 바뀔 땐 이전 값 재사용)
const doubleCount = computed(() => {
  console.log('✅ Computed 연산 실행됨!')
  return count.value * 2
})

// [커스터마이징] computed 체이닝 - 다른 computed의 결과를 다시 의존성으로 사용
// doubleCount가 갱신될 때만 이 값도 함께 재계산된다
const doubleCountLabel = computed(() => (doubleCount.value >= 10 ? '10 이상' : '10 미만'))

// [커스터마이징] 쓰기 가능한 computed (get/set)
// computed는 기본이 읽기 전용이지만 set을 정의하면 대입이 가능해져
// v-model로도 양방향 바인딩할 수 있다 (입력한 값의 절반이 count에 반영됨)
const doubleCountWritable = computed({
  get: () => count.value * 2,
  set: (value) => {
    count.value = Math.floor(value / 2)
  },
})
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 동작 비교</h2>

    <p>count: {{ count }} | dummy: {{ dummy }}</p>
    <button @click="count++">count 증가 (의존성 변경)</button>
    &nbsp;
    <button @click="dummy++">dummy 증가 (무관한 변경)</button>

    <!-- dummy 버튼을 누를 때 콘솔 출력 차이를 확인 -->
    <p>일반 함수 결과: {{ getMethodResult() }}</p>
    <p>Computed 결과: {{ doubleCount }}</p>

    <!-- [커스터마이징] computed 체이닝 -->
    <h3>computed 체이닝 (추가 실습)</h3>
    <p>doubleCount 판정: {{ doubleCountLabel }}</p>

    <!-- [커스터마이징] 쓰기 가능한 computed -->
    <h3>쓰기 가능한 computed (get / set)</h3>
    <label>2배 값 직접 입력: </label>
    <input type="number" step="2" v-model.number="doubleCountWritable" />
    <p>입력한 값의 절반이 원본 count에 반영됩니다 → count: {{ count }}</p>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, watch } from 'vue'

// reactive로 선언한 묶음 상품 데이터
const state = reactive({
  productName: '노트북',
  price: 1000,
})

const logAutoDeep = ref('대기 중...')
const logTarget = ref('대기 중...')

// 1) 변수명 그대로 감시 (자동 deep: true 작동)
watch(state, (newVal, oldVal) => {
  // newVal.price와 oldVal.price가 똑같은 값으로 나온다
  logAutoDeep.value = `[자동 deep] 가격 변동! 이전가격인척하는:${oldVal.price}원 ➡️ 현재가격:${newVal.price}원`
})

// 2) 화살표 함수로 특정 속성만 감시 (이전 값 추적 가능!)
watch(
  () => state.price,
  (newPrice, oldPrice) => {
    // 특정 값만 추출했으므로 진짜 과거 가격이 정상 보존된다
    logTarget.value = `[타겟 조준] 가격이 진짜 올랐음! 옛날값:${oldPrice}원 ➡️ 바뀐값:${newPrice}원`
  },
)

// [커스터마이징] reactive의 대표적인 함정 - 구조 분해 시 반응성 단절
// 원시값(숫자/문자열)은 꺼내는 순간 '복사'되므로 이후 원본이 바뀌어도 갱신되지 않는다
const { price: detachedPrice } = state

// toRefs로 감싸면 각 속성이 ref로 변환되어 반응성 연결이 유지된다
const { price: linkedPrice } = toRefs(state)
</script>

<template>
  <div class="practice-section">
    <h2>reactive() 데이터 watch 감시 규칙</h2>
    <h3>🛒 상품 정보 관리 (reactive)</h3>
    <p>상품명: {{ state.productName }} / 가격: {{ state.price }}원</p>
    <button @click="state.price += 500">가격 500원 인상</button>

    <div class="monitor auto">
      <p>👁️‍🗨️ 1) state 변수 통째로 감시 (deep 자동화)</p>
      <p>{{ logAutoDeep }}</p>
      <small>※ 주의: 이전 값과 현재 값이 똑같이 찍힌다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 2) () =&gt; state.price 콕 집어 감시 (과거 추적)</p>
      <p>{{ logTarget }}</p>
      <small>※ 성공: 과거의 원본 가격이 칼같이 보존된다.</small>
    </div>

    <!-- [커스터마이징] 구조 분해 반응성 비교 -->
    <h3>구조 분해 시 반응성 단절 비교 (추가 실습)</h3>
    <table class="compare">
      <thead>
        <tr>
          <th>접근 방식</th>
          <th>현재 값</th>
          <th>반응성</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>state.price</code></td>
          <td>{{ state.price }}원</td>
          <td class="ok">유지</td>
        </tr>
        <tr>
          <td><code>const { price } = state</code></td>
          <td>{{ detachedPrice }}원</td>
          <td class="ng">끊김</td>
        </tr>
        <tr>
          <td><code>const { price } = toRefs(state)</code></td>
          <td>{{ linkedPrice }}원</td>
          <td class="ok">유지</td>
        </tr>
      </tbody>
    </table>
    <small>※ 가격 인상 버튼을 눌러도 가운데 행만 초기값에 멈춰 있다.</small>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-weight: bold;
}
.monitor small {
  font-weight: normal;
}
.auto {
  border-color: #ff7675;
  background: #fff5f5;
  color: #c0392b;
}
.target {
  border-color: #00b894;
  background: #e8f5e9;
  color: #27ae60;
}
.compare {
  border-collapse: collapse;
  margin-top: 8px;
}
.compare th,
.compare td {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  font-size: 14px;
}
.compare th {
  background: #f1f3f5;
}
.ok {
  color: #00b894;
  font-weight: bold;
}
.ng {
  color: #d63031;
  font-weight: bold;
}
</style>

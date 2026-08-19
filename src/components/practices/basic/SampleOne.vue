<script setup>
import { ref } from 'vue'

// 1. 일반 변수 (화면이 실시간으로 바뀌지 않음)
let normalCount = 0
// 2. 반응성 변수 (화면이 실시간으로 바뀜)
const vueCount = ref(0)

// [커스터마이징] 일반 변수의 '실제 값'을 확인해 화면 값과 다름을 증명
const checkNormalCount = () => {
  window.alert(`화면에 그려진 값과 별개로, normalCount의 실제 값은 ${normalCount} 입니다.`)
}

// [커스터마이징] 두 변수를 동시에 초기화
// vueCount가 바뀌며 리렌더링이 일어나면, 그동안 밀려 있던 normalCount 값도 화면에 반영된다
const resetAll = () => {
  normalCount = 0
  vueCount.value = 0
}
</script>

<template>
  <div class="practice-section">
    <h2>Hello Skala-Vue</h2>
    <h3>일반 변수 클릭: {{ normalCount }}</h3>
    <button @click="normalCount++">일반 변수 증가</button>
    <br />
    <h3>Vue 반응성 변수 클릭: {{ vueCount }}</h3>
    <button @click="vueCount++">Vue 변수 증가</button>
    <br />
    <!-- [커스터마이징] 반응형 동작을 눈으로 확인하기 위한 보조 버튼 -->
    <h3>반응성 확인용 추가 기능</h3>
    <button @click="checkNormalCount">일반 변수의 실제 값 확인</button>&nbsp;
    <button @click="resetAll">둘 다 0으로 초기화</button>
  </div>
</template>

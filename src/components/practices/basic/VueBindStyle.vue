<script setup>
import { ref } from 'vue'

// 1. 객체 바인딩용 변수
const textColor = ref('purple')
const boxWidth = ref(150) // 숫자만 제어
// 2. 배열 바인딩용 스타일 객체 무더기
const baseBoxStyle = ref({
  backgroundColor: '#42b883',
  height: '100px',
  transition: 'all 0.3s ease', // 부드러운 애니메이션 효과
})

// [커스터마이징] 슬라이더와 컬러 피커로 스타일을 실시간 제어
// range/color 입력값도 v-model로 그대로 바인딩할 수 있다 (숫자는 .number 수식어 사용)
const fontSize = ref(16)
const boxColor = ref('#42b883')
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (스타일 바인딩)</h2>
    <h3>1) 인라인 스타일 변수 조작 (객체 형식)</h3>
    <p :style="{ color: textColor, fontWeight: 'bold' }">이 글자의 색상은 실시간으로 바뀝니다.</p>
    <button @click="textColor = textColor === 'purple' ? 'blue' : 'purple'">글자 색상 토글</button>
    <br />

    <h3>2) 다중 스타일 객체 조립 (배열 형식)</h3>
    <label>박스 가로 크기(px): </label>
    <input type="number" v-model="boxWidth" step="50" />
    <br />
    <div :style="[baseBoxStyle, { width: boxWidth + 'px' }]">
      <p style="color: white; padding: 10px; text-align: center">
        가로 크기: {{ boxWidth }}px 박스
      </p>
    </div>

    <!-- [커스터마이징] 슬라이더 + 컬러 피커로 스타일 실시간 조작 -->
    <h3>3) 슬라이더/컬러 피커로 실시간 제어 (추가 실습)</h3>
    <label>글자 크기({{ fontSize }}px): </label>
    <input type="range" min="12" max="48" v-model.number="fontSize" />
    &nbsp;
    <label>배경 색상: </label>
    <input type="color" v-model="boxColor" />
    <p
      :style="{
        fontSize: fontSize + 'px',
        backgroundColor: boxColor,
        color: '#fff',
        padding: '10px',
      }"
    >
      크기와 색상이 즉시 반영되는 문단입니다.
    </p>
  </div>
</template>

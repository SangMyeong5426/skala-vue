<script setup>
import { ref } from 'vue'

const welcomeMessage = ref('Welcome to Skala-Vue')
</script>

<template>
  <div class="practice-section">
    <h2>{{ welcomeMessage }}</h2>
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>

    <!-- [커스터마이징] 보간법 안에서 쓸 수 있는 표현식 유형을 추가로 확인
         (if/for 같은 '문(statement)'은 불가능하고, 값으로 평가되는 '표현식'만 가능) -->
    <h3>표현식 활용 추가 예제</h3>
    <p>단어 수: {{ welcomeMessage.split(' ').length }}개</p>
    <p>거꾸로 뒤집기: {{ welcomeMessage.split('').reverse().join('') }}</p>
    <p>
      길이 판정(삼항 연산자): {{ welcomeMessage.length > 10 ? '긴 문장입니다' : '짧은 문장입니다' }}
    </p>
  </div>
</template>

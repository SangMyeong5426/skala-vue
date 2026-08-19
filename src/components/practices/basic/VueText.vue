<script setup>
const content = '안녕하세요! <strong>Skala-Vue</strong> 강의입니다.'
</script>

<template>
  <div class="practice-section">
    <h2>v-text 디렉티브 학습</h2>
    <h3>1) 일반 보간법 {{}} 결과:</h3>
    <p>출력: {{ content }}</p>
    <br />

    <h3>2) v-text 디렉티브 결과:</h3>
    <p v-text="'출력: ' + content"></p>
    <br />

    <h3>3) v-html 결과 비교:</h3>
    <p v-html="content"></p>
    <br />

    <!-- [커스터마이징] 보간법과 v-text의 실질적인 차이 비교
         보간법은 다른 텍스트와 섞어 쓸 수 있지만,
         v-text는 요소의 내용을 통째로 교체하므로 섞어 쓸 수 없다.
         (태그 사이에 내용을 적으면 Vue 컴파일러가 오류를 발생시킨다) -->
    <h3>4) 보간법 vs v-text - 다른 텍스트와 섞어 쓸 수 있는가:</h3>
    <p>[보간법] 오늘의 공지 → {{ content }}</p>
    <p v-text="content"></p>
    <small>v-text를 쓴 위 문단에는 '오늘의 공지' 같은 접두어를 함께 넣을 수 없다.</small>
  </div>
</template>

<script setup>
const rawHtmlData =
  '이 글자는 <span style="color: red; font-weight: bold;">빨간색 굵은 글자</span>이다.'

// [커스터마이징] 인라인 태그뿐 아니라 목록 같은 블록 구조도 통째로 주입되는지 확인
const rawHtmlList = `
  <ul>
    <li>v-html은 <b>문자열</b>을 DOM으로 해석한다</li>
    <li>내부적으로 element.innerHTML과 동일하게 동작한다</li>
    <li>따라서 신뢰할 수 없는 입력에는 사용하면 안 된다</li>
  </ul>
`
</script>

<template>
  <div class="practice-section">
    <h2>v-html 디렉티브 학습</h2>
    <h3>일반 보간법 {{}} 사용 결과:</h3>
    <p>{{ rawHtmlData }}</p>
    <br />
    <h3>v-html 디렉티브 사용 결과:</h3>
    <p v-html="rawHtmlData"></p>
    <br />

    <!-- [커스터마이징] 블록 요소(ul/li) 주입 예제 -->
    <h3>블록 구조(목록) 주입 결과:</h3>
    <div v-html="rawHtmlList"></div>
  </div>
</template>

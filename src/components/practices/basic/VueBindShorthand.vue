<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'

// [커스터마이징] 변수명을 HTML 표준 속성명과 동일하게 맞추면
// alt, title, href 등도 모두 same-name shorthand로 축약할 수 있다
const alt = 'Vue 공식 로고'
const title = '마우스를 올리면 이 툴팁이 표시됩니다'
const href = 'https://vuejs.org'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (단축 문법)</h2>
    <div :id>
      <img :src alt="Vue 로고" style="width: 50px" />
    </div>

    <!-- [커스터마이징] alt / title / href 까지 축약형으로 통일 -->
    <h3>축약형 확장 적용 (추가 실습)</h3>
    <img :src :alt :title style="width: 50px" />
    <p>
      <a :href :title>공식 사이트로 이동</a>
    </p>
  </div>
</template>

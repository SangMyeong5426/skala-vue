<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)

// [커스터마이징] 속성 '이름'까지 변수로 바인딩하는 동적 인자(Dynamic Argument) 실습
// :[변수명] 형태로 쓰면 어떤 속성에 값을 넣을지도 런타임에 결정할 수 있다
const attrName = ref('href')
const attrValue = 'https://vuejs.org'
const toggleAttrName = () => {
  attrName.value = attrName.value === 'href' ? 'title' : 'href'
}
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 기본 (축약형: 콜론)</h2>
    <h3>1) 동적 링크 연결</h3>
    <a :href="dynamicUrl">여기를 클릭하면 네이버로 이동합니다</a>
    <br />

    <h3>2) 동적 이미지 연결</h3>
    <img :src="logoImgSrc" alt="Vue 로고" style="width: 100px" />
    <br />

    <h3>3) 버튼 비활성화 제어</h3>
    <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>&nbsp;
    <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
    <br />

    <!-- [커스터마이징] 동적 속성명 바인딩 -->
    <h3>4) 동적 속성명 바인딩 (심화)</h3>
    <p>
      현재 바인딩 대상 속성: <strong>{{ attrName }}</strong>
    </p>
    <a :[attrName]="attrValue">
      href일 때는 링크로 이동하고, title일 때는 마우스를 올려야 툴팁이 뜹니다
    </a>
    <br />
    <button @click="toggleAttrName">속성 이름 전환 (href ↔ title)</button>
  </div>
</template>

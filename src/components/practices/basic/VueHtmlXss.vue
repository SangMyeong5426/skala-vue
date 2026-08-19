<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
  message.value = inputValue.value
}

// [커스터마이징] 매번 직접 타이핑하지 않도록 공격 샘플을 한 번에 채워 넣는다
const attackSample = `<img src="x" onerror="alert('XSS 공격이 실행되었습니다!')" />`
const fillAttackSample = () => {
  inputValue.value = attackSample
}

// [커스터마이징] 안전 모드 스위치 - 켜면 v-html 대신 텍스트 보간으로 출력해 공격을 무력화
const isSafeMode = ref(false)
</script>

<template>
  <div class="practice-section">
    <h2>v-html XSS 학습</h2>
    <input v-model="inputValue" placeholder="내용을 입력하세요" />
    <button @click="showMessage">확인</button>
    &nbsp;
    <!-- [커스터마이징] 공격 샘플 자동 입력 -->
    <button @click="fillAttackSample">공격 샘플 채우기</button>

    <!-- [커스터마이징] 안전 모드 토글 -->
    <p>
      <label>
        <input type="checkbox" v-model="isSafeMode" />
        안전 모드 (체크하면 v-html 대신 텍스트로 출력)
      </label>
    </p>

    <h3>출력 결과</h3>
    <div v-if="isSafeMode">{{ message }}</div>
    <div v-else v-html="message"></div>
  </div>
</template>

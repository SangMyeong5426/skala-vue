<script setup>
import { ref } from 'vue'

const isWarning = ref(false) // 객체 바인딩용 스위치
const themeClass = ref('bg-dark') // 배열 바인딩용 고정 클래스

// [커스터마이징] 정적 class와 동적 :class를 함께 쓰는 '조합' 패턴 실습용 상태
// 세 단계(안전/주의/위험)를 순환시키며 클래스만 갈아 끼운다
const levels = ['safe', 'caution', 'danger']
const levelLabels = { safe: '안전', caution: '주의', danger: '위험' }
const levelIndex = ref(0)
const nextLevel = () => {
  levelIndex.value = (levelIndex.value + 1) % levels.length
}
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (클래스 바인딩)</h2>
    <h3>클래스 바인딩 (객체 형식)</h3>
    <p :class="{ 'text-danger': isWarning }">현재 경고 상태: {{ isWarning }}</p>
    <button @click="isWarning = !isWarning">경고 상태 토글</button>
    <br />
    <h3>클래스 바인딩 (배열 형식)</h3>
    <div :class="[themeClass, isWarning ? 'border-red' : 'border-gray']">
      다중 클래스가 조립된 박스 구역입니다.
    </div>
    <br />

    <!-- [커스터마이징] 정적 class(base-chip)는 항상 유지되고, 동적 :class만 교체된다 -->
    <h3>클래스 바인딩 (정적 + 동적 조합)</h3>
    <p class="base-chip" :class="levels[levelIndex]">
      현재 단계: {{ levelLabels[levels[levelIndex]] }}
    </p>
    <button @click="nextLevel">다음 단계로 전환</button>
  </div>
</template>

<style scoped>
.text-danger {
  color: red;
  font-weight: bold;
}
.bg-dark {
  background-color: #333;
  color: white;
  padding: 15px;
}
.border-red {
  border: 3px solid red;
}
.border-gray {
  border: 3px solid #ccc;
}
/* [커스터마이징] 정적 클래스 + 단계별 동적 클래스 */
.base-chip {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  color: #fff;
  font-weight: bold;
}
.safe {
  background-color: #00b894;
}
.caution {
  background-color: #fdcb6e;
  color: #2d3436;
}
.danger {
  background-color: #d63031;
}
</style>

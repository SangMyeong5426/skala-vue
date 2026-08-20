<script setup>
// 종합과제 1·2 통합: 날씨 대시보드
// - Hands on 1 (자료 p.116): v-for 목록 / v-if 라벨 / :value·@input 검색 / 이벤트 수식어
// - Hands on 2 (자료 p.145): computed 필터 / watch·watchEffect 감시
import WeatherDashboard from '@/components/exercise/WeatherDashboard.vue'
</script>

<template>
  <div class="app-container">
    <h1>🌤️ 종합과제: 날씨 대시보드</h1>
    <hr />
    <WeatherDashboard />
  </div>
</template>

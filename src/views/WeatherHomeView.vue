<script setup>
// 종합과제 1: 날씨 Mockup (자료 p.116)
import WeatherMockup from '@/components/exercise/WeatherMockup.vue'
// 종합과제 2: 날씨 Composition (자료 p.145)
import WeatherComposition from '@/components/exercise/WeatherComposition.vue'
</script>

<template>
  <div class="app-container">
    <h1>🌤️ 과제 1: 날씨 (Mockup)</h1>
    <hr />
    <WeatherMockup />

    <h1>🌤️ 과제 2: 날씨 (컴포지션)</h1>
    <hr />
    <WeatherComposition />
  </div>
</template>

<script setup>
// [요구사항 1] Catch-all Route가 가리키는 화면
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>

      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>주소가 잘못되었거나,<br />삭제된 페이지입니다.</p>

      <p class="requested-path">
        요청한 주소: <code>{{ route.fullPath }}</code>
      </p>

      <button class="home-button" @click="goHome">대시보드로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  width: 100%;
  padding: 50px 0;
  text-align: center;
}
.error-icon {
  font-size: 4.4rem;
  margin-bottom: 18px;
}
h2 {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: var(--ink);
  margin-bottom: 12px;
}
p {
  font-size: 13.5px;
  color: var(--ink-soft);
  line-height: 1.7;
  margin-bottom: 18px;
}
.requested-path {
  font-size: 12.5px;
  margin-bottom: 28px;
  color: var(--ink-mute);
}
.requested-path code {
  background: rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(0, 0, 0, 0.16);
  padding: 3px 9px;
  border-radius: 7px;
  color: var(--grade-danger);
}
.home-button {
  padding: 11px 26px;
  border: none;
  border-radius: 999px;
  background: #18181b;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: transform 0.18s var(--ease);
}
.home-button:hover {
  transform: translateY(-2px);
}
</style>

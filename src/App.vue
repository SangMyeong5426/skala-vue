<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- 상단 내비게이션 바: RouterLink가 <a> 태그로 변환되지만
       브라우저 새로고침 없이 주소만 바꾸고 RouterView 영역을 교체한다 -->
  <nav class="navigation-bar">
    <RouterLink to="/" class="nav-item">🌤️ 종합과제</RouterLink>
    <span class="divider">|</span>
    <RouterLink to="/practices" class="nav-item">📚 단원별 실습</RouterLink>
  </nav>

  <!-- 현재 URL에 매칭된 페이지 컴포넌트가 이 자리에 렌더링된다 -->
  <RouterView />
</template>

<style>
@import '@/assets/exercise.css';
@import '@/assets/practice.css';
</style>

import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

/**
 * 현재는 App.vue에서 화면을 직접 렌더링하므로(<RouterView /> 미사용)
 * 아래 라우트는 대기 상태이다.
 * 4일차 Vue Router 단원에서 내비게이션 바 + <RouterView /> 구조로 재구성하면서
 * 상세 페이지(/weather/:cityId), 소개 페이지, Catch-all Route를 추가한다.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeatherHomeView,
    },
  ],
})

export default router

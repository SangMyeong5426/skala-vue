import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 종합과제 화면 (첫 진입 페이지이므로 정적 import)
      path: '/',
      name: 'home',
      component: WeatherHomeView,
    },
    {
      // 단원별 실습 화면
      // 컴포넌트가 27개나 묶여 있어 초기 로딩에 부담이 되므로
      // 동적 import(Lazy Loading)로 이 경로에 진입할 때만 내려받는다
      path: '/practices',
      name: 'practices',
      component: () => import('../views/PracticeView.vue'),
    },
  ],
})

export default router

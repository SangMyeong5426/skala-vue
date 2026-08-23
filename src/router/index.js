import { createRouter, createWebHistory } from 'vue-router'
import WeatherAboutView from '@/views/WeatherAboutView.vue'
import { isKnownCity } from '@/data/cities'

/**
 * Vue Router 설정
 *  - 첫 화면(/ = 소개)만 정적 import: 진입 즉시 필요하므로 지연 로딩 이점이 없다.
 *  - 나머지는 지연 로딩(Lazy Loading): 방문하는 순간 별도 청크로 내려받는다.
 *  - Catch-all Route는 반드시 목록 맨 마지막에 둔다. 위에 두면 모든 경로를 삼켜 버린다.
 */
export const routes = [
  {
    path: '/',
    name: 'WeatherAbout',
    component: WeatherAboutView,
    meta: { title: '서비스 소개' },
  },
  {
    path: '/dashboard',
    name: 'WeatherHome',
    component: () => import('@/views/WeatherHomeView.vue'),
    meta: { title: '모기 대시보드' },
  },
  {
    // Redirect — 이전 주소로 들어와도 첫 화면으로 보낸다
    path: '/about',
    redirect: '/',
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/WeatherDetailView.vue'),
    meta: { title: '지역 상세' },
    beforeEnter: (to) => {
      if (!isKnownCity(to.params.cityId)) {
        console.warn(`🚧 [beforeEnter] 등록되지 않은 도시 코드: ${to.params.cityId}`)
        return { name: 'NotFound', params: { pathMatch: to.path.slice(1).split('/') } }
      }
      return true
    },
  },
  {
    // 도시별 모기활동지수를 한 화면에서 비교하는 랭킹 화면
    path: '/mosquito',
    name: 'WeatherMosquito',
    component: () => import('@/views/WeatherMosquitoView.vue'),
    meta: { title: '모기활동지수' },
  },
  {
    // Catch-all Route — 정의되지 않은 모든 경로
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지 없음' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? '날씨'} · SKALA Weather`
})

export default router

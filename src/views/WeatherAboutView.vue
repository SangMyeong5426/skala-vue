<script setup>
import { useRouter } from 'vue-router'
import { TEMP_CURVE, MOSQUITO_GRADES } from '@/components/exercise/mosquitoScore'
import mosquitoIcon from '@/assets/mosquito.png'

const router = useRouter()

const gradeLegend = [...MOSQUITO_GRADES].reverse()

const DISEASES = [
  {
    name: '말라리아',
    where: '국내 발생',
    desc: '얼룩날개모기가 옮깁니다. 발열과 오한이 주기적으로 반복됩니다.',
  },
  {
    name: '일본뇌염',
    where: '국내 발생',
    desc: '작은빨간집모기가 옮깁니다. 드물지만 뇌염으로 이어지면 치명적입니다.',
  },
  {
    name: '뎅기열',
    where: '해외 유입',
    desc: '흰줄숲모기가 옮깁니다. 고열·두통·발진·근육통을 일으킵니다.',
  },
  {
    name: '지카바이러스',
    where: '해외 유입',
    desc: '임신부가 감염되면 태아에게 영향을 줄 수 있습니다.',
  },
  {
    name: '치쿤구니야열',
    where: '해외 유입',
    desc: '심한 관절통이 특징이며 몇 달간 이어지기도 합니다.',
  },
]

const PREVENTIONS = [
  { icon: '👕', text: '야외 활동 시 긴 옷을 입고 모기 기피제를 사용하세요' },
  { icon: '🪣', text: '집 주변에 물이 고인 곳을 없애세요 — 모기의 산란지입니다' },
  { icon: '🪟', text: '방충망에 구멍이 없는지 확인하세요' },
  { icon: '🌿', text: '풀숲·덤불처럼 모기가 많은 곳에서의 활동을 줄이세요' },
  { icon: '🧴', text: '향이 짙은 향수·화장품은 모기를 부릅니다' },
]

const FACTORS = [
  {
    icon: '🌡️',
    name: '기온',
    weight: 50,
    basis:
      '28℃ 안팎에서 가장 활발하고, 32℃ 이상이면 여름잠에 들어 활동이 줄어듭니다. 15℃ 이하에서는 겨울잠에 듭니다.',
  },
  {
    icon: '💧',
    name: '습도',
    weight: 30,
    basis:
      '60~80%가 최적이며 60% 이상이면 활동이 활발해집니다. 건조하면 활동이 억제되고 수명이 짧아집니다.',
  },
  {
    icon: '🍃',
    name: '바람',
    weight: 20,
    basis:
      '모기의 비행 속도가 1~3 mph(0.45~1.3m/s)라 그보다 센 바람은 이기지 못합니다. 2.2m/s에서 비행 중단이 관측됩니다.',
  },
]

const SOURCES = [
  {
    label: '서울시 모기예보제 — 오늘의 모기예보',
    url: 'https://news.seoul.go.kr/welfare/today_mosquito',
  },
  {
    label: '서울시 모기예보제 정보 — 서울 열린데이터광장',
    url: 'https://data.seoul.go.kr/dataList/OA-13285/S/1/datasetView.do',
  },
  {
    label: '[날씨학개론] 기온과 강수량, 그리고 모기 — YTN 사이언스',
    url: 'https://m.science.ytn.co.kr/program/view.php?mcd=0082&key=202007281646178002',
  },
  {
    label: 'Can Mosquitoes Fly in Wind and at What Speed? — Biology Insights',
    url: 'https://biologyinsights.com/can-mosquitoes-fly-in-wind-and-at-what-speed/',
  },
  {
    label: '해외유입 모기매개감염병 예방수칙 — 서울특별시',
    url: 'https://news.seoul.go.kr/welfare/archives/572374',
  },
  {
    label: '말라리아·뎅기열 매개 모기 조기 출현 — 서울시 보건환경연구원',
    url: 'https://sihe.seoul.go.kr/archives/557743',
  },
  { label: 'OpenWeather API', url: 'https://openweathermap.org/api' },
]

const LIMITS = [
  '서울시는 실제 채집 개체 수(DMS 장비)를 쓰지만 이 앱은 쓸 수 없습니다. 따라서 이 지수는 "모기가 활동하기 좋은 조건인가"이지 실제 개체 수 예측이 아닙니다.',
  '서울시가 사용하는 일 강수량을 이 앱은 아직 반영하지 않습니다.',
  '바람은 서울시 지수에 없는 항목으로, 곤충학 자료를 근거로 이 앱이 추가한 것입니다.',
  '서울시 모기예보제는 5월 1일~10월 31일에만 측정합니다. 겨울에는 지수 자체의 의미가 크지 않습니다.',
]
</script>

<template>
  <div class="about-wrapper">
    <header class="about-head">
      <h2 class="about-title"><img class="title-icon" :src="mosquitoIcon" alt="" />서비스 소개</h2>
      <p class="about-sub">
        <strong>모기활동지수</strong>는 서울시 모기예보제가 쓰는 이름입니다. 이 앱이 그 숫자를
        어떻게 계산하는지, 근거는 무엇인지 정리했습니다.
      </p>
      <el-button type="primary" round @click="router.push('/dashboard')">
        도시별 모기활동지수 보러 가기 →
      </el-button>
    </header>

    <section class="block two-col">
      <h3 class="block-title area-title-a">모기는 왜 위험한가요</h3>
      <p class="block-text area-text-a">
        모기는 단순히 성가신 벌레가 아니라 <strong>감염병을 옮기는 매개체</strong>입니다. 국내에서는
        말라리아와 일본뇌염이 발생하고, 뎅기열·지카바이러스·치쿤구니야열은 해외에서 유입됩니다.
        서울시가 2014년부터 모기예보제를 운영하는 이유입니다.
      </p>
      <ul class="disease-list area-list-a">
        <li v-for="d in DISEASES" :key="d.name" class="disease">
          <span class="disease-name">{{ d.name }}</span>
          <span class="disease-where" :class="{ domestic: d.where === '국내 발생' }">
            {{ d.where }}
          </span>
          <span class="disease-desc">{{ d.desc }}</span>
        </li>
      </ul>

      <h3 class="block-title area-title-b">예방 수칙</h3>
      <p class="block-text area-text-b">서울시가 안내하는 생활 속 모기 예방 요령입니다.</p>
      <ul class="prevent-list area-list-b">
        <li v-for="(p, i) in PREVENTIONS" :key="i" class="prevent">
          <span class="prevent-icon">{{ p.icon }}</span>
          <span>{{ p.text }}</span>
        </li>
      </ul>
    </section>

    <section class="block">
      <h3 class="block-title">어떻게 계산하나요</h3>
      <div class="factor-grid">
        <article v-for="f in FACTORS" :key="f.name" class="factor">
          <div class="factor-head">
            <span class="factor-name">{{ f.icon }} {{ f.name }}</span>
            <span class="factor-weight">{{ f.weight }}점</span>
          </div>
          <div class="factor-track">
            <div class="factor-fill" :style="{ width: f.weight + '%' }"></div>
          </div>
          <p class="factor-basis">{{ f.basis }}</p>
        </article>
      </div>
    </section>

    <section class="block two-col">
      <div>
        <h3 class="block-title">왜 더울수록 나쁜 게 아닌가요</h3>
        <p class="block-text">
          모기는 26~30℃에서 가장 활발하고 그보다 더우면 오히려 활동이 줄어듭니다. 점수가 올라갔다
          내려오는 <strong>산 모양</strong>이라 단순 증가 함수로는 표현할 수 없습니다. 서울시
          모기예보제도 산출식에 온도·습도의 <strong>제곱항</strong>을 써서 같은 형태를 만듭니다.
        </p>
        <ul class="curve">
          <li v-for="p in TEMP_CURVE" :key="p.temp" class="curve-item">
            <span class="curve-bar" :style="{ height: Math.max(p.score, 2) * 1.8 + 'px' }"></span>
            <span class="curve-label">{{ p.temp }}</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="block-title">단계 기준</h3>
        <p class="block-text">
          이름뿐 아니라 단계도 서울시 모기예보제를 따릅니다. 같은 4단계 · 같은 경계(25 / 50 / 75)를
          씁니다.
        </p>
        <div class="grade-list">
          <div v-for="g in gradeLegend" :key="g.step" class="grade" :class="g.tone">
            <span class="grade-step">{{ g.step }}단계 {{ g.label }}</span>
            <span class="grade-range">{{ g.min }}점~</span>
            <span class="grade-action">{{ g.action }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="block two-col">
      <div>
        <h3 class="block-title">알아 두실 점</h3>
        <ul class="plain-list">
          <li v-for="(l, i) in LIMITS" :key="i">{{ l }}</li>
        </ul>
      </div>
      <div>
        <h3 class="block-title">근거 · 출처</h3>
        <ul class="plain-list">
          <li v-for="s in SOURCES" :key="s.url">
            <a :href="s.url" target="_blank" rel="noopener">{{ s.label }}</a>
          </li>
        </ul>
      </div>
    </section>

    <section class="back-row">
      <el-button type="primary" size="large" round @click="router.push('/dashboard')">
        도시별 모기활동지수 보러 가기 →
      </el-button>
    </section>
  </div>
</template>

<style scoped>
.about-wrapper {
  width: 100%;
}
.about-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 20px;
  padding-bottom: 18px;
  margin-bottom: 4px;
}
.about-head .el-button {
  margin-left: auto;
}
.title-icon {
  width: 1.05em;
  height: 1.05em;
  vertical-align: -0.16em;
  margin-right: 8px;
  object-fit: contain;
}
.about-title {
  width: 100%;
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: var(--ink);
}
.about-sub {
  margin: 0;
  font-size: 14px;
  color: var(--ink-soft);
}
.back-row {
  padding: 26px 0 8px;
  border-top: 1px solid var(--glass-line);
}

.block {
  padding: 26px 0;
  border-top: 1px solid var(--glass-line);
}
.block-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: var(--ink);
}
.block-text {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--ink-soft);
}
.block-text strong {
  color: var(--ink);
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'title-a title-b'
    'text-a text-b'
    'list-a list-b';
  column-gap: 36px;
}
.area-title-a {
  grid-area: title-a;
}
.area-text-a {
  grid-area: text-a;
}
.area-list-a {
  grid-area: list-a;
}
.area-title-b {
  grid-area: title-b;
}
.area-text-b {
  grid-area: text-b;
}
.area-list-b {
  grid-area: list-b;
}

.disease-list,
.prevent-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.disease {
  display: grid;
  grid-template-columns: 88px 62px 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius-sm);
  font-size: 12.5px;
}
.disease-name {
  font-weight: 700;
  color: var(--ink);
}
.disease-where {
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-mute);
  text-align: center;
}
.disease-where.domestic {
  background: var(--grade-danger);
  color: #fff;
}
.disease-desc {
  color: var(--ink-soft);
  line-height: 1.6;
}
.prevent {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 13px;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.6;
}
.prevent-icon {
  font-size: 16px;
  line-height: 1.4;
}

.factor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.factor {
  padding: 16px 18px;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.022);
}
.factor-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.factor-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}
.factor-weight {
  font-weight: 800;
  font-size: 13px;
  color: var(--grade-soft);
}
.factor-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 10px;
}
.factor-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}
.factor-basis {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-mute);
}

.curve {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  margin: 0;
  padding: 18px 16px 12px;
  list-style: none;
  border: 1px solid var(--glass-line);
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.016);
}
.curve-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.curve-bar {
  width: 100%;
  max-width: 30px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #2563eb, #93c5fd);
}
.curve-label {
  font-size: 10.5px;
  color: var(--ink-mute);
}

.grade-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.grade {
  display: grid;
  grid-template-columns: 92px 54px 1fr;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  border-left: 4px solid;
  background: rgba(0, 0, 0, 0.022);
  font-size: 12px;
}
.grade-step {
  font-weight: 800;
}
.grade-range {
  color: var(--ink-mute);
  font-variant-numeric: tabular-nums;
}
.grade-action {
  color: var(--ink-soft);
}
.grade.ok {
  border-left-color: var(--grade-ok);
}
.grade.soft {
  border-left-color: var(--grade-soft);
}
.grade.warn {
  border-left-color: var(--grade-warn);
}
.grade.danger {
  border-left-color: var(--grade-danger);
}
.grade.ok .grade-step {
  color: var(--grade-ok);
}
.grade.soft .grade-step {
  color: var(--grade-soft);
}
.grade.warn .grade-step {
  color: var(--grade-warn);
}
.grade.danger .grade-step {
  color: var(--grade-danger);
}

.plain-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--ink-mute);
}
.plain-list li {
  margin-bottom: 6px;
}
.plain-list a {
  color: var(--grade-soft);
  text-decoration: none;
}
.plain-list a:hover {
  text-decoration: underline;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 30px;
  padding: 26px 30px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.022));
  border: 1px solid var(--glass-line-strong);
}
.cta-text {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

@media (max-width: 900px) {
  .hero,
  .two-col,
  .factor-grid {
    grid-template-columns: 1fr;
  }
  .two-col {
    grid-template-areas:
      'title-a'
      'text-a'
      'list-a'
      'title-b'
      'text-b'
      'list-b';
  }
  .area-title-b {
    margin-top: 26px;
  }
  .hero-title {
    font-size: 2rem;
  }
}
</style>

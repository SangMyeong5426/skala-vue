# skala-vue

SKALA Full-Stack Engineering — **Frontend framework: Vue.js** 과정 실습 저장소입니다.

Vue 3 (Composition API) + Vite 기반이며, 단원별 실습 컴포넌트를 `App.vue`에 조립해
한 화면에서 확인하는 구조입니다.

- **개발자**: 박상명
- **원본 과정 자료**: https://github.com/bottletiger/skala-vue

## 기술 스택

| 구분       | 사용 기술                                   |
| ---------- | ------------------------------------------- |
| 프레임워크 | Vue 3.5 (Composition API, `<script setup>`) |
| 빌드 도구  | Vite 8                                      |
| 라우팅     | Vue Router 5                                |
| 상태 관리  | Pinia 3                                     |
| 코드 품질  | ESLint 10 + Oxlint + Prettier               |

## 실행 방법

```sh
npm install       # 의존성 설치
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 프로덕션 빌드 → dist/
npm run lint      # Oxlint + ESLint 정적 검사
npm run format    # Prettier 코드 포맷팅
```

## 프로젝트 구조

```
src/
├── main.js                       # 앱 진입점 (Pinia, Router 등록)
├── App.vue                       # 루트 컴포넌트 — 실습 컴포넌트 조립
├── assets/
│   ├── practice.css              # 단원별 실습 공통 스타일
│   └── exercise.css              # 종합과제 공통 스타일
├── components/
│   ├── exercise/                 # 종합과제 컴포넌트
│   └── practices/
│       └── basic/                # 단원별 실습 컴포넌트
├── router/                       # 라우팅 정의
├── stores/                       # Pinia 스토어
└── views/                        # 페이지 단위 컴포넌트
```

## 실습 진행 현황

### 1. 학습환경구성

| 컴포넌트        | 학습 내용                              |
| --------------- | -------------------------------------- |
| `SampleOne.vue` | 반응형 데이터(`ref`) vs 일반 변수 비교 |
| `SampleTwo.vue` | Text Interpolation과 JavaScript 표현식 |

### 2. Vue Directive

| 컴포넌트               | 학습 내용                                        |
| ---------------------- | ------------------------------------------------ |
| `VueHtml.vue`          | `v-html` — 문자열을 실제 HTML로 렌더링           |
| `VueHtmlXss.vue`       | `v-html`의 XSS 취약점 재현                       |
| `VueText.vue`          | `v-text` — `innerText` 방식 출력                 |
| `VueBind.vue`          | `v-bind` 기본 (`:href`, `:src`, `:disabled`)     |
| `VueBindClass.vue`     | 클래스 바인딩 (객체 / 배열 구문)                 |
| `VueBindStyle.vue`     | 인라인 스타일 바인딩 (객체 / 배열 구문)          |
| `VueBindShorthand.vue` | Vue 3.4+ same-name shorthand (`:src`)            |
| `VueIf.vue`            | `v-if` / `v-else-if` / `v-else` 조건부 렌더링    |
| `VueShow.vue`          | `v-show` — `display: none` 기반 표시 토글        |
| `VueFor.vue`           | `v-for` — 배열 / 객체 / 배열 내 객체 반복 렌더링 |
| `VuePre.vue`           | `v-pre` — 템플릿 컴파일 생략                     |
| `VueCloak.vue`         | `v-cloak` — 렌더링 전 템플릿 노출 방지           |
| `VueOnce.vue`          | `v-once` — 최초 1회만 렌더링                     |
| `VueMemo.vue`          | `v-memo` — 의존성 기반 렌더링 캐싱               |

### 3. Vue Event Handling

| 컴포넌트            | 학습 내용                                 |
| ------------------- | ----------------------------------------- |
| `EventBasic.vue`    | `v-on`(`@`) 인라인 핸들러 / 메서드 핸들러 |
| `EventObject.vue`   | 이벤트 객체(`$event`) 수신 패턴 2가지     |
| `EventModifier.vue` | 이벤트 수식어 `.prevent`, `.stop`         |

### 4. Vue Form Handling

| 컴포넌트            | 학습 내용                                                   |
| ------------------- | ----------------------------------------------------------- |
| `ModelBasic.vue`    | `v-model` 양방향 바인딩과 내부 동작 원리                    |
| `ModelForm.vue`     | Form 요소별 `v-model` 매핑 (textarea/checkbox/radio/select) |
| `ModelModifier.vue` | `v-model` 수식어 `.lazy`, `.number`, `.trim` 및 체이닝      |

### 5. Vue Style

| 컴포넌트          | 학습 내용                                       |
| ----------------- | ----------------------------------------------- |
| `StyleScoped.vue` | `<style scoped>` 적용 범위와 외부 CSS `@import` |

### 종합과제

| 과제                        | 컴포넌트                     | 구현 내용                                                                                                                                                                                                          |
| --------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hands on 1 — Weather Mockup | `exercise/WeatherMockup.vue` | `v-for` 날씨 카드 목록(`:key` 고유 id) / `v-if` 기온 25도 기준 라벨 분기 / `:value`+`@input` 한글 즉시 동기화 검색 / 카드 클릭 상태바 갱신 및 `@click.stop` 버블링 차단 / **대기질 현황·주간 예보 블록 자체 추가** |

## 개인 Customization 내역

과정 자료의 기본 예제에서 추가·변경한 내용을 기록합니다.

| 단원             | 대상                   | 변경 내용                                                                                                                                                                                  |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. 학습환경구성  | `SampleOne.vue`        | 일반 변수의 **실제 값을 alert로 확인**하는 버튼과 **동시 초기화 버튼** 추가 — 화면에 그려진 값과 메모리 값이 다르다는 점, 리렌더링이 일어나면 밀려 있던 값이 한꺼번에 반영된다는 점을 검증 |
| 1. 학습환경구성  | `SampleTwo.vue`        | 보간법 안에서 쓸 수 있는 **표현식 예제 3종 추가** (단어 수 계산, 문자열 뒤집기, 삼항 연산자)                                                                                               |
| 2. Vue Directive | `VueHtml.vue`          | 인라인 태그뿐 아니라 **`<ul>` 블록 구조 주입 예제** 추가                                                                                                                                   |
| 2. Vue Directive | `VueHtmlXss.vue`       | **공격 샘플 자동 입력 버튼**과 **안전 모드 토글** 추가 — 같은 입력을 `v-html` 대신 텍스트 보간으로 출력하면 XSS가 무력화됨을 비교                                                          |
| 2. Vue Directive | `VueText.vue`          | **보간법 vs `v-text` 비교 예제** 추가 — `v-text`는 요소 내용을 통째로 교체하므로 다른 텍스트와 섞어 쓸 수 없음을 확인                                                                      |
| 2. Vue Directive | `VueBind.vue`          | **동적 속성명(Dynamic Argument) `:[attrName]` 예제** 추가 — 속성 이름 자체를 런타임에 `href` ↔ `title`로 전환                                                                              |
| 2. Vue Directive | `VueBindClass.vue`     | **정적 class + 동적 `:class` 조합 패턴** 추가 — 안전/주의/위험 3단계를 순환시키며 동적 클래스만 교체                                                                                       |
| 2. Vue Directive | `VueBindStyle.vue`     | **`range` 슬라이더와 `color` 피커**로 글자 크기·배경색을 실시간 제어하는 예제 추가 (`v-model.number` 활용)                                                                                 |
| 2. Vue Directive | `VueBindShorthand.vue` | same-name shorthand 적용 대상을 **`alt`, `title`, `href`까지 확장**                                                                                                                        |
| 2. Vue Directive | `VueIf.vue`            | 성적 등급 분기에 **A+ 학점(95점 이상)** 조건을 추가하여 `v-else-if` 체인을 4단계 → 5단계로 확장                                                                                            |
| Hands on 1       | `WeatherMockup.vue`    | 기본 3개 도시에 **대전·제주 추가**(v-if 양쪽 분기가 모두 걸리도록 기온 배치)                                                                                                               |
| Hands on 1       | `WeatherMockup.vue`    | 데이터에 **`humidity`(습도) 필드** 확장 및 카드에 표시                                                                                                                                     |
| Hands on 1       | `WeatherMockup.vue`    | **날씨 상태 → 이모지 아이콘 매핑 객체**(`weatherIcons`)로 카드 가독성 개선                                                                                                                 |
| Hands on 1       | `WeatherMockup.vue`    | **선택된 카드 하이라이트** — 2단원에서 학습한 `:class` 객체 구문 재활용                                                                                                                    |
| Hands on 1       | `WeatherMockup.vue`    | 검색어 미입력 시 안내 문구를 `v-if`/`v-else`로 분기                                                                                                                                        |
| Hands on 1       | `WeatherMockup.vue`    | **[Mockup 추가] 대기질 현황 블록** — `pm10` 필드를 확장하고 환경부 기준 4단계(`좋음`/`보통`/`나쁨`/`매우 나쁨`)를 `v-if`~`v-else-if`~`v-else` 체인으로 분기                                |
| Hands on 1       | `WeatherMockup.vue`    | **[Mockup 추가] 주간 예보 블록** — 도시별 `forecast` 배열을 확장하고 **중첩 `v-for`**(도시 → 요일)로 렌더링. 카드 선택 상태와 연동해 선택된 도시의 5일 예보만 노출                         |
| Hands on 1       | `WeatherMockup.vue`    | **상태바 조사 자동 판별** — 한글 음절 코드의 받침 유무를 계산해 `이`/`가`를 선택 (서울**이** / 제주**가**)                                                                                 |

## 배포

> 배포 완료 후 URL을 기재합니다.

## 라이선스 및 출처

본 저장소는 SKALA 교육 과정 실습 목적으로 작성되었습니다.
교육 자료의 저작권은 SK주식회사 AX에 있습니다.

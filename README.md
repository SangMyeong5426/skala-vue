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
├── App.vue                       # 루트 컴포넌트 — 내비게이션 바 + RouterView
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
    ├── WeatherHomeView.vue       # 종합과제 화면
    └── PracticeView.vue          # 단원별 실습 화면
```

> `src/App.vue.exercise`, `src/App.vue.practice`는 화면 전환용 보관본입니다. (아래 참조)

## 화면 구성

종합과제와 단원별 실습을 별도 화면으로 분리하고, `App.vue`를 교체해 전환합니다.

| 파일                   | 화면                                    | 상태      |
| ---------------------- | --------------------------------------- | --------- |
| `src/App.vue`          | 현재 활성 화면                          | 빌드 대상 |
| `src/App.vue.exercise` | 🌤️ 종합과제 (Weather Mockup)            | 보관본    |
| `src/App.vue.practice` | 📚 단원별 실습 (1~6단원, 29개 컴포넌트) | 보관본    |

```sh
# 실습 화면으로 전환
cp src/App.vue.practice src/App.vue

# 과제 화면으로 전환
cp src/App.vue.exercise src/App.vue
```

확장자가 `.vue`가 아닌 파일은 Vite 빌드와 ESLint 검사 대상에서 제외되므로,
보관본은 활성 화면에 영향을 주지 않습니다.
각 화면의 실제 내용은 `views/WeatherHomeView.vue`, `views/PracticeView.vue`에 있고
`App.vue`는 둘 중 하나를 렌더링하는 역할만 합니다.

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

### 6. Composition API — Computed & Watchers

| 컴포넌트                  | 학습 내용                                             |
| ------------------------- | ----------------------------------------------------- |
| `ComputedBasic.vue`       | `computed()` 캐싱 동작과 일반 함수의 재실행 차이      |
| `WatchersBasic.vue`       | `watch()` 기본 감시와 콜백의 신·구 값 수신            |
| `WatchersMulti.vue`       | Multi-Source Watch — 배열로 여러 소스 동시 감시       |
| `WatchersDeep.vue`        | Deep Watch — `ref` 객체 내부 속성 감시와 `deep: true` |
| `WatchersReactive.vue`    | `reactive()` 데이터 감시 규칙과 특정 속성 타겟 감시   |
| `WatchersWatchEffect.vue` | `watchEffect()` 자동 의존성 추적과 즉시 실행          |

### 종합과제

| 과제                             | 컴포넌트                          | 구현 내용                                                                                                                                                                                                          |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hands on 1 — Weather Mockup      | `exercise/WeatherMockup.vue`      | `v-for` 날씨 카드 목록(`:key` 고유 id) / `v-if` 기온 25도 기준 라벨 분기 / `:value`+`@input` 한글 즉시 동기화 검색 / 카드 클릭 상태바 갱신 및 `@click.stop` 버블링 차단 / **대기질 현황·주간 예보 블록 자체 추가** |
| Hands on 2 — Weather Composition | `exercise/WeatherComposition.vue` | `computed`로 검색어 필터(`filteredWeatherList`) / `watch`로 상태바 문구 감시 / `watchEffect`로 검색어 자동 추적 / 검색 결과 없음 안내 분기                                                                         |

## 개인 Customization 내역

과정 자료의 기본 예제에서 추가·변경한 내용을 기록합니다.

| 단원               | 대상                      | 변경 내용                                                                                                                                                                                  |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. 학습환경구성    | `SampleOne.vue`           | 일반 변수의 **실제 값을 alert로 확인**하는 버튼과 **동시 초기화 버튼** 추가 — 화면에 그려진 값과 메모리 값이 다르다는 점, 리렌더링이 일어나면 밀려 있던 값이 한꺼번에 반영된다는 점을 검증 |
| 1. 학습환경구성    | `SampleTwo.vue`           | 보간법 안에서 쓸 수 있는 **표현식 예제 3종 추가** (단어 수 계산, 문자열 뒤집기, 삼항 연산자)                                                                                               |
| 2. Vue Directive   | `VueHtml.vue`             | 인라인 태그뿐 아니라 **`<ul>` 블록 구조 주입 예제** 추가                                                                                                                                   |
| 2. Vue Directive   | `VueHtmlXss.vue`          | **공격 샘플 자동 입력 버튼**과 **안전 모드 토글** 추가 — 같은 입력을 `v-html` 대신 텍스트 보간으로 출력하면 XSS가 무력화됨을 비교                                                          |
| 2. Vue Directive   | `VueText.vue`             | **보간법 vs `v-text` 비교 예제** 추가 — `v-text`는 요소 내용을 통째로 교체하므로 다른 텍스트와 섞어 쓸 수 없음을 확인                                                                      |
| 2. Vue Directive   | `VueBind.vue`             | **동적 속성명(Dynamic Argument) `:[attrName]` 예제** 추가 — 속성 이름 자체를 런타임에 `href` ↔ `title`로 전환                                                                              |
| 2. Vue Directive   | `VueBindClass.vue`        | **정적 class + 동적 `:class` 조합 패턴** 추가 — 안전/주의/위험 3단계를 순환시키며 동적 클래스만 교체                                                                                       |
| 2. Vue Directive   | `VueBindStyle.vue`        | **`range` 슬라이더와 `color` 피커**로 글자 크기·배경색을 실시간 제어하는 예제 추가 (`v-model.number` 활용)                                                                                 |
| 2. Vue Directive   | `VueBindShorthand.vue`    | same-name shorthand 적용 대상을 **`alt`, `title`, `href`까지 확장**                                                                                                                        |
| 2. Vue Directive   | `VueIf.vue`               | 성적 등급 분기에 **A+ 학점(95점 이상)** 조건을 추가하여 `v-else-if` 체인을 4단계 → 5단계로 확장                                                                                            |
| 6. Composition API | `ComputedBasic.vue`       | **computed 체이닝**(computed가 다른 computed를 의존)과 **쓰기 가능한 computed**(`get`/`set`) 예제 추가 — `v-model`로 양방향 바인딩까지 확인                                                |
| 6. Composition API | `WatchersBasic.vue`       | **`immediate: true` 옵션**과 **감시 중지 핸들** 실습 추가 — `watch()` 반환값을 호출해 감시를 해제하고, 해제 후에도 다른 감시자는 계속 동작함을 비교                                        |
| 6. Composition API | `WatchersMulti.vue`       | **변경 원인 소스 판별**(도시/날짜 중 무엇이 바뀌었는지)과 **최근 5건 변경 이력 목록** 추가                                                                                                 |
| 6. Composition API | `WatchersDeep.vue`        | deep 감시의 **`oldValue` 함정을 화면에서 직접 검증**(`newVal === oldVal`)하고, **스냅샷 복사로 이전 상태 전체를 추적**하는 우회법 추가                                                     |
| 6. Composition API | `WatchersReactive.vue`    | **구조 분해 시 반응성 단절 비교표** 추가 — `state.price` / `const { price } = state` / `toRefs(state)` 세 방식의 갱신 여부를 나란히 확인                                                   |
| 6. Composition API | `WatchersWatchEffect.vue` | **`onCleanup` 콜백으로 디바운스 구현** — 다음 실행 직전 이전 타이머를 취소해 타이핑이 멈춘 뒤에만 요청을 보내는 실무 패턴                                                                  |
| Hands on 1         | `WeatherMockup.vue`       | 기본 3개 도시에 **대전·제주 추가**(v-if 양쪽 분기가 모두 걸리도록 기온 배치)                                                                                                               |
| Hands on 1         | `WeatherMockup.vue`       | 데이터에 **`humidity`(습도) 필드** 확장 및 카드에 표시                                                                                                                                     |
| Hands on 1         | `WeatherMockup.vue`       | **날씨 상태 → 이모지 아이콘 매핑 객체**(`weatherIcons`)로 카드 가독성 개선                                                                                                                 |
| Hands on 1         | `WeatherMockup.vue`       | **선택된 카드 하이라이트** — 2단원에서 학습한 `:class` 객체 구문 재활용                                                                                                                    |
| Hands on 1         | `WeatherMockup.vue`       | 검색어 미입력 시 안내 문구를 `v-if`/`v-else`로 분기                                                                                                                                        |
| Hands on 1         | `WeatherMockup.vue`       | **[Mockup 추가] 대기질 현황 블록** — `pm10` 필드를 확장하고 환경부 기준 4단계(`좋음`/`보통`/`나쁨`/`매우 나쁨`)를 `v-if`~`v-else-if`~`v-else` 체인으로 분기                                |
| Hands on 1         | `WeatherMockup.vue`       | **[Mockup 추가] 주간 예보 블록** — 도시별 `forecast` 배열을 확장하고 **중첩 `v-for`**(도시 → 요일)로 렌더링. 카드 선택 상태와 연동해 선택된 도시의 5일 예보만 노출                         |
| Hands on 1         | `WeatherMockup.vue`       | **상태바 조사 자동 판별** — 한글 음절 코드의 받침 유무를 계산해 `이`/`가`를 선택 (서울**이** / 제주**가**)                                                                                 |
| Hands on 2         | `WeatherComposition.vue`  | **`selectedCity` computed 도입** — 1일차에는 `template v-for` + `v-if`로 5개 도시를 훑어 선택 도시를 찾았으나, computed로 추출해 순회를 제거하고 템플릿을 단순화                           |
| Hands on 2         | `WeatherComposition.vue`  | **`weatherSummary` computed 체이닝** — `filteredWeatherList`에 의존하여 표시 건수·평균 기온·최고/최저 도시를 실시간 요약                                                                   |
| Hands on 2         | `WeatherComposition.vue`  | **최근 검색어 이력** — 추가 반응형 상태(`searchHistory`)를 두고, `filteredWeatherList`를 감시하는 `watch`에서 결과가 있는 검색어만 중복 없이 5건까지 수집. 칩을 클릭하면 재검색            |
| Hands on 2         | `WeatherComposition.vue`  | 대기질 블록도 **검색 필터 결과에 연동**하여 검색한 도시의 미세먼지만 표시                                                                                                                  |
| Hands on 2         | `WeatherComposition.vue`  | **즐겨찾기(⭐) + localStorage 영속화** — `watch`에 `deep: true`를 걸어 배열 변경 시 저장. 새로고침해도 유지되며, `watch`를 콘솔 로그가 아닌 실제 부수 효과 처리에 사용                     |
| Hands on 2         | `WeatherComposition.vue`  | **정렬 기능(기온/미세먼지/이름 + 오름·내림)** — ES2023 `toSorted()`로 구현. 일반 `sort()`는 원본 배열을 훼손하므로 `computed` 안에서 사용하면 안 된다는 점을 반영                          |
| Hands on 2         | `WeatherComposition.vue`  | **computed 3단 체이닝 구성** — `weatherList` → `filteredWeatherList`(검색) → `visibleWeatherList`(즐겨찾기·정렬) → `weatherSummary`(요약)                                                  |
| Hands on 2         | `WeatherComposition.vue`  | **빈 결과 원인 구분 안내** — 검색 불일치와 즐겨찾기 미등록을 서로 다른 문구로 분기 (요구사항 4를 기능 추가에 맞춰 정교화)                                                                  |

## 배포

> 배포 완료 후 URL을 기재합니다.

## 라이선스 및 출처

본 저장소는 SKALA 교육 과정 실습 목적으로 작성되었습니다.
교육 자료의 저작권은 SK주식회사 AX에 있습니다.

<script setup>
import { ref } from 'vue'

// 1. 상위 컴포넌트로부터 주입받을 데이터의 자료형 및 필수 여부 정의
// [커스터마이징] 자료 표(p.162)에 정리된 유효성 검사 5종을 실제로 모두 적용
const props = defineProps({
  // ① 필수 + 타입
  parentData: {
    type: String,
    required: true,
  },
  // ② 기본값 - 부모가 값을 넘기지 않으면 이 값이 쓰인다
  badgeLabel: {
    type: String,
    default: '기본 배지',
  },
  // ③ 다중 타입 허용 - 문자열도 숫자도 받는다
  level: {
    type: [String, Number],
    default: 1,
  },
  // ④ 커스텀 검증기 - 0~100 범위를 벗어나면 콘솔에 경고가 출력된다
  score: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },
})

// 2. 상위 컴포넌트로 송신할 커스텀 이벤트 식별자 등록
// [커스터마이징] 이벤트 2종 - 단순 문자열 페이로드 / 객체 페이로드
const emit = defineEmits(['update-request', 'report'])

// 3. 내부 이벤트 발생 시 페이로드를 실어 상위로 이벤트를 디스패치하는 함수
const sendNotification = () => {
  const payload = 'Child에서 가공한 새로운 데이터'
  emit('update-request', payload)
}

// [커스터마이징] 자식이 직접 입력한 값을 부모로 올려보낸다
const draft = ref('')
const sendDraft = () => {
  if (!draft.value.trim()) return
  emit('update-request', draft.value.trim())
  draft.value = ''
}

// [커스터마이징] 객체 페이로드 - emit의 두 번째 인자에는 어떤 값이든 실을 수 있다
const reportStatus = () => {
  emit('report', {
    from: 'PropsEmitsChild',
    receivedLength: props.parentData.length,
    at: new Date().toLocaleTimeString('ko-KR'),
  })
}

// [커스터마이징] props가 정말 읽기 전용인지 직접 확인
const mutateResult = ref('')
const tryMutateProp = () => {
  const before = props.parentData
  try {
    // eslint-disable-next-line vue/no-mutating-props -- 읽기 전용임을 실증하기 위한 의도적 위반
    props.parentData = '자식이 강제로 바꾼 값'
  } catch (error) {
    mutateResult.value = `❌ 예외 발생: ${error.message}`
    return
  }
  mutateResult.value =
    props.parentData === before
      ? `❌ 변경 실패 — props는 읽기 전용입니다. 값은 "${before}" 그대로이며, 콘솔에 Vue 경고가 출력됩니다.`
      : `⚠️ 변경됨: ${props.parentData}`
}
</script>

<template>
  <div class="child-container">
    <h2>하위 컴포넌트 (Child)</h2>
    <p>
      수신된 Props 데이터: <strong>{{ parentData }}</strong>
    </p>

    <!-- [커스터마이징] 유효성 검사가 적용된 props들 -->
    <ul class="props-list">
      <li><code>badgeLabel</code> (기본값): {{ badgeLabel }}</li>
      <li><code>level</code> (다중 타입 {{ typeof level }}): {{ level }}</li>
      <li>
        <code>score</code> (검증기 0~100): {{ score }}
        <span v-if="score < 0 || score > 100" class="invalid"
          >← 범위를 벗어나 콘솔에 경고 발생</span
        >
      </li>
    </ul>

    <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>

    <!-- [커스터마이징] 자식이 입력한 값을 페이로드로 전달 -->
    <div class="row">
      <input v-model="draft" placeholder="부모에게 보낼 문장 입력" @keyup.enter="sendDraft" />
      <button @click="sendDraft">입력값 전송</button>
    </div>

    <div class="row">
      <button @click="reportStatus">객체 페이로드 전송 (report)</button>
      <button class="danger" @click="tryMutateProp">props 직접 수정 시도</button>
    </div>

    <p v-if="mutateResult" class="mutate-result">{{ mutateResult }}</p>
  </div>
</template>

<style scoped>
.child-container {
  padding: 20px;
  border: 2px dashed #3498db;
  border-radius: 6px;
  background-color: #fff;
}
.props-list {
  margin: 10px 0;
  padding-left: 18px;
  font-size: 14px;
  color: #636e72;
}
.props-list code {
  color: #6c5ce7;
  font-weight: 600;
}
.invalid {
  margin-left: 6px;
  color: #d63031;
  font-weight: bold;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}
.row input {
  flex: 1;
}
.danger {
  color: #d63031;
}
.mutate-result {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fff5f5;
  font-size: 14px;
}
</style>

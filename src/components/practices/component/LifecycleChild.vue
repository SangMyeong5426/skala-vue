<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

const props = defineProps({
  // [커스터마이징] 소멸 시 타이머를 정리할지 여부
  autoCleanup: {
    type: Boolean,
    default: true,
  },
  // [커스터마이징] 정리하지 않은 '유령 타이머'가 돌 때 부모에게 알리는 콜백
  // 컴포넌트가 소멸된 뒤에도 클로저로 살아남아 호출된다 = 메모리 누수의 증거
  onGhostTick: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['lifecycle'])

const count = ref(0)
let timerId = null
// 소멸 여부 플래그 - 정리되지 않은 타이머가 '죽은 컴포넌트의 코드'임을 스스로 알리기 위해 사용
let isUnmounted = false

// ── 생성(Creation) 단계 = <script setup> 본문 그 자체 ──
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')
emit('lifecycle', { hook: 'setup', desc: '메모리에 생성 (DOM 접근 불가)' })

// ── 부착(Mounting) 단계 ──
onBeforeMount(() => {
  console.log('2. [onBeforeMount] DOM에 부착되기 직전입니다.')
  emit('lifecycle', { hook: 'onBeforeMount', desc: 'DOM 부착 직전' })
})

onMounted(() => {
  console.log('3. [onMounted] 화면에 부착 완료! (API 호출 / DOM 조작 적기)')
  emit('lifecycle', { hook: 'onMounted', desc: '부착 완료 · 타이머 가동' })

  // 실무 시뮬레이션: 1초마다 카운트가 올라가는 타이머
  timerId = setInterval(() => {
    count.value++

    // 컴포넌트가 사라진 뒤에도 이 콜백이 계속 돈다면 그것이 곧 메모리 누수다
    if (isUnmounted) {
      console.warn(
        `👻 [유령 타이머] 컴포넌트는 사라졌는데 아직 실행 중입니다. (count: ${count.value})`,
      )
      props.onGhostTick?.()
    }
  }, 1000)
})

// ── 갱신(Updating) 단계 ──
// ⚠️ 이 두 훅에서는 부모에게 emit 하지 않는다.
// 부모 상태가 바뀌면 → 부모가 다시 그리고 → 자식도 갱신되어 → 다시 이 훅이 실행되는
// 무한 루프에 빠질 수 있기 때문이다. 갱신 훅에서 반응형 상태를 건드릴 때는 항상 주의해야 한다.
onBeforeUpdate(() => {
  console.log(`4. [onBeforeUpdate] 화면을 다시 그리기 직전 (count: ${count.value})`)
})

onUpdated(() => {
  console.log(`5. [onUpdated] 화면을 다시 그렸습니다. (count: ${count.value})`)
})

// ── 소멸(Unmounting) 단계 ──
onBeforeUnmount(() => {
  console.log('6. [onBeforeUnmount] 곧 화면에서 제거됩니다.')
  emit('lifecycle', { hook: 'onBeforeUnmount', desc: '제거 직전' })
})

onUnmounted(() => {
  if (props.autoCleanup) {
    clearInterval(timerId)
    console.log('7. [onUnmounted] 소멸 완료. 타이머를 정리했습니다.')
    emit('lifecycle', { hook: 'onUnmounted', desc: '소멸 완료 · 타이머 정리됨' })
    return
  }

  // [커스터마이징] 정리하지 않은 경우
  // clearInterval을 호출하지 않으면 setInterval은 브라우저에 그대로 남아 계속 실행된다.
  // 컴포넌트는 화면에서 사라졌는데 그 코드만 살아 있는 상태 = 메모리 누수.
  isUnmounted = true
  console.warn('7. [onUnmounted] 소멸했지만 타이머를 정리하지 않았습니다 → 메모리 누수 발생!')
  emit('lifecycle', { hook: 'onUnmounted', desc: '⚠️ 소멸 · 타이머 미정리(누수)' })
})
</script>

<template>
  <h3>⏱️ 라이프사이클 훅 흐름 탐색기</h3>
  <div class="counter-display">
    <p>실시간 타이머 카운트: {{ count }}</p>
    <button @click="count++">수동으로 숫자 올리기</button>
    <p class="hint">숫자가 바뀔 때마다 onBeforeUpdate → onUpdated가 콘솔에 찍힙니다.</p>
  </div>
</template>

<style scoped>
.counter-display {
  padding: 15px;
  border: 1px solid #99e9f2;
  border-radius: 8px;
  background: #e3fafc;
  text-align: center;
}
.hint {
  margin-top: 6px;
  color: #7f8c8d;
  font-size: 13px;
}
</style>

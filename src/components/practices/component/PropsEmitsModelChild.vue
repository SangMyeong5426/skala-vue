<script setup>
/**
 * [커스터마이징] 컴포넌트에 v-model 붙이기 (심화)
 *
 * 자료 p.106은 "v-bind와 v-on:input을 결합하면 양방향 바인딩이 완성되고,
 * 이를 간단하게 쓴 것이 v-model"이라고 설명한다. 같은 원리를 컴포넌트에도 적용할 수 있다.
 *
 * 원래 방식(Vue 3.0~):
 *   defineProps({ modelValue: String })
 *   const emit = defineEmits(['update:modelValue'])
 *   → 부모에서 <Child v-model="msg" /> 로 사용
 *
 * defineModel(Vue 3.4+)은 위 두 줄을 대신해 주는 컴파일러 매크로다.
 */
const model = defineModel({ type: String, default: '' })

const clear = () => {
  model.value = ''
}
</script>

<template>
  <div class="model-child">
    <h3>v-model 자식 컴포넌트 (심화)</h3>
    <p class="desc">이 입력창에 타이핑하면 부모의 상태가 직접 바뀝니다.</p>
    <div class="row">
      <input v-model="model" placeholder="부모 상태를 직접 편집" />
      <button @click="clear">비우기</button>
    </div>
  </div>
</template>

<style scoped>
.model-child {
  margin-top: 12px;
  padding: 16px 20px;
  border: 2px dotted #6c5ce7;
  border-radius: 6px;
  background: #faf7ff;
}
.desc {
  color: #7f8c8d;
  font-size: 13px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.row input {
  flex: 1;
}
</style>

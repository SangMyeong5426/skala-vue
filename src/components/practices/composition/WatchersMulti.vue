<script setup>
import { ref, watch } from 'vue'

const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기 중...')

// [커스터마이징] 변경 이력을 최근 5건까지 화면에 쌓아 둔다
const historyList = ref([])

// 두 개의 ref 변수를 배열[] 형태로 묶어 동시에 감시한다
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  // 새 값과 옛 값도 상단에 적어준 [city, dateType] 순서대로 매핑되어 들어온다
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate}) ➡️ ${newCity}(${newDate})`

  // 실무 활용: 두 옵션 중 하나만 바뀌어도 통합 API 요청을 보낸다
  console.log(`🤖 [통합 API 호출] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)

  // [커스터마이징] 어느 소스가 바뀌어서 콜백이 돌았는지 직접 판별한다
  // (다중 감시는 콜백 하나를 공유하므로 원인 구분이 필요할 때가 많다)
  const changedSource = newCity !== oldCity ? '도시' : '날짜'
  historyList.value.unshift({
    id: `${Date.now()}-${historyList.value.length}`,
    source: changedSource,
    detail: `${newCity} / ${newDate}`,
  })
  if (historyList.value.length > 5) historyList.value.pop()
})
</script>

<template>
  <div class="practice-section">
    <h2>여러 개의 변수 동시 감시 (watch)</h2>
    <h3>날씨 조건 설정</h3>
    <label>도시: </label>
    <select v-model="city">
      <option value="서울">서울</option>
      <option value="수원">수원</option>
      <option value="부산">부산</option>
    </select>

    <br />

    <label>날짜: </label>
    <label><input type="radio" value="오늘" v-model="dateType" /> 오늘</label>
    &nbsp;
    <label><input type="radio" value="내일" v-model="dateType" /> 내일</label>
    &nbsp;
    <label><input type="radio" value="주간예보" v-model="dateType" /> 주간예보</label>

    <div class="monitor">
      <h3>통합 모니터링 로그</h3>
      <p>현재 상태: {{ apiStatus }}</p>
    </div>

    <!-- [커스터마이징] 변경 원인 판별 + 최근 이력 -->
    <h3>변경 이력 (최근 5건, 추가 실습)</h3>
    <p v-if="historyList.length === 0" class="empty-text">아직 변경 이력이 없습니다.</p>
    <ul v-else class="history">
      <li v-for="log in historyList" :key="log.id">
        <span class="tag">{{ log.source }} 변경</span>
        {{ log.detail }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid #00b894;
  border-radius: 6px;
  background: #e8f5e9;
}
.history {
  padding-left: 18px;
}
.history li {
  margin-bottom: 4px;
}
.tag {
  display: inline-block;
  min-width: 76px;
  margin-right: 6px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #00b894;
  color: #fff;
  font-size: 12px;
  text-align: center;
}
.empty-text {
  color: #b2bec3;
}
</style>

<script setup>
// 정렬 기준 / 즐겨찾기 필터 컨트롤 바.
defineProps({
  sortKey: {
    type: String,
    required: true,
    validator: (value) => ['none', 'mosquito', 'temp', 'pm10', 'name'].includes(value),
  },
  sortOrder: {
    type: String,
    required: true,
    validator: (value) => ['asc', 'desc'].includes(value),
  },
  favoritesOnly: {
    type: Boolean,
    default: false,
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
})

defineEmits(['change-sort-key', 'toggle-sort-order', 'change-favorites-only'])
</script>

<template>
  <div class="control-bar">
    <el-select
      class="sort-select"
      :model-value="sortKey"
      size="small"
      @change="$emit('change-sort-key', $event)"
    >
      <el-option label="기본 순서" value="none" />
      <el-option label="모기활동지수" value="mosquito" />
      <el-option label="기온" value="temp" />
      <el-option label="미세먼지" value="pm10" />
      <el-option label="이름" value="name" />
    </el-select>

    <el-button size="small" :disabled="sortKey === 'none'" @click="$emit('toggle-sort-order')">
      {{ sortOrder === 'desc' ? '내림차순 ↓' : '오름차순 ↑' }}
    </el-button>

    <el-switch
      class="fav-switch"
      :model-value="favoritesOnly"
      size="small"
      :active-text="`즐겨찾기 ${favoriteCount}곳`"
      @change="$emit('change-favorites-only', $event)"
    />
  </div>
</template>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--glass-line);
}
.sort-select {
  width: 130px;
}
.fav-switch {
  margin-left: auto;
}
</style>

<template>

  <div class="filter-row">
    <label class="label-filter">{{ value.name }}</label>
    <div class="filter-fields">
      <el-select v-model="value.operation" :class="'change-fields-number'">
        <el-option
            v-for="(item,i) in value.change"
            :key="i"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
          v-model="value.min"
          :placeholder="'Введите значение'"
          :class="'change-value'"
          type="date"
          format="dd.MM.yyyy"
          value-format="dd.MM.yyyy"
      ></el-date-picker>
      <el-date-picker
          v-if="value.operation == '><'"
          v-model="value.max"
          :placeholder="'Введите значение'"
          :class="'change-value'"
          type="date"
          format="dd.MM.yyyy"
          value-format="dd.MM.yyyy"
      ></el-date-picker>
      <el-button :class="'hide-fields'" icon="el-icon-close" @click="$store.commit('grid/toggleFilter',{name : grid,key : value.key})" />
    </div>
  </div>

</template>
<script>
export default {
  name : 'Date',
  props : ['value','grid'],
}
</script>
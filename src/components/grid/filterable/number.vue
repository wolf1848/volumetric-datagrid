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
      <el-input
          v-model="value.min"
          :placeholder="'Введите значение'"
          :class="'change-value'"
      ></el-input>
      <el-input
          v-if="value.operation == '><'"
          v-model="value.max"
          :placeholder="'Введите значение'"
          :class="'change-value'"
      ></el-input>
      <el-button :class="'hide-fields'" icon="el-icon-close" @click="$store.commit('grid/toggleFilter',{name : grid,key : value.key})" />
    </div>
  </div>

</template>
<script>
export default {
  name : 'Number',
  props : ['value','grid'],
}
</script>
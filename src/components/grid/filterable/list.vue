<template>

  <div class="filter-row">
    <label class="label-filter">{{ value.name }}</label>
    <div class="filter-fields">
      <el-select v-model="value.value" :multiple="value.multiple" :class="'change-fields-list'">
        <el-option
            v-for="(item,i) in value.option"
            :key="i"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

      <el-button :class="'hide-fields'" icon="el-icon-close" @click="$grid.commit('toggleFilter',{name : grid,key : value.key})" />
    </div>
  </div>

</template>
<script>
export default {
  name : 'List',
  props : ['value','grid'],
}
</script>
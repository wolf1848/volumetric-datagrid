<template>

  <div class="filter-row">
    <label class="label-filter">{{ 'ID' }}</label>
    <div class="filter-fields">
      <el-select v-model="operation" :class="'change-fields'">
        <el-option
            v-for="(item,i) in change"
            :key="i"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input
          v-model="min"
          :placeholder="'Введите значение'"
          :class="'change-value'"
      ></el-input>
      <el-input
          v-if="operation == '><'"
          v-model="max"
          :placeholder="'Введите значение'"
          :class="'change-value'"
      ></el-input>
      <el-button :class="'hide-fields'" icon="el-icon-close" @click="" />
    </div>
  </div>

</template>
<script>
export default {
  data : function(){
    return {
      change : [
        {
          value: '=',
          label: 'Точно'
        },
        {
          value: '><',
          label: 'Диапазон'
        },
        {
          value: '>',
          label: 'Больше чем'
        },
        {
          value: '<',
          label: 'Меньше чем'
        }
      ],
      operation : '><',
      min : '',
      max : ''
    };
  }
}
</script>
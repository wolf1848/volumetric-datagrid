<template>

  <div class="filter-row">
    <label class="label-filter">{{ value.name }}</label>
    <div class="filter-fields">
        <el-select
            v-model="value.value"
            :multiple="value.multiple"
            filterable
            remote
            reserve-keyword
            placeholder="Укажите ФИО"
            :remote-method="search"
            :loading="loading"
            :disabled="false"
            @change="clearSelectSearch"
            @remove-tag="clearElement"
            :ref="'search'"
            :class="'change-fields-list'"
        >
          <el-option
              v-for="item in value.option"
              :key="item.value"
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
  name : 'SearchList',
  props : ['value','grid'],
  data : function(){
    return {
      loading : false,
    };
  },
  methods : {
    clearElement : function(value){
      this.value.changeOption = this.value.changeOption.filter(el => {
        return el.value != value;
      });
    },
    clearSelectSearch : function(value){
      if(value instanceof Array) {
        let arr = [];
        value.forEach(el => {
          let res;
          res = this.value.changeOption.filter(op => {
            return el == op.value;
          })[0];
          if (!res) {
            res = this.value.option.filter(op => {
              return el == op.value;
            })[0];
          }
          arr.push(res);
        });
        this.value.changeOption = arr;
      }else{
        this.value.changeOption = [];
        if(value){
          this.value.changeOption.push(this.value.option.filter(op => {
            return value == op.value;
          })[0]);
        }
      }
      this.$refs['search'].query = '';
    },
    search : async function(query){
      this.loading = true;
      await this.value.query(query);
      this.loading = false;
    },
  },
}
</script>
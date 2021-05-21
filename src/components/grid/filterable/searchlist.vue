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
      <el-button :class="'hide-fields'" icon="el-icon-close" @click="$store.commit('grid/toggleFilter',{name : grid,key : value.key})" />
    </div>
  </div>


</template>

<script>
export default {
  name : 'SearchList',
  props : ['value','grid'],
  data : function(){
    return {
      users : [],
      loading : false,
    };
  },
  methods : {
    clearSelectSearch : function(){
      this.$refs['search'].query = '';
    },
    search : async function(query){
      this.value.query(query);
    },
  },
  watch : {
    // 'queryData.type' : function(value){
    //   if(value === 'complex'){
    //     this.queryData.users = [];
    //     this.users = [];
    //     this.usersSelected = [];
    //     this.queryData.company = [];
    //     this.company = [];
    //     this.companySelected = [];
    //   }else if(value === 'personal'){
    //     this.getData();
    //   }
    // },
    // 'queryData.users' : function(value){
    //   if(value instanceof Array){
    //     let arr = [];
    //     this.users.forEach(el => {
    //       if(value.indexOf(el.key) >= 0)
    //         arr.push(el);
    //     });
    //     this.usersSelected = arr;
    //   }
    // },
    // 'queryData.company' : function(value){
    //   if(value instanceof Array){
    //     let arr = [];
    //     this.company.forEach(el => {
    //       if(value.indexOf(el.key) >= 0)
    //         arr.push(el);
    //     });
    //     this.companySelected = arr;
    //   }
    // },
  }
}
</script>
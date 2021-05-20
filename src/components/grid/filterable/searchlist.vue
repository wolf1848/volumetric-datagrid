<template>

  <div class="filter-row">
    <label class="label-filter">{{ 'Список с поиском' }}</label>
    <div class="filter-fields">
        <el-select
            v-model="users"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Укажите ФИО"
            :remote-method="searchUser"
            :loading="loading"
            :disabled="false"
            @change="clearSelectSearch('user_search')"
            :ref="'user_search'"
            :class="'change-fields-list'"
        >
          <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      <el-button :class="'hide-fields'" icon="el-icon-close" @click="" />
    </div>
  </div>


</template>

<script>
export default {
  data : function(){
    return {
      users : [],
      loading : false,
    };
  },
  methods : {
    clearSelectSearch : function(key){
      this.$refs[key].query = '';
    },
    searchUser: function(query) {
      if (query !== '')
        this.search(query,'user');
    },
    searchCompany : function(query){
      if (query !== '')
        this.search(query,'company');
    },
    search : async function(query,key){
      let url,obj;
      if(key == 'user'){
        obj = 'users';
        url = '/api/vicarious/user/search';
      }
      else if(key == 'company'){
        obj = 'company';
        url = '/api/vicarious/company/search';
      }

      // let result = await this.$store.dispatch('query',{url : url,data :  {q : query}});
      // if(result.status == 'success'){
      //   this[obj] = result.data;
      //   this[obj+'Selected'].forEach(el => {
      //     if(this[obj].indexOf(el.key) < 0)
      //       this[obj].push(el);
      //   });
      // }
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
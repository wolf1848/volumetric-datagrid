<template>
  <div class="filter_main" v-click-outside="hide">
    <div class="wrapper-label-filter">
        <div class="input-filter" @click="show">
          <div
            v-for="(item, key) in showValue"
            :key="key"
          >
            <span class="value-filter">
              {{ item.name }} :
              {{ item.value }}
            </span>
          </div>
          <el-input class="filter_input" placeholder="Фильтр + поиск" @focus="show"></el-input>
        </div>

    </div>

    <transition name="el-fade-in-linear">
      <div class="filter-wrapper" v-show="visible">

        <template v-for="(item,key) in filter.data">
          <Number :key="key" :grid="grid" v-if="item.type == 'number' && item.show" v-model="filter.data[key]" />
          <List :key="key" :grid="grid" v-if="item.type == 'list' && item.show" v-model="filter.data[key]" />
          <SearchList :key="key" :grid="grid" v-if="item.type == 'searchlist' && item.show" v-model="filter.data[key]" />
        </template>

<!--      <Date />-->


        <div class="filter-row">
          <div class="filter-fields">
            <el-dropdown @command="showElement" class="ml-2">
              <el-button>+</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="item in filter.data"
                    v-if="!item.show"
                    :key="item.key"
                    :command="item.key"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button class="clear-filter" @click="clear">{{filtered ? 'Сбросить' : 'Очистить'}}</el-button>

            <el-button
                type="primary "
                class="ml-1 mr-2 ui-btn-primary"
                @click="onSubmit"
                icon="el-icon-search"
            >
              Найти
            </el-button>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>

import Number from './number'
import List from './list'
import SearchList from './searchlist'
import Date from './date'

export default {
  components : { Number, List, SearchList, Date},
  computed : {
    filter : function(){
        return this.$store.getters['grid/filter'](this.grid);
    }
  },
  props : ['grid'],
  data() {
    return {
      visible : false,
      filtered : false,
      showValue : [],
    };
  },
  methods: {
    show : function() {
      this.visible = true
    },
    hide : function() {
      this.visible = false
    },
    showElement : function(key) {
      this.$store.commit('grid/toggleFilter',{name : this.grid,key : key})
    },
    clear : function(){
      this.showValue = [];
      if(this.filtered){
        this.filtered = false;
        this.filter.clear(this.filter.data);
      }else{
        for(let key in this.filter.data){
          switch(this.filter.data[key].type){
            case 'number' :
              this.filter.data[key].min = '';
              this.filter.data[key].max = '';
              this.filter.data[key].operation = '=';
            break;
            case 'list' :
              this.filter.data[key].value = this.filter.data[key].multiple ?  [] : '';
            break;
          }
        }
      }
    },
    onSubmit : function() {
      this.filtered = true;
      this.showValue = [];
      for(let key in this.filter.data) {
        if (this.filter.data[key].type == 'number' && this.filter.data[key].min > 0) {
          let obj = {
            name: this.filter.data[key].name,
            value: ''
          };
          if (this.filter.data[key].operation == '><') {
            obj.value = this.filter.data[key].min + ' - ' + this.filter.data[key].max;
          } else
            obj.value = this.filter.data[key].operation + ' ' + this.filter.data[key].min;

          this.showValue.push(obj);
        }else if (this.filter.data[key].type == 'list' && this.filter.data[key].value) {
          let obj = {
            name: this.filter.data[key].name,
            value: ''
          };
          if (this.filter.data[key].value instanceof Array) {
            let arr = this.filter.data[key].value.map(el => {
              return this.filter.data[key].option.filter(option => {
                return option.value == el;
              })[0].label;
            })
            obj.value = arr.join();
          } else
            obj.value = this.filter.data[key].option.filter(option => {
              return option.value == this.filter.data[key].value;
            })[0].label;

          this.showValue.push(obj);
        }
      }
      let len = this.showValue.length - 2;
      this.showValue.splice(0,-2);
      if(len > 0)
        this.showValue.push({
          name : 'ещё',
          value : len
        });


      this.filter.filter(this.filter.data);
    },
  }
}
</script>
<style>
.filter_input > .el-input__inner{
  height: 38px !important;
}
.wrapper-label-filter{
  display: flex;
  width: 100%;
  align-items: center;
}
.wrapper-label-filter >div:last-child{
  display: flex;
  flex : 1 1 500px;
  height: 40px;
}
.input-filter {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
span.value-filter {
  background: #bcedfc;
  color: #6b6b6b;
  font-size: 15px;
  float: left;
  height: 22px;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 280px;

}
.filter-wrapper {
  overflow: hidden;
  left: 0px;
  top: 45px;
  padding: 20px;
  position: absolute;
  width: 580px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 7px 21px rgb(83 92 105 / 12%), 0 -1px 6px 0 rgb(83 92 105 / 6%);
}
.label-filter {
  text-align: left;
  line-height: 40px;
  padding: 0 12px 0 0;
  color: #a9adb2;
  display: inline-block;
  width: 100%;
  font: 13px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.filter-fields{
  display: flex !important;
  margin-bottom: 10px;
}
.change-fields-number{
  display: flex !important;
  flex: 1 1 160px;
  padding-right: 10px;
  min-width: 160px;
}
.change-value{
  display: flex !important;
  flex: 1 1 100%;
  padding-right: 10px;
}
.hide-fields{
  display: flex !important;
  flex: 1 1 40px;
  padding: 12px !important;
}
.change-fields-list{
  display: flex !important;
  flex: 1 100%;
  padding-right: 10px;
  min-width: 160px;
}
.clear-filter{
  margin-left: auto !important;
}
.ui-btn-primary {
  background: #3bc8f5 !important;
  border: 1px solid #3bc8f5;
}
.filter_input {
  font-size: 14px;
  display: flex;
  width: auto;
  height: 40px;
}
.filter_input input {
  border: none !important;
}
.filter_main .el-tag.el-tag--info {
  background: #bcedfc !important;
}
.el-select-dropdown__item.selected {
  color: #4ac2e6 !important;
}
.filter_main .el-input__inner:focus,
.filter_main .el-select .el-input.is-focus .el-input__inner {
  border-color: #4ac2e6 !important;
  outline: 0;
}
.filter_main {
  position: relative;
  display: flex;
  flex : 1 1 500px;
}
</style>

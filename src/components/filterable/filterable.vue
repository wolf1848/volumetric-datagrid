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

      <Number />
      <List />


        <div class="filter-row">
          <div class="filter-fields">
            <el-dropdown @command="plus" class="ml-2">
              <el-button>+</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="item in []"
                    :key="item.id"
                    :command="item.id"
                    :disabled="findindex(item.id)"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button class="clear-filter" @click="clear">Сбросить</el-button>

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

export default {
  components : { Number, List},
  data() {
    return {
      FilterNumber : {

      },
      visible : false,
      showValue : [
        {
          name : 'ID',
          value : '1,2,3'
        },
        {
          name : 'Пользователь',
          value : 'Дмитриев Иван, Смирнов Константин'
        },
        {
          name : 'и еще',
          value : '3'
        }
      ],
    };
  },
  methods: {
    show : function() {
      this.visible = true
    },
    hide : function() {
      this.visible = false
    },

    plus(id) {
      let s = this
      //console.log(id)
      this.filter.push(this.filterhide.find((item) => item.id == id))


    },
    minus(id) {
      let key = this.filter.findIndex((item) => item.id == id)
      if (key != -1) {
        this.filter.splice(key, 1)
      }
    },
    clear() {
      let s = this
      let filter = this.filter
      let f = []

      filter.forEach((item, i) => {
        f.push({ id: item.id, value: '' })
        filter[i].value = ''
      })

      localStorage.filter = JSON.stringify(f)

      this.filter = filter

      this.fshow = false

    },
    onSubmit() {
      let s = this
      // запись фильтра в localStorage
      let f = []
      s.filter.forEach((item) => {
        f.push({
          id: item.id,
          value: item.value,
          options: item.options ? item.options : [],
        })
      })
      localStorage.filter = JSON.stringify(f)
      // запись фильтра в localStorage
      this.fshow = false

    },
  },
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

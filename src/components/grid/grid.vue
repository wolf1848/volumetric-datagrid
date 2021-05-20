<template>
  <fragment>
    <div class="wrapper">

      <div class="pagination-wrapper">

        <Filterable />

        <el-pagination
            v-if="pagination.show == 'full' || pagination.show == 'top'"
            @size-change="pagination.changeSize"
            @current-change="pagination.changePage"
            :current-page.sync="pagination.page"
            :page-sizes="pagination.sizes"
            :page-size="pagination.defaultSize"
            :layout="pagination.layout.join(',')"
            :total="pagination.total">
        </el-pagination>
      </div>

      <!-- HEADER  -->
      <div class="header-wrapper">
        <div class="row-header" ref="rowHeader">
          <div class="column-header">
            <div class="column-header-handle column-header-handle-mr"></div>
            <i @click="dialogVisible = true" class="el-icon-s-tools" />
          </div>

          <VueDraggableResizable
              class-name="column-header"
              class-name-handle="column-header-handle"
              v-for="item in virtualHeader.list"
              :key="item"
              :draggable="false"
              :w="header[item].width"
              :h="'auto'"
              :minWidth="minWidth"
              @resizing="onResize"
              :handles="['mr']"
              :active="true"
              :prevent-deactivation="true"
              v-on:mousedown.native.capture="activeResizeKey = item"
              v-on:mouseup.native.capture="activeResizeKey = null"
          >
            <span>{{header[item].name}}</span>
          </VueDraggableResizable>
        </div>
      </div>

     <VueCustomScrollbar class="scroll-area" :settings="{suppressScrollY : true}" @ps-scroll-x="scrollHandle">
        <div :style="[{width : virtualHeader.scrollWidth + 'px'},{height : '15px'}]"></div>
      </VueCustomScrollbar>

     <div class="body-wrapper" ref="bodyWrapper">
        <template v-for="(i) in 20">
          <template v-for="(row,key) in elements">
            <Row :grid="name" :row="row" :key="key + i" :rowKey="key + i" />
          </template>
        </template>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
            v-if="pagination.show == 'full' || pagination.show == 'bottom'"
            @size-change="pagination.changeSize"
            @current-change="pagination.changePage"
            :current-page.sync="pagination.page"
            :page-sizes="pagination.sizes"
            :page-size="pagination.defaultSize"
            :layout="pagination.layout.join(',')"
            :total="pagination.total">
        </el-pagination>
      </div>

    </div>

    <el-dialog title="Настройка списка" :visible.sync="dialogVisible" width="30%" >
      <div class="sort-grid-body">
        <Sortable :grid="name" :tree="'root'" :parentShow="true"/>
      </div>
    </el-dialog>

    <portal to="grid-context">
      <div class="context-menu-wrapper" v-click-outside="test">
        <div class="context-menu-element" v-for="(item,i) in context.menu" @click="eventContext(item.function)" :key="i">{{item.name}}</div>
      </div>
    </portal>

  </fragment>
</template>
<script>

import VueDraggableResizable from 'vue-draggable-resizable'
import VueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import Row from './row'
import Sortable from './sortable'
import Filterable from './filterable/filterable'

export default {
  name : 'Grid',
  props : ['name'],
  components : {VueDraggableResizable, VueCustomScrollbar, Row, Sortable, Filterable},
  computed : {
    context : function(){
      return this.$store.getters["grid/context"](this.name);
    },
    pagination : function(){
      return this.$store.getters["grid/pagination"](this.name);
    },
    virtualHeader : function(){
      return this.$store.getters["grid/virtualHeader"](this.name);
    },
    header : function(){
      return this.$store.getters['grid/header'](this.name);
    },
    minWidth : function(){
      return this.$store.getters['grid/setting'](this.name).minWidth;
    },
    elements : function(){
      return this.$store.getters['grid/elements'](this.name);
    },

  },
  data : function(){
    return {
      offsetScrollX : 0,
      activeResizeKey : null,
      dialogVisible : false,
      currentPage: 5,
    };
  },
  mounted : function(){
    console.log(this.pagination);
    this.$refs.rowHeader.style.gridTemplateColumns = this.virtualHeader.listWidth;
    this.$refs.rowHeader.style.width = this.virtualHeader.scrollWidth + 'px';
  },
  updated : function(){
    this.$refs.rowHeader.style.gridTemplateColumns = this.virtualHeader.listWidth;
    this.$refs.rowHeader.style.width = this.virtualHeader.scrollWidth + 'px';
  },
  methods : {
    onResize: function (x,y,w,h) {
      this.$store.dispatch('grid/resize',{key : this.activeResizeKey,width : w, name : this.name});
      this.$refs.rowHeader.style.gridTemplateColumns = this.virtualHeader.listWidth;
    },
    scrollHandle(e) {
      let left = e.target.scrollLeft;
      this.$refs.rowHeader.style.clipPath = 'inset(0 '+(-left)+'px 0 '+left+'px)';
      this.$refs.rowHeader.style.left = -left + 'px';
      this.$refs.bodyWrapper.style.clipPath = 'inset(0 '+(-left)+'px 0 '+left+'px)';
      this.$refs.bodyWrapper.style.left = -left + 'px';
    },
    eventContext : function(func){
      func(this.elements[0]);
      this.$store.commit('grid/hideContext',this.name);
    },
    test : function(){
      this.$store.commit('grid/showContext',{name : this.name,row : null});
    }
  }
}
</script>
<style>
html,
body {
  height: 100%;
}

html {
  font-size: 14px;
}

body {
  margin: 0px;
  padding: 0px;
  overflow-x: hidden;
  min-width: 320px;
  background: #FFFFFF;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.4285em;
  color: rgba(0, 0, 0, 0.87);
  font-smoothing: antialiased;
}
/* PAGINATION */
.pagination-wrapper{
  display: flex;
}
.pagination-wrapper > .el-pagination{
  display: flex;
  margin-left: auto;
  margin-bottom: 15px;
  margin-top: 15px;
}

/* HEADER */
.wrapper {
  padding: 20px;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
}
.row-header{
  background: #fff;
  display: grid;
  grid-gap: 0vw;
  z-index: 1;
}
.body-wrapper,
.row-header {
  position: relative;
  left : 0;
  clip-path: inset(0);
}
.column-header,
.column-body{
  display: flex;
  max-width: 100%;
  justify-content: center;
  padding: 10px 30px 10px 10px;
  position: relative;
}
.column-header{
  align-items: center;
  box-sizing: border-box;
  border-bottom: 2px #eef2f4 solid;
  height: 100% !important;
}
.column-header span{
  overflow: hidden;
  display: inline-block;
  color: #535c69;
  text-align: left;
  text-transform: uppercase;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: .5px;
  font-weight: normal;
  font-size: 11px;
  font-family: 'OpenSans-Semibold',"Helvetica Neue",Arial,Helvetica,sans-serif;
  line-height: 12px;
}
.column-header-handle{
  width: 20px;
  height: 100%;
  position: absolute;
  left: calc(100% - 20px);
}
.column-header-handle-mr:before{
  position: absolute;
  top: 15%;
  right: 10px;
  display: block;
  width: 1px;
  height: 70%;
  background: rgba(0,0,0,.1);
  content: '';
}
.column-header-handle-mr:hover{
  cursor: col-resize;
}
.column-header:first-child .column-header-handle-mr:hover{
  cursor: auto;
}
.column-header i{
  cursor: pointer;
  font-size: 16px;
  line-height: 0;
  top: 2px;
  position: relative;
  left: 5px;
}
/* SCROLL */
.scroll-area{
  position: sticky;
  margin: auto;
  width: 100%;
  height: 15px;
  top : 37px;
  z-index: 1;
}
.ps__rail-x {
  opacity: .6;
}
.ps__thumb-x{
  top : 2px;
}

/* BODY */
.body-wrapper > .row-body{
  border-bottom: 2px #eef2f4 solid;
  width: auto;
}
.row-body{
  display: grid;
  grid-gap: 0vw;
}
.column-body{
  align-items: start;
}
.column-body i{
  cursor: pointer;
  font-size: 16px;
  line-height: 0;
  top: 2px;
  position: relative;
  left: 10px;
}
.column-body span{
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  position: sticky;
  display: block;
  color: #535c69;
  font-size: 13px;
  top: 62px;
  vertical-align: top;
  font-family: "Helvetica Neue",Arial,Helvetica,sans-serif;
}
.column-body span.icon{
  width: 100%;
  z-index: 10;
  overflow: unset;
}
.context-menu-wrapper {
  overflow: hidden;
  left: 35px;
  top: 0px;
  padding: 0;
  position: absolute;
  width: 180px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 7px 21px rgb(83 92 105 / 12%), 0 -1px 6px 0 rgb(83 92 105 / 6%);
}
.context-menu-element{
  padding: 5px;
  border-bottom: 1px solid #dcdfe6;
  color: #535c69;
  cursor: pointer;
}
.context-menu-element:hover{
  color: #409EFF;
}
.context-menu-element:last-child{
  border-bottom: 0;
}



/* SORTABLE */
.el-dialog__body,
.el-dialog__header{
  padding: 10px !important;
}
.sort-grid-item {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  border-bottom: 1px #fff solid;
  border-radius: 2px;
  color: #525c69;
  font: 14px/33px "Helvetica Neue",Arial,Helvetica,sans-serif;
  cursor: pointer;
  -webkit-column-break-inside: avoid;
  background: #b3eafc;
}
.sort-grid-label {
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px 20px 6px 28px;
  min-height: 33px;
  width: auto;
  height: auto;
  outline: 0;
  border: 1px transparent solid;
  vertical-align: middle;
  line-height: 19px;
  cursor: pointer;
  -webkit-transition: border 200ms;
  -o-transition: border 200ms;
  transition: border 200ms;
  border-radius: 2px;
}
.sort-grid-checkbox {
  position: absolute;
  top: 10px;
  margin: 0 7px;
  vertical-align: middle;
}
.drag-wrapper .drag-wrapper{
  padding-left: 20px;
}
.sortable-icon{
  position: absolute;
  top: calc(50% - 12px);
  right: 10px;
  color: #000;
  font-size: 24px;
  cursor: pointer;
  transform: rotate(0deg);
}
.sortable-icon.show{
  transform: rotate(180deg)
}
</style>
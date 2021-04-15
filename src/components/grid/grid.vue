<template>
  <fragment>
    <div class="wrapper">
      <!-- HEADER  -->
      <div class="header-wrapper">
        <div class="row-header" ref="rowHeader">
          <div class="column-header">
            <div class="column-header-handle column-header-handle-mr"></div>
            <svg @click="dialogVisible = true" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
            </svg>
          </div>
          <VueDraggableResizable
              class-name="column-header"
              class-name-handle="column-header-handle"
              v-for="(item,key) in grid.header"
              :key="key"
              :draggable="false"
              :w="item.width"
              :h="'auto'"
              :minWidth="grid.setting.minWidth"
              @resizing="onResize"
              @resizestop="onResizeStop"
              :handles="['mr']"
              :active="true"
              :prevent-deactivation="true"
              v-on:mousedown.native.capture="activeResizeKey = key"
              v-on:mouseup.native.capture="activeResizeKey = null"
          >
            <span>{{item.name}}</span>
          </VueDraggableResizable>
        </div>
      </div>

      <VueCustomScrollbar class="scroll-area" :settings="{suppressScrollY : true}" @ps-scroll-x="scrollHandle">
        <div :style="[{width : grid.setting.maxWidth + 'px'},{height : '15px'}]"></div>
      </VueCustomScrollbar>

      <div class="body-wrapper" ref="bodyWrapper">
        <template v-for="(i) in 30">
          <template v-for="(row,key) in grid.elements">
            <Row :row="row" :key="'row_' + key + '_' +  i" />
          </template>
        </template>
      </div>

    </div>



    <el-dialog title="Настройка списка" :visible.sync="dialogVisible" width="30%" >
        <div class="sort-grid-body">
          <VueDraggableSortable v-model="grid.setting.sortableHeader" v-bind="{animation: 200}">
            <transition-group type="transition">
              <div v-for="element in grid.setting.sortableHeader" :key="element.key">
                <div class="sort-grid-item">
                  <input type="checkbox" class="sort-grid-checkbox" checked="">
                  <label class="sort-grid-label">{{element.name}}</label>
                </div>
                <VueDraggableSortable v-model="element.elements" class="drag-wrapper-child">
                  <div v-for="el in element.elements" :key="el.key">
                    <div class="sort-grid-item">
                      <input type="checkbox" class="sort-grid-checkbox" checked="">
                      <label class="sort-grid-label">{{el.name}}</label>
                    </div>
                  </div>
                </VueDraggableSortable>
              </div>
            </transition-group>
          </VueDraggableSortable>
        </div>
    </el-dialog>

  </fragment>
</template>
<script>
import VueDraggableSortable from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import VueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import Row from './row'

export default {
  name : 'Grid',
  props : ['data'],
  components : {VueDraggableResizable, VueDraggableSortable, VueCustomScrollbar, Row},
  computed : {
    grid : function(){
      return this.$store.getters.grid;
    },
  },
  data : function(){
    return {
      offsetScrollX : 0,
      activeResizeKey : null,
      dialogVisible : false
    };
  },
  created : async function(){
    await this.$store.dispatch('setGrid',this.data);
    this.$refs.rowHeader.style.gridTemplateColumns = this.grid.setting.headerWidth;
  },
  methods : {
    onResize: function (x,y,w,h) {
      this.$store.dispatch('resize',{key : this.activeResizeKey,width : w});
      this.$refs.rowHeader.style.gridTemplateColumns = this.grid.setting.headerWidth;
    },
    onResizeStop: function (x,y,w,h) {
      this.$store.dispatch('setColumnWidth',{key : this.activeResizeKey,width : w});
    },
    scrollHandle(e) {
      let left = e.target.scrollLeft;
      this.$refs.rowHeader.style.clipPath = 'inset(0 '+(-left)+'px 0 '+left+'px)';
      this.$refs.rowHeader.style.left = -left + 'px';
      this.$refs.bodyWrapper.style.clipPath = 'inset(0 '+(-left)+'px 0 '+left+'px)';
      this.$refs.bodyWrapper.style.left = -left + 'px';
    },
  },
}
</script>
<style>
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
  border-bottom: 2px #eef2f4 solid;
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
.column-header svg{
  width: 15px;
  cursor: pointer;
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
}
.row-body{
  display: grid;
  grid-gap: 0vw;
}
.column-body{
  align-items: start;
}
.column-body svg{
  width: 14px;
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
.drag-wrapper-child{
  padding-left: 20px;
}
</style>
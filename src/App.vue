<template>
  <div id="app">

    <div class="wrapper">

      <div class="row-header" :style="[{'grid-template-columns' : subSetting.headerWidth}]">
        <div class="column-header">
          <div class="column-header-handle column-header-handle-mr" style="display: block;"></div>
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>
        </div>
        <VueDraggableResizable
            class-name="column-header"
            class-name-handle="column-header-handle"
            v-for="(item,key) in grid.header"
            :key="key"
            :draggable="false"
            :w="item.width"
            :h="'auto'"
            :minWidth="70"
            @resizing="onResize"
            :handles="['mr']"
            :active="true"
            :prevent-deactivation="true"
            :ref="key"
            v-on:mousedown.native.capture="activeResizeKey = key"
            v-on:mouseup.native.capture="activeResizeKey = null"

        >
          <span>{{item.name}}</span>
        </VueDraggableResizable>
      </div>

      <template v-for="(row,key) in grid.elements">
        <Row :row="row" :key="'row_' + key" />
      </template>

    </div>

  </div>
</template>

<script>

import VueDraggableResizable from 'vue-draggable-resizable'
import Row from './components/grid/newrow'

export default {
  name: 'App',
  components : {VueDraggableResizable, Row},
  computed : {
    subSetting : function(){
      let obj = {};
      obj.headerWidth = this.headerWidth();

      return obj
    }
  },
  data: function (){
    return {
      activeResizeKey : null,
      grid : {
        setting : {
          headerWidth : '',
        },
        header : {
          id : {
            name : 'ID',
            width : 80,
            child : ['column_1']
          },
          column_1 : {
            name : 'Заголовок 1',
            width : 360,
            child : ['column_2']
          },
          column_2 : {
            name : 'Заголовок 2',
            width : 550,
            child : []
          },
          column_3 : {
            name : 'Заголовок 3',
            width : 380,
            child : []
          },
          column_4 : {
            name : 'Заголовок 4',
            width : 390,
            child : []
          },
          column_5 : {
            name : 'Заголовок 5',
            width : 400,
            child : []
          },
          column_6 : {
            name : 'Заголовок 6',
            width : 410,
            child : []
          },
        },
        elements : [
          {
            id : {
              value : 1,
              child : {
                column_1: {
                  value : 'Колонка 1'
                }
              }
            },
            column_2: {
              value : 'Колонка 2'
            },
            column_3: {
              value : 'Колонка 3'
            },
            column_4: {
              value : 'Колонка 4'
            },
            column_5: {
              value : 'Колонка 5'
            },
            column_6: {
              value : 'Колонка 6'
            },
          },
        ]
      }
    };
  },
  methods : {
    headerWidth : function(){
      let str = '60px ';
      for(let key in this.grid.header){
        str += this.grid.header[key].width + 'px ';
      }
      return str;
    },
    onResize: function (x,y,w,h) {
      this.grid.header[this.activeResizeKey].width = w;
    },
  }
}
</script>
<style>
.wrapper {
  padding: 20px;
}
.row-header{
  border-bottom: 2px #eef2f4 solid;
  background-color: #fff;
  display: grid;
  grid-gap: 0vw;
}
.row-body{
  display: grid;
  grid-gap: 0vw;
}
.column-header,
.column-body{
  display: flex;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px;
  padding-right: 30px;
  position: relative;
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
}
.column-body span{
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  position: relative;
  display: block;
  color: #535c69;
  vertical-align: top;
  font-size: 13px;
}
.column-body svg{
  width: 14px !important;
}
</style>
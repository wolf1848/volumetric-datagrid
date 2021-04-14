<template>
  <div id="app">



    <div class="wrapper">
      <div class="header-wrapper">
        <div class="row-header" :style="[{'grid-template-columns' : grid.setting.headerWidth}]" :ref="'scrollHeader'">
          <div class="column-header">
            <div class="column-header-handle column-header-handle-mr"></div>
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
              :minWidth="grid.setting.minWidth"
              @resizing="onResize"
              @resizestop="onResizeStop"
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
      </div>

      <vue-custom-scrollbar class="scroll-area" :settings="scroll" @ps-scroll-x="scrollHanle">
        <div :style="'width : ' + grid.setting.maxWidth + 'px; height : 15px;'"></div>
      </vue-custom-scrollbar>

      <div class="body-wrapper" :ref="'scrollBody'">
        <template v-for="(i) in 10">
          <template v-for="(row,key) in grid.elements">
            <Row :row="row" :key="'row_' + key + '_' +  i" />
          </template>
        </template>
      </div>

    </div>

    <modal name="example">This is an example</modal>

  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import VueDraggableResizable from 'vue-draggable-resizable'
import Row from './components/grid/newrow'


export default {
  name: 'App',
  components : {VueDraggableResizable, Row, vueCustomScrollbar},
  computed : {
    grid : function(){
      return this.$store.getters.grid;
    },
  },
  data: function (){
    return {
      scroll: {
        suppressScrollY : true
      },
      offsetScrollX : 0,

      activeResizeKey : null,
      main_grid : {
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
          },
          column_3 : {
            name : 'Заголовок 3',
            width : 380,
          },
          column_4 : {
            name : 'Заголовок 4',
            width : 390,
          },
          column_5 : {
            name : 'Заголовок 5',
            width : 400,
          },
          column_6 : {
            name : 'Заголовок 6',
            width : 410,
          },
        },
        elements : [
          {
            id : [
              {
                value : 1,
                child : {
                  column_1 : [
                    {
                      value : 'Колонка 1',
                      child : {
                        column_2 : [
                          {
                            value : 'Колонка 2'
                          },
                          {
                            value : 'Колонка 2.2'
                          }
                        ]
                      }
                    },
                    {
                      value : 'Колонка 1',
                      child : {
                        column_2 : [
                          {
                            value : 'Колонка 2'
                          },
                          {
                            value : 'Колонка 2.2'
                          },
                          {
                            value : 'Колонка 2.3'
                          },
                          {
                            value : 'Колонка 2.4'
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            column_3: [{
              value : 'Колонка 3'
            }],
            column_4: [{
              value : 'Колонка 4'
            }],
            column_5: [{
              value : 'Колонка 5'
            }],
            column_6: [{
              value : 'Колонка 6'
            }],
          }
        ]
      }
    };
  },
  methods : {
    onResize: function (x,y,w,h) {
      this.$store.dispatch('resize',{key : this.activeResizeKey,width : w});
    },
    onResizeStop: function (x,y,w,h) {
      this.$store.dispatch('setColumnWidth',{key : this.activeResizeKey,width : w});
    },
    scrollHanle(e) {
      this.$refs['scrollHeader'].style.clipPath = 'inset(0 '+(-e.target.scrollLeft)+'px 0 '+e.target.scrollLeft+'px)';
      this.$refs['scrollHeader'].style.left = -e.target.scrollLeft + 'px';
      this.$refs['scrollBody'].style.clipPath = 'inset(0 '+(-e.target.scrollLeft)+'px 0 '+e.target.scrollLeft+'px)';
      this.$refs['scrollBody'].style.left = -e.target.scrollLeft + 'px';
    }
  },
  created : function(){
    this.$store.dispatch('setGrid',this.main_grid)
  },
  mounted () {
    this.$modal.show('example')
  }
}
</script>
<style>
.wrapper {
  padding: 20px;
}
.row-header{
  border-bottom: 2px #eef2f4 solid;
  background: #fff;
  display: grid;
  grid-gap: 0vw;

  z-index: 1;
}
.row-body{
  display: grid;
  grid-gap: 0vw;
}
.body-wrapper,
.row-header {
  position: relative;
  left : 0;
  clip-path: inset(0);
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
}
.column-header{
  align-items: center;
}
.column-body{
  align-items: start;
}
.column-header,
.column-body{
  display: flex;
  max-width: 100%;
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
  position: sticky;
  display: block;
  color: #535c69;
  font-size: 13px;
  top: 62px;
}
.column-body svg{
  width: 14px !important;
}
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
.body-wrapper > .row-body{
  border-bottom: 2px #eef2f4 solid;
}
</style>
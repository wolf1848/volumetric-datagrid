<template>
  <sui-grid padded>
    <sui-grid-row>
      <sui-grid-column>

        <div class="scroll_wrapper" @scroll="scrollUpdate">
          <div class="header_table" :style="'grid-template-columns :' +  dataGrid.setting.headerWidth">

            <div v-if="dataGrid.setting.contextMenu">
              <sui-icon name="cog" @click="showSortColumn = !showSortColumn"/>
            </div>

            <template v-for="(col,key) in dataGrid.header">
              <div v-if="col.show"
                   :key="'h_'+key"
                   :class="[{'sortable' : col.sort}]"
                   @click="setSort(key)"
              >
                {{col.text}}
                <i v-if="col.sort"
                   :class="[
                       'icon caret',
                       {up : setting_sort.direction == 'asc'},
                       {down : setting_sort.direction == 'desc'},
                       {show : key == setting_sort.key}
                   ]"
                />
              </div>
            </template>

          </div>
        </div>



<!--        <div class="scroll_wrapper clone_element" @scroll="scrollUpdate">
          <div class="header_table" :style="'grid-template-columns :' +  gtc">
            <div v-if="setting.setting.contextMenu"><sui-icon name="cog" @click="showSortColumn = !showSortColumn"/></div>
            <template v-for="item in headerMapKey">
              <div v-if="setting.header[item].show" :key="item+'_header'" :class="[{'sortable' : setting.header[item].sort}]" @click="setSort(item)">
                {{setting.header[item].text}}
                <i :class="['icon caret',{up : setting_sort.direction == 'asc'},{down : setting_sort.direction == 'desc'}, {show : item == setting_sort.key}]" v-if="setting.header[item].sort" />
                <sui-icon name="filter" :class="'filtered'" v-if="setting.header[item].filter" />
              </div>
            </template>
          </div>
        </div>-->

        <div class="scroll_wrapper_hidden" :ref="'body_table'">
          <div class="body_table" :style="{'grid-template-columns' : dataGrid.setting.columnrWidth}" v-for="(column,row_cnt) in dataGrid.column">
            <div v-if="dataGrid.setting.contextMenu" class="start_element">
              <div :class="['sticky']">
                <i class="icon bars" @click="mainContext($event,row_cnt)"/>
              </div>
            </div>
            <template v-for="key in dataGrid.setting.headerFistLevel">
              <Column :column="column[key]" :group="key" :header="dataGrid.header" :key="key+'_'+row_cnt" :row_cnt="row_cnt"/>
            </template>
          </div>
        </div>




<!--        <div v-if="setting.setting.contextMenu" v-show="setting_context.show" :ref="'contextMenu'">
          <div :class="['ui left pointing dropdown link item active']">
            <div :class="['menu transition',{visible : setting_context.show},{hidden : !setting_context.show}]">

              <div class="item"
                   v-for="item in setting.setting.contextElement"
                   v-show="showContextElement(item.show)"
                   @click="clickContext(item.action)"
                   v-html="item.name"
              ></div>

            </div>
          </div>
        </div>-->


      </sui-grid-column>
    </sui-grid-row>
<!--    <sui-modal size="mini" v-model="showSortColumn" closeIcon>
      <sui-modal-header>
        Настройка списка
      </sui-modal-header>
      <sui-modal-content>
        <draggable v-model="mapKey" :class="'sortable_wrapper'">
          <transition-group :class="'sortable_group'">
            <span class="sortable_element" v-for="(element,key) in mapKey" :key="key+'_sortable'">
              <span class="sortable_content">
                <span class="checkbox"><sui-checkbox v-model="setting.header[element].show" /></span>
                <span class="name_column">{{setting.header[element].text}}</span>
                <template v-if="setting.header[element].group">
                  <sui-icon @click="toggleShowSortableColumn(element)" name="plus" v-if="hideGroupSortable.indexOf(element) < 0"/>
                  <sui-icon @click="toggleShowSortableColumn(element)" name="minus" v-else/>
                </template>
              </span>
              <sortableGroup v-if="setting.header[element].group && hideGroupSortable.indexOf(element) >= 0"
                             v-on:toggleShowSortableColumn="toggleShowSortableColumn($event)"
                            :hideGroupSortable="hideGroupSortable" :parent="element" :key="element +'_' + key + '_group_sort'" :header="setting.header" :element="setting.header[element].group" />
            </span>
          </transition-group>
        </draggable>
      </sui-modal-content>
    </sui-modal>-->
  </sui-grid>
</template>
<script>

const defaultHeaderColumn = {
  text : '',
  width : '150',
  group : false,
  sort : false,
  show : true
};

import Column from './column'
import draggable from 'vuedraggable'
import sortableGroup from './sortablegroup'
export default {
  name : 'Grid',
  components : { Column , draggable, sortableGroup},
  props : ['data','row'],
  computed : {
    dataGrid : function(){
      let localData = {
        setting : {
          ...this.data.setting
        },
        header : {},
        filter : {},
        column : this.data.column,
      };

      //Нормализация объекта header
      let DefaultHeaderRow = {};

      for(let key in this.data.header){
        let el = this.data.header[key];
        DefaultHeaderRow[key] = {
          ...defaultHeaderColumn,
          ...el
        };
      }

      localData.header = DefaultHeaderRow;

      //Верхний уровень вложенности колонок
      let headerFistLevel = Object.keys(localData.header);
      for(let key in localData.header){
        if(localData.header[key].group){
          headerFistLevel = headerFistLevel.filter(x => !localData.header[key].group.includes(x));
        }
      }

      localData.setting.headerFistLevel = headerFistLevel;

      //Расчет ширины для header
      let headerWidth = localData.setting.contextMenu ? '40px ' : '';
      Object.keys(localData.header).forEach(el => {
        if(localData.header[el].show) {
          headerWidth += localData.header[el].width + 'px ';
        }
      });

      localData.setting.headerWidth = headerWidth;

      //Расчет ширины для колонок
      function generateWidth(header, key){
        let value = 0;
        header[key].group.forEach(el => {
          if(header[el].show)
            value += +header[el].width;

          if(header[el].group){
            value += +generateWidth(header,el)
          }
        });
        return value;
      }

      let columnWidth = localData.setting.contextMenu ? '40px ' : '';

      localData.setting.headerFistLevel.forEach(el => {
        let column = localData.header[el];
          if (column.group) {
            let val = column.show ? +column.width : 0;
            val += +generateWidth(localData.header,el);
            if(val > 0)
              columnWidth += +val + 'px ';
          } else {
            if(column.show)
              columnWidth += +column.width + 'px ';
          }
      });

      localData.setting.columnrWidth = columnWidth;



      for(let rowKey in this.row.column){
        for(let columnKey in this.row.column[rowKey]) {
          if(typeof this.row.column[rowKey][columnKey] == 'boolean'){
            this.row.column[rowKey][columnKey] = this.row.column[rowKey][columnKey] ? 'Да' : 'Нет';
          }
        }
      }

      for(let i = this.row.setting.contextElement.length;i--;){
        if(!('show' in this.row.setting.contextElement[i])){
          this.row.setting.contextElement[i].show = function(){
            return true;
          }
        }
      }

      return localData;
    },
  },
  data : function(){
    return {
      showSortColumn : false,
      setting_context : {
        show : false,
        type : null,
        element : null,
      },
      setting_sort : {
        key : null,
        direction : 'asc'
      },
      hideGroupSortable : []
    };
  },
  methods : {
    toggleShowSortableColumn : function(key){
      let index = this.hideGroupSortable.indexOf(key);
      if(index === -1)
        this.hideGroupSortable.push(key);
      else
        this.hideGroupSortable.splice(index,1);

      console.log(key,this.hideGroupSortable);
    },
    getSubData : function(){

    },
    scrollUpdate : function(e){
      this.$refs['body_table'].style.clipPath = 'inset(0 '+(-e.target.scrollLeft)+'px 0 '+e.target.scrollLeft+'px)';
      this.$refs['body_table'].style.left = -e.target.scrollLeft + 'px';
    },
    mainContext : function(e,row){
      let vector = e.currentTarget.getBoundingClientRect(),
          element = this.$refs['contextMenu'],
          self = this;

      document.body.addEventListener("mousedown", self.closeContextMenu);
      element.style.top = vector.y - this.setting.setting.contextMenuHeight + pageYOffset + 'px';
      element.style.left = vector.right + 'px';
      element.style.position = 'absolute';
      this.setting_context.element = row;
      this.setting_context.show = true;
    },
    closeContextMenu : function(e){
      if(this.$refs['contextMenu'].contains(e.target)) {
        return false;
      }else{
        this.setting_context.show = false;
        document.body.removeEventListener("mousedown", this.closeContextMenu);
      }
    },
    getGroupWidth : function(key){
      let value = 0;
      this.data.header[key].group.forEach(el => {
        if(this.data.header[el].show)
          value += +this.data.header[el].width;

        if(this.data.header[el].show && this.data.header[el].filter)
          value += +50;

        if(this.data.header[el].group){
          value += +this.getGroupWidth(el)
        }
      });
      return value;
    },
    showContextElement : function(action){
      return action.call(this,this.setting.column[this.setting_context.element]);
    },
    clickContext : function(action){
      action.call(this,this.setting.column[this.setting_context.element]);
      this.setting_context.show = false;
      document.body.removeEventListener("mousedown", this.closeContextMenu);
    },
    setSort : function(key){
      if(this.setting.header[key].sort) {
        if (this.setting_sort.key == key) {
          this.setting_sort.direction = this.setting_sort.direction == 'asc' ? 'desc' : 'asc';
        } else {
          this.setting_sort.key = key;
          this.setting_sort.direction = 'asc';
        }
      }
    },
    getGroupKey : function(key,element){
      if(element.indexOf(key) === -1)
        element.push(key);
      if(this.data.header[key].group){
        this.data.header[key].group.forEach(el => {
          if(element.indexOf(key) === -1)
            element.push(key);
            element = this.getGroupKey(el,element);
        });
      }
      return element;
    }
  },
  created() {
      console.log(this.headerMapKey,'headerMapKey');
  },
}
</script>

<style>
.sticky_field.show > .body_table_sticky > div{
  background: transparent;
}
.sticky_field.show > .body_table_sticky > div.sticky{
  background: #fff;
}
.scroll_wrapper{
  position: sticky !important;
  z-index: 1;
  top: 0;
  margin-top: 0px;
  overflow: auto;
}
.scroll_wrapper_hidden{
  clip-path: inset(0);
  position: relative;
  left: 0;
}
.scroll_wrapper_hidden > *{
  min-width: 0 !important;
}
.header_table{
  display: grid;
  grid-gap: 0vw;
}
.header_table *{
  cursor: context-menu;
  user-select: none;
}
.header_table > div{
  background: #eee;
  color: #000;
  padding: 10px;
  text-align: center;
  border-right: 1px solid #000;
  font-weight: bold;
  position: relative;
}
.header_table > div.sortable{
  cursor: pointer;
}
.header_table > div.sortable > i.caret{
  display: none;
}
.header_table > div.sortable:hover > i.caret,
.header_table > div.sortable > i.caret.show{
  display: inline-block;
}
.header_table i.filtered {
  position: absolute;
  font-size: 10px;
  width: 25px;
  right: 0;
  margin: 0;
  display: grid;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  height: 100%;
  top: 0;
  padding-top: 3px;
}
.header_table i.cog {
  cursor: pointer;
}
.header_table > div:last-child{
  border-right: 0;
}
.body_table{
  display: grid;
  grid-gap: 0vw;
}
.body_table i {
  cursor: pointer;
}
.body_table:last-child{
  border-bottom: 0;
}
.body_table > div.start_element{
  padding: 10px;
  text-align: center;
}
.body_table > div{
  border-right: 1px solid #000;
}
.body_table > div:not(.sub_body_column){
  border-bottom: 1px solid #000;
}
.body_table:last-child > div{
  border-bottom: 0;
}
.body_table > div:last-child{
  border-right: 0;
}
.sub_body_row > div:not(.sub_body_column){
  padding: 10px;
  text-align: center;
}
.sub_body_column > .sub_body_row > div:not(.sub_body_column){
  height: fit-content;
}
.body_table > .sub_body_column{
  border-left: 0;
}
.sub_body_column{
  display: grid;
  border-bottom: 1px solid #000;
  box-sizing: border-box;
  border-left: 1px solid #000;
}
.sub_body_column div{
  border-bottom: 0;
}
.sub_body_column .sub_body_row{
  border-bottom: 1px solid #000;
/*  height: 100%;*/
}
.sub_body_row .sub_body_column:first-child{
  border-left: 0;
}
.sub_body_column .sub_body_row:last-child{
  border-bottom: 0;
}
.sub_body_column .sub_body_row .value_element{
  border-bottom: 1px solid #000;
}
.sub_body_column .sub_body_row .value_element:last-child{
  border-bottom: 0;
}
.sub_body_row{
  /*border-left: 1px solid #000;*/
}
.body_table > .sub_body_column > .sub_body_row{
  border-left: 0;
}
.sticky{
  position: sticky;
  top : 49px;
}
.sortable_element{
  display: block;
}
.ui.modal > .content > .sortable_wrapper > .sortable_group > .sortable_element{
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  outline: 0;
  border: none;
  vertical-align: baseline;
  font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
  padding: 0;/*.78571429em 1.5em .78571429em;*/
  line-height: 1em;
  font-style: normal;
  text-align: center;
  text-decoration: none;
  user-select: none;
  background: transparent none!important;
  color: rgba(0,0,0,.6)!important;
  font-weight: 400;
  border-radius: .28571429rem;
  text-transform: none;
  text-shadow: none!important;
  box-shadow: 0 0 0 1px rgba(34,36,38,.15) inset;
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
}
.ui.modal > .content > .sortable_wrapper > .sortable_group > .sortable_element:last-child{
  margin-bottom: 0;
}
.sortable_element > .sortable_wrapper{
  border-top: 1px solid rgba(34,36,38,.15);
}
.sortable_group{
  display: block;
}
.sortable_element > .sortable_wrapper > .sortable_group{
  margin-left: 10px;
  border-left: 1px solid rgba(34,36,38,.15);
}
.sortable_element > .sortable_wrapper > .sortable_group > .sortable_element{
  border-bottom: 1px solid rgba(34,36,38,.15);
}
.sortable_element > .sortable_wrapper > .sortable_group > .sortable_element:last-child{
  border-bottom: 0;
}
.sortable_element .sortable_content{
  display: grid;
  padding: .78571429em;
  grid-template-columns: 55px 1fr 30px;
}
.sortable_element .name_column{
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
  margin-left: 10px;
  display: flex;
  align-self: center;
}
.sortable_content i,
.sortable_content .checkbox{
  display: grid !important;
  margin: auto !important;
}
.sortable_element .children_column{
  display: block;
  padding-left: 10px;
  padding-top: 5px;
}
.sortable_element.sortable-chosen.sortable-ghost *{
  background : #2185D0 !important;
}
.sortable_element.sortable-chosen.sortable-ghost *{
  color : #FFF !important;
}
</style>
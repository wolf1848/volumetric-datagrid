<template>
  <VueDraggableSortable v-model="value" v-bind="{animation: 200}" class="drag-wrapper">
    <transition-group type="transition">
      <div v-for="element in value" :key="element">
        <div class="sort-grid-item">
          <input type="checkbox" class="sort-grid-checkbox" :checked="parentShow && header[element].show" @click="visibleColumn($event,element)" />
          <label class="sort-grid-label">{{header[element].name}}</label>
          <i :class="['el-icon-arrow-down','sortable-icon',{'show' : visible[element]}]" v-if="element in virtualHeader.tree" @click="visibleTree(element)"></i>
        </div>
        <Sortable v-if="element in virtualHeader.tree" :grid="grid" :tree="element" v-show="visible[element]" :parentShow="header[element].show" />
      </div>
    </transition-group>
  </VueDraggableSortable>
</template>
<script>
import VueDraggableSortable from 'vuedraggable'
export default{
  name : 'Sortable',
  props : ['grid','tree','parentShow'],
  components : { VueDraggableSortable },
  computed : {
    header : function(){
      return this.$grid.getters['header'](this.grid);
    },
    virtualHeader : function(){
      return this.$grid.getters['virtualHeader'](this.grid);
    },
    value : {
      get : function() {
        return this.$grid.getters['virtualHeader'](this.grid).sortableTree[this.tree];
      },
      set : function(value){
        let update = [];
        value.forEach((el,i) => {
          update.push({key : el, params : {sort : i}});
        });
        this.$grid.dispatch('sortable', {name : this.grid,data : update});
      }
    },
  },
  data : function(){
    return {
      visible : {}
    };
  },
  methods : {
    visibleTree : function (key){
      this.visible[key] = !this.visible[key];
    },
    visibleColumn : function (e,key){
      this.$grid.dispatch('sortable', {name : this.grid,data : [{key : key, params : {show :e.target.checked}}]});
    }
  },
  created() {
    for(let key in this.virtualHeader.tree){
      if(key != 'root')
        this.$set(this.visible,key, false);
    }
  }
}
</script>
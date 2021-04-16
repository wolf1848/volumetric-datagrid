<template>

  <div class="sort-grid-body">
    <VueDraggableSortable :value="sortableHeader" :list="list" @input="test" v-bind="{animation: 200}">
      <transition-group type="transition">
        <div v-for="element in sortableHeader" :key="element.key">
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

</template>
<script>
import VueDraggableSortable from 'vuedraggable'
export default{
  name : 'Sortable',
  components : { VueDraggableSortable },
  computed : {
    sortableHeader : {
      get : function() {
        return this.$store.state.grid.setting.sortableHeader;
      },
      set : function(value){
        this.$store.dispatch('sortableHeaderReset',value)
      }
    },
  },
  data : function(){
    return {
      list : this.sortableHeader
    }
  },
  methods : {
    test : function(value){
      //this.list = value
      console.log(value,999);
    }

  }
}
</script>
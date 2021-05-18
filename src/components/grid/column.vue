<template>
    <div class="row-body">
      <template v-for="(column,key) in item">
        <div class="row-body" :style="[rowWidth]" v-if="'child' in column">
          <div class="column-body">
            <span>
              {{ column.value }}
            </span>
          </div>
          <template v-for="childKey in virtualHeader.tree[columnKey]">
          <Column
              :item="column.child[childKey]"
              :columnKey="childKey"
              :key="childKey"
              :grid="grid" />
          </template>
        </div>
        <div class="column-body" v-else>
          <span>
            {{ column.value }}
          </span>
        </div>
      </template>
    </div>
</template>
<script>
export default {
  name : 'Column',
  props : ['grid','item','columnKey'],
  computed : {
    virtualHeader : function(){
      return this.$store.getters['grid/virtualHeader'](this.grid);
    },
    rowWidth : function(){
      return {'grid-template-columns' : this.virtualHeader.treeWidth[this.columnKey]};
    }
  }
}
</script>
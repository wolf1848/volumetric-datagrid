<template>
  <div class="row-body" :style="[{'grid-template-columns' : virtualHeader.treeWidth.root},{width : virtualHeader.scrollWidth + 'px'}]">
    <div class="column-body">
        <span class="icon">
          <i class="el-icon-s-unfold" @click="$grid.commit('showContext',{name : grid,row : rowKey})"/>
          <portal-target v-if="context" name="grid-context" />
        </span>
    </div>

    <Column
        v-for="columnKey in virtualHeader.tree.root"
        :item="row[columnKey]"
        :columnKey="columnKey"
        :key="columnKey"
        :grid="grid" />

  </div>
</template>
<script>
import Column from './column'
export default {
  name : 'Row',
  props : ['grid','row','rowKey'],
  components : {Column},
  computed : {
    virtualHeader : function(){
      return this.$grid.getters['virtualHeader'](this.grid);
    },
    context : function(){
      return this.$grid.getters["context"](this.grid).row == this.rowKey ? true : false;
    }
  },
}
</script>
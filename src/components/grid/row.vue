<template>
  <div class="row-body" :style="[rowWidth]">
    <div class="column-body">
        <span>
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" ></path></svg>
        </span>
    </div>

    <Column v-for="(columnKey,i) in includeHeader" :item="row[columnKey]" :columnKey="columnKey" :key="columnKey" :grid="grid" />

  </div>
</template>
<script>
import Column from './column'
export default {
  name : 'Row',
  props : ['grid','row'],
  components : {Column},
  computed : {
    includeHeader : function(){
      return this.$store.getters.keyHeader(this.grid).filter(x => this.$store.getters.includeHeader(this.grid).includes(x));
    },
    rowWidth : function(){
      return {'grid-template-columns' :  this.$store.getters.setting(this.grid).columnWidth.row}
    }
  },
}
</script>
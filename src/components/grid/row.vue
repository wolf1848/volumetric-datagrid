<template>
  <div class="row-body" :style="[rowWidth]">
    <div class="column-body">
        <span>
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" ></path></svg>
        </span>
    </div>

    <Column v-for="(item,columnKey) in row" v-if="includeHeader.includes(columnKey)" :item="item" :columnKey="columnKey" :key="columnKey" />

  </div>
</template>
<script>
import Column from './column'
export default {
  name : 'Row',
  props : ['row'],
  components : {Column},
  computed : {
    includeHeader : function(){
      return this.$store.getters.gridSetting.includeHeader;
    },
    rowWidth : function(){
      return {'grid-template-columns' : this.$store.getters.columnWidth.row}
    }
  },
}
</script>
<template>
  <div class="row-body" :style="[{'grid-template-columns' : rowWidth}]">
    <div class="column-body">
        <span class="value sticky">
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" ></path></svg>
        </span>
    </div>

    <Column v-for="(item,columnKey) in row" v-if="gridSetting.includeHeader.includes(columnKey)" :item="item" :columnKey="columnKey" :key="columnKey" />

  </div>
</template>
<script>
import Column from './newcolumn'
export default {
  name : 'Row',
  props : ['row'],
  components : {Column},
  computed : {
    gridSetting : function(){
      return this.$store.getters.gridSetting;
    },
    gridHeader : function(){
      return this.$store.getters.gridHeader;
    },
    rowWidth : function(){
     return this.getWidth();
    }
  },
  data : function(){
    return {

    };
  },
  methods : {
    getWidth : function(){
      let str = this.gridSetting.minWidth + 'px ';
      for(let key in this.gridHeader){
        if(this.gridSetting.includeHeader.includes(key)) {
          if (this.gridHeader[key].child.length)
            str += +this.gridHeader[key].width + this.getChildWidth(key) + 'px ';
          else
            str += this.gridHeader[key].width + 'px ';
        }
      }
      return str;
    },
    getChildWidth : function(key){
      let w = 0;
      this.gridHeader[key].child.forEach(el => {
        if(this.gridHeader[el].child.length)
          w +=  +this.gridHeader[el].width + this.getChildWidth(el);
        else
          w += this.gridHeader[el].width;
      });
      return w;
    }
  }
}
</script>
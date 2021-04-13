<template>
  <div class="row-body" :style="[{'grid-template-columns' : headerWidth}]">
    <div class="column-body">
            <span class="value sticky">
              <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" ></path></svg>
            </span>

    </div>

    <Column v-for="(item,columnKey) in row" :item="item" :key="columnKey" />

  </div>
</template>
<script>
import Column from './newcolumn'
export default {
  name : 'Row',
  props : ['row'],
  components : {Column},
  computed : {
    headerWidth : function(){
     return this.getWidth();

    }
  },
  data : function(){
    return {

    };
  },
  methods : {
    getWidth : function(){
      let str = '60px ', grid = this.$parent.grid, exclude = [];
      for(let key in grid.header){
        if(!exclude.includes(key)) {

          if (grid.header[key].child.length) {
            let res = this.getChildWidth(key);
            str += +grid.header[key].width + res.width + 'px ';
            exclude = exclude.concat(res.exclude);
          } else
            str += grid.header[key].width + 'px ';

        }
      }
      return str;
    },
    getChildWidth : function(key){
      let w = 0, grid = this.$parent.grid, exclude = [key];
      grid.header[key].child.forEach(el => {
        if(grid.header[el].child.length){
          let res = this.getChildWidth(el);
          w +=  +grid.header[el].width + res.width;
          exclude = exclude.concat(res.exclude);
        }else {
          w += grid.header[el].width;
          exclude.push(el);
        }
      });
      return {width : w, exclude : exclude};
    }
  }
}
</script>
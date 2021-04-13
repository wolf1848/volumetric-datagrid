<template>
  <fragment>
    <div class="row-body" v-if="item.length > 1">
      <template v-for="(column,key) in item">
        <div class="row-body" :style="[{'grid-template-columns' : rowWidth}]" v-if="'child' in column">
          <div class="column-body">
            <span class="value sticky">
              {{ column.value }}
            </span>
          </div>
          <Column v-for="(child,childKey) in column.child" :item="child" :columnKey="childKey" :key="childKey" />
        </div>
        <div class="column-body" v-else>
          <span class="value sticky" :key="key">
            {{ column.value }}
          </span>
        </div>
      </template>
    </div>
    <template v-else>
      <template v-for="(column,key) in item">
        <div class="row-body" :style="[{'grid-template-columns' : rowWidth}]" v-if="'child' in column">
          <div class="column-body">
              <span class="value sticky">
                {{ column.value }}
              </span>
          </div>
          <Column v-for="(child,childKey) in column.child" :item="child" :columnKey="childKey" :key="childKey" />
        </div>
        <div class="column-body" v-else>
            <span class="value sticky" :key="key">
              {{ column.value }}
            </span>
        </div>
      </template>
    </template>
  </fragment>
</template>
<script>

export default {
  name : 'Column',
  props : ['item','columnKey'],
  computed : {
    gridHeader : function(){
      return this.$store.getters.gridHeader;
    },
    rowWidth : function(){
      return this.getWidth();
    }
  },
  data : function(){
    return {

    }
  },
  methods : {
    getWidth : function(){
      let str = this.gridHeader[this.columnKey].width + 'px ';
      this.gridHeader[this.columnKey].child.forEach(el => {
          if (this.gridHeader[el].child.length)
            str += +this.gridHeader[el].width + this.getChildWidth(el) + 'px ';
          else
            str += this.gridHeader[el].width + 'px ';
      })
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
<template>
    <div :class="{'sub_body_column' : column instanceof Array,start_element : !(column instanceof Array)}" v-if="showChildren(group)">
      <template  v-if="column instanceof Array">

        <template v-if="header[group].show && header[group].group">
          <div class="sub_body_row" :style="rowStyle" v-for="el in column">
            <template v-if="el.value instanceof Array">
              <div v-for="value in el.value" v-if="header[group].show" :class="['value_element']">{{value}}</div>
            </template>
            <div v-else-if="header[group].show" :class="['sticky']" v-html="el.value"></div>
            <Column v-for="sub_group in header[group].group"  v-if="showChildren(sub_group)" :column="el[sub_group]" :group="sub_group" :header="header" :key="group + '_' + sub_group + '_' + row_cnt" />
          </div>
        </template>

        <template v-else-if="header[group].show && !header[group].group">
          <div class="sub_body_row" :style="rowStyle" v-for="el in column">
            <template v-if="el.value instanceof Array">
              <div v-for="value in el.value" v-if="header[group].show" :class="['value_element']">{{value}}</div>
            </template>
            <div v-else-if="header[group].show" :class="['sticky']" v-html="el.value"></div>
          </div>
        </template>

        <template v-else-if="!header[group].show && header[group].group">
          <div class="sub_body_row" :style="rowStyle" v-for="el in column" data-test="12">
            <Column v-for="sub_group in header[group].group" v-if="showChildren(sub_group)" :column="el[sub_group]" :group="sub_group" :header="header" :key="group + '_' + sub_group + '_' + row_cnt" />
          </div>
        </template>

      </template>
      <template v-else>
        <div :class="['sticky']" v-if="header[group].show" v-html="column"></div>
      </template>
    </div>
</template>
<script>
export default{
  name : 'Column',
  props : ['column','group','header','row_cnt','row_class','row_width'],
  computed : {
    rowStyle : function(){
      if(!this.header[this.group].group){
        return {};
      }else{
        return {
          'grid-template-columns' : this.getGroupWidthStyle(this.group),
          display: 'grid'
        }
      }
    }
  },
  methods : {
    showChildren : function(key){
      let result = this.header[key].show;
      if(!result) {
        if (this.header[key].group) {
          this.header[key].group.forEach(el => {
            if(!result)
              result = this.showChildren(el);
          });
        }
      }
      return result;
    },
    getGroupWidthStyle : function(key){
      let value = 0, str = '', valueGroup = 0;
      if(this.header[key].show) {
        str = +this.header[key].width - 1 + (this.header[key].filter ? 50 : 0) + 'px ';
        valueGroup += +this.header[key].width;
      }else
        value = -1;
      this.header[key].group.forEach(el => {
        if(this.header[el].show) {
          value += +this.header[el].width;
          if(this.header[el].show && this.header[el].filter)
            value += +50;

          valueGroup += +value;
        }
        if(this.header[el].group){
          value += +this.getGroupWidthCount(el);
          valueGroup += +value;
        }

        if(value > 0) {
          str += +value + 'px ';
          value = 0;
        }
      });

      return str;

    },
    getGroupWidthCount : function(key){
      let value = 0;

      this.header[key].group.forEach(el => {
        if(this.header[el].show)
          value += +this.header[el].width;

        if(this.header[el].show && this.header[el].filter)
          value += +50;

        if(this.header[el].group){
          value += +this.getGroupWidthCount(el);
        }
      });

      return value;

    }
  }
}
</script>
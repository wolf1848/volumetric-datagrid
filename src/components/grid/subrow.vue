<template>
  <div class="row-body" :style="[{'grid-template-columns' : headerWidth}]">

    <Column v-for="(item,columnKey) in row" v-if="includeHeader.includes(columnKey)" :item="item" :key="columnKey" />

  </div>
</template>
<script>
export default {
  name : 'SubRow',
  data : function(){
    return {

    };
  }
}
</script>
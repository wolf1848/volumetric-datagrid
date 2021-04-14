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
    rowWidth : function(){
      return this.$store.getters.gridSetting.columnWidth[this.columnKey];
    },

  },
  data : function(){
    return {

    }
  }
}

</script>
<template>
  <fragment>
    <div class="row-body" v-if="item.length > 1">
      <template v-for="(column,key) in item">
        <div class="row-body" :style="[rowWidth]" v-if="'child' in column">
          <div class="column-body">
            <span>
              {{ column.value }}
            </span>
          </div>
          <Column v-for="(child,childKey) in column.child" :item="child" :columnKey="childKey" :key="childKey" />
        </div>
        <div class="column-body" v-else>
          <span :key="key">
            {{ column.value }}
          </span>
        </div>
      </template>
    </div>
    <template v-else>
      <template v-for="(column,key) in item">
        <div class="row-body" :style="[rowWidth]" v-if="'child' in column">
          <div class="column-body">
              <span>
                {{ column.value }}
              </span>
          </div>
          <Column v-for="(child,childKey) in column.child" :item="child" :columnKey="childKey" :key="childKey" />
        </div>
        <div class="column-body" v-else>
            <span :key="key">
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
      return {'grid-template-columns' : this.$store.getters.gridSetting.columnWidth[this.columnKey]};
    },

  }
}
</script>
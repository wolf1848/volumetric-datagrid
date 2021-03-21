<template>
  <draggable v-model="header[parent].group" :class="'sortable_wrapper'">
    <transition-group :class="'sortable_group'">
        <span class="sortable_element" v-for="(item,key) in element" :key="key+'_sortable'">
          <span class="sortable_content">
            <span class="checkbox"><sui-checkbox v-model="header[item].show" /></span>
            <span class="name_column">{{header[item].text}}</span>
            <template v-if="header[item].group">
              <sui-icon @click="$emit('toggleShowSortableColumn',item)" name="plus" v-if="hideGroupSortable.indexOf(item) < 0"/>
              <sui-icon @click="$emit('toggleShowSortableColumn',item)" name="minus" v-else/>
            </template>
          </span>
          <sortableGroup v-if="header[item].group && hideGroupSortable.indexOf(item) >= 0"
                         v-on:toggleShowSortableColumn="listen($event)"
                         :hideGroupSortable="hideGroupSortable" :parent="item" :key="item +'_' + key + '_group_sort'" :header="header" :element="header[item].group" />
        </span>
    </transition-group>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'
export default{
  name : 'sortableGroup',
  components : { draggable },
  props : ['header','element','parent','hideGroupSortable'],
  methods : {
    listen : function(e){
      this.$emit('toggleShowSortableColumn',e);
    }
  }
}
</script>
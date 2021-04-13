<template>
  <fragment>
    <div class="column-body">
        <span class="value sticky">
          {{ item.value }}
        </span>
    </div>
  </fragment>
</template>
<script>

export default {
  name : 'Column',
  props : ['item'],
  data : function(){
    return {

    }
  }
}

</script>
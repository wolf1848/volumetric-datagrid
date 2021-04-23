<template>
  <el-button-group>
    <el-button @click="first"
                :disabled="hasFirst"
                :class="`${hasFirst ? paginationClasses.buttonDisable : ''}`"
                :icon="'el-icon-d-arrow-left'"
    />
    <el-button @click="prev"
                :disabled="hasFirst"
                :class="`${hasFirst ? paginationClasses.buttonDisable : ''}`"
                :icon="'el-icon-arrow-left'"
    />
    <el-button v-show="rangeFirstPage !== 1"
                @click="goto(1)"
                :class="paginationClasses.button"
    >1</el-button>
    <el-button v-show="rangeFirstPage === 3"
                @click="goto(2)"
                :class="paginationClasses.button"
    >2</el-button>
    <el-button v-show="rangeFirstPage !== 1 && rangeFirstPage !== 2 && rangeFirstPage !== 3"
                :class="`${paginationClasses.buttonDisable}`"
                icon="el-icon-more"
                style="cursor:auto;color : black !important;"
    />
    <!-- range start -->
    <template v-for="page in range">
      <el-button basic
                  :key="page"
                  @click="goto(page)"
                  :class="`${hasActive(page) ? paginationClasses.buttonActive : ''}`"
      >{{page}}</el-button>
    </template>
    <!-- range end -->
    <el-button v-show="rangeLastPage !== pageCount && rangeLastPage !== (pageCount - 1) && rangeLastPage !== (pageCount - 2)"
                :class="`${paginationClasses.buttonDisable}`"
                icon="el-icon-more"
                style="cursor:auto;color : black !important;"
    />
    <el-button v-show="rangeLastPage === (pageCount - 2)" @click="goto(pageCount - 1)"
                basic
    >{{(pageCount - 1)}}</el-button>
    <el-button v-if="rangeLastPage !== pageCount"
                @click="goto(pageCount)"
                basic
    >{{pageCount}}</el-button>
    <el-button @click="next"
                :disabled="hasLast"
                :class="`${hasLast ? paginationClasses.buttonDisable : ''}`"
                :icon="'el-icon-arrow-right'"
                basic
    />
    <el-button @click="last"
                :disabled="hasLast"
                :class="`${hasLast ? paginationClasses.buttonDisable : ''}`"
                :icon="'el-icon-d-arrow-right'"
                basic
    />
    <el-button style="cursor:auto;font-weight: bold">Перейти : </el-button>
    <el-button style="padding: 0">
      <input style="border: 0;outline: none;height: 100%;width: 40px;text-align: center" type="text" v-model="write" />
    </el-button>
    <el-button basic icon="arrow right" @click="goto(+write)"/>
    </el-button-group>
</template>

<script>
const rangeMax = 3;
const defaultClasses = {
  buttonActive: 'active',
};

export default {
  props: {
    value: {  // current page
      type: Number,
      required: true
    },
    pageCount: { // page numbers
      type: Number,
      required: true
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    },
    labels: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data() {
    return {
      write : 1,
      paginationClasses: {
        ...defaultClasses,
        ...this.classes
      },
    }
  },

  mounted() {
    if (this.value > this.pageCount) {
      this.$emit('input', this.pageCount);
    }
  },

  computed: {
    rangeFirstPage() {
      if (this.value === 1) {
        return 1;
      }

      if (this.value === this.pageCount) {
        if ((this.pageCount - rangeMax) < 0) {
          return 1;
        }
        else {
          return this.pageCount - rangeMax + 1;
        }
      }

      return (this.value - 1);
    },

    rangeLastPage() {
      return Math.min(this.rangeFirstPage + rangeMax - 1, this.pageCount);
    },

    range() {
      let rangeList = [];
      for (let page = this.rangeFirstPage; page <= this.rangeLastPage; page+= 1) {
        rangeList.push(page);
      }
      return rangeList;
    },

    hasFirst() {
      return (this.value === 1);
    },

    hasLast() {
      return (this.value === this.pageCount);
    },
  },

  watch: {
    value: function (v) {
      this.write = v
      this.$emit('change');
    }
  },

  methods: {
    first() {
      if (!this.hasFirst) {
        this.$emit('input', 1);
      }
    },

    prev() {
      if (!this.hasFirst) {
        this.$emit('input', (this.value - 1));
      }
    },

    goto(page) {
      this.$emit('input', page);
    },

    next() {
      if (!this.hasLast) {
        this.$emit('input', (this.value + 1));
      }
    },

    last() {
      if (!this.hasLast) {
        this.$emit('input', this.pageCount);
      }
    },

    hasActive(page) {
      return (page === this.value);
    },
  }
}
</script>
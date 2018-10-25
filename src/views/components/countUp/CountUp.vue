<template>
  <span >
    {{startVal}}
  </span>
</template>

<script>
import CountUp from "countup";

export default {
  name: "count-up",
  props: {
    startVal: {
      type: Number,
      default: 0
    },
    endVal: {
      type: Number,
      default: 0
    },
    decimals: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2
    },
    delay: {
      type: Number,
      default: 100
    },
    options: {
      type: Object,
      default: () => {
        return {
          useEasing: true,
          useGrouping: true,
          separator: ",",
          decimal: "."
        };
      }
    }
  },
  data() {
    return {
      count: {}
    };
  },
  mounted() {
    // console.log(this.$el)
    this.$nextTick(() => {
      setTimeout(() => {
        this.count = new CountUp(
          this.$el,
          this.startVal,
          this.endVal,
          this.decimals,
          this.duration,
          this.options
        );
        if (!this.count.error) {
          this.count.start();
        }
      }, this.delay);
    });
  },
  watch: {
    endVal(val) {
      setTimeout(() => {
        this.count.update(val);
      }, this.delay + 10);
    }
  }
};
</script>
<style>
</style>

<template>
  <div ref="self" class="boxMover" :style="style">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    pointer: {
      type: Object,
    },
  },
  computed: {
    style() {
      const rect = this.$refs.self?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };
      let _style = `top:${this.pointer.y - rect.height / 2}px;left:${
        this.pointer.x - rect.width / 2
      }px;`;
      return _style;
    },
  },
  methods: {
    getRect() {
      return this.$refs.self.getBoundingClientRect();
    },
  },
};
</script>
<style lang="scss" scoped>
.boxMover {
  position: absolute;
  border: 1px solid blue;
}
</style>
<template>
  <div
    class="box"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @mousemove="mouseMove"
    @mouseout="mouseOut"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    @dblclick="doubleClick"
    @click="click"
  >
    <slot></slot>
  </div>
</template>
<script>
export const EVENTS = {
  ENTER: "enter",
  LEAVE: "leave",
  MOVE: "move",
  OUT: "out",
  UP: "up",
  DOWN: "down",
  CLICK: "click",
  DOUBLECLICK: "doubleclick",
};
export default {
  methods: {
    mouseEnter(e) {
      this.$emit("callback", {
        type: EVENTS.ENTER,
        value: e,
      });
    },
    mouseLeave(e) {
      this.$emit("callback", {
        type: EVENTS.LEAVE,
        value: e,
      });
    },
    mouseMove(e) {
      this.$emit("callback", {
        type: EVENTS.MOVE,
        value: e,
      });
    },
    mouseOut(e) {
      this.$emit("callback", {
        type: EVENTS.OUT,
        value: e,
      });
    },
    mouseDown(e) {
      this.$emit("callback", {
        type: EVENTS.DOWN,
        value: e,
      });
    },
    mouseUp(e) {
      this.$emit("callback", {
        type: EVENTS.UP,
        value: e,
      });
    },
    doubleClick(e) {
      this.$emit("callback", {
        type: EVENTS.DOUBLECLICK,
        value: e,
      });
    },
    click(e) {
      this.$emit("callback", {
        type: EVENTS.CLICK,
        value: e,
      });
    },
  },
};
</script>
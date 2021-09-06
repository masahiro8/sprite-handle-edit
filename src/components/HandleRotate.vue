<template>
  <!-- イベント実装 -->
  <div :style="getCenter">
    <div
      :style="
        `position:absolute;left:${0 - 8}px;top:${0 -
          8}px;width:16px;height:16px;background-color:green;z-index:99;`
      "
    ></div>
    <EventWrapper @callback="callbackEvent" :style="getHandlePos">
      <div class="box"></div>
    </EventWrapper>
  </div>
</template>
<script>
  import EventWrapper, { EVENTS } from "./core/EventWrapper.vue";

  export const ROTATE_EVENT_STATUS = {
    START: "start",
    MOVE: "move",
    STOP: "stop",
  };

  export default {
    name: "DraggableBox",
    data: () => {
      return {
        status: ROTATE_EVENT_STATUS.STOP,
        pointer: { x: null, y: null },
        isEnter: false,
        isDown: false,
        startDeg: 0,
      };
    },
    props: {
      center: {
        type: Object,
        default: () => {
          return { x: 0, y: 0 };
        },
      },
      handelPosition: {
        type: Array,
      },
      scale: {
        type: Number,
      },
      rotate: {
        type: Number,
      },
      callback: {
        type: Function,
      },
      index: {
        type: Number,
        default: 0,
      },
    },
    components: {
      EventWrapper,
    },
    mounted() {
      this.initPointerEvent();
    },
    beforeDestroy() {
      this.destroyPointerEvent();
    },
    computed: {
      getCenter() {
        // 位置を変更
        return `position:fixed;left:${this.center.x}px;top:${this.center.y}px;z-index:199;`;
      },
      getHandlePos() {
        const r = this.handelPosition[3].y - this.handelPosition[0].y;
        return `position:absolute;left:${0 - 12}px;top:${-r - 12}px;`;
      },
    },
    methods: {
      initPointerEvent() {
        // マウス移動イベントを追加
        window.addEventListener("mousemove", this.pointerEvent);
        window.addEventListener("mouseup", this.forceDragEnd);
      },
      destroyPointerEvent() {
        // マウス移動イベントを削除
        window.removeEventListener("mousemove", this.pointerEvent);
        window.removeEventListener("mouseup", this.forceDragEnd);
      },
      pointerEvent(e) {
        this.pointer = {
          x: e.clientX,
          y: e.clientY,
        };
        // Dragging
        if (this.isDown && this.isEnter) {
          this.Dragging();
        }
      },
      callbackEvent({ type }) {
        if (type === EVENTS.ENTER) this.isEnter = true;
        if (type === EVENTS.DOWN) this.isDown = true;
        if (type === EVENTS.UP) this.isDown = false;

        // DragStart
        if (type === EVENTS.DOWN && this.isEnter) {
          this.DragStart();
        }

        // DragEnd
        if (!this.isDown) {
          this.DragEnd();
        }
      },

      DragStart() {
        this.startDeg =
          (Math.atan2(
            this.pointer.y - this.center.y,
            this.pointer.x - this.center.x
          ) *
            180) /
          Math.PI;
        this.status = ROTATE_EVENT_STATUS.START;
        this.callback(this.status, 0);
        console.log("Rotate start", this.startDeg);
      },

      Dragging() {
        const deg =
          (Math.atan2(
            this.pointer.y - this.center.y,
            this.pointer.x - this.center.x
          ) *
            180) /
          Math.PI;

        this.status = ROTATE_EVENT_STATUS.MOVE;
        this.callback(this.status, deg - this.startDeg);
      },

      DragEnd() {
        if (this.status === ROTATE_EVENT_STATUS.MOVE) {
          console.log("Rotate End");
          this.status = ROTATE_EVENT_STATUS.STOP;
          this.callback(this.status, null);
        }
      },
      forceDragEnd() {
        this.isDown = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .box {
    width: 24px;
    height: 24px;
    background-color: black;
    border-radius: 12px;
    &:hover {
    }
  }
</style>

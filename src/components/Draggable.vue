<template>
  <!-- 動き実装 -->
  <Mover ref="box" :pointer="convPointer">
    <!-- イベント実装 -->
    <EventWrapper @callback="callbackEvent">
      <slot></slot>
    </EventWrapper>
  </Mover>
</template>
<script>
import EventWrapper, { EVENTS } from "./core/EventWrapper.vue";
import Mover from "./core/Mover.vue";
import { DeepCopy } from "@/util/Util.js";
import { matrix3x3 } from "@/util/Matrix3x3.js";

const convertLocalPosition = (scale, transVec2, initVec2) => {
  let translationMatrix = [
    [scale, 0, transVec2.x],
    [0, scale, transVec2.y],
    [0, 0, 1],
  ];

  const result = matrix3x3(translationMatrix, {
    x: initVec2.x,
    y: initVec2.y,
    z: 1,
  });

  return {
    x: result.x,
    y: result.y,
  };
};

export default {
  name: "DraggableBox",
  data: () => {
    return {
      pointer: { x: null, y: null },
      isEnter: false,
      isDown: false,
      transform: { scale: 1.0 },
      initVec2: { x: null, y: null },
      startVec2: { x: null, y: null },
      convPointer: { x: null, y: null },
    };
  },
  props: {
    scale: {
      type: Number,
    },
    // ローカル座標の初期値
    position: {
      type: Object,
      default: () => {
        return { x: 0, y: 0 };
      },
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
    Mover,
  },
  mounted() {
    this.initPointerEvent();
    this.initPosition();

    this.$watch(
      () => this.scale,
      (newValue) => {
        const transform = { ...this.transform };
        transform.scale = newValue;
        this.transform = transform;
        console.log("transform", this.transform);
      },
      {
        immediate: true,
      }
    );

    this.$watch(
      () => this.position,
      (newValue) => {
        this.convPointer = {
          x: newValue.x,
          y: newValue.y,
        };
      },
      {
        immediate: true,
        deep: true,
      }
    );
  },
  beforeDestroy() {
    this.destroyPointerEvent();
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
    callbackEvent({ type, value }) {
      if (type === EVENTS.ENTER) this.isEnter = true;
      if (type === EVENTS.DOWN) this.isDown = true;
      if (type === EVENTS.UP) this.isDown = false;
      // if (type === EVENTS.OUT) this.isDown = false;

      // DragStart
      if (type === EVENTS.DOWN && this.isEnter) {
        this.DragStart();
      }
    },

    initPosition() {
      this.convPointer = {
        x: this.position.x,
        y: this.position.y,
      };
    },

    DragStart() {
      console.log("start draggable");
      this.startVec2 = DeepCopy(this.pointer);

      const box = this.$refs.box.$el;
      const lbox = window.getComputedStyle(box, null);
      const top = +lbox.getPropertyValue("top").replace("px", "");
      const left = +lbox.getPropertyValue("left").replace("px", "");
      const width = +lbox.getPropertyValue("width").replace("px", "");
      const height = +lbox.getPropertyValue("height").replace("px", "");

      this.initVec2 = {
        x: left + width / 2,
        y: top + height / 2,
      };
      // console.log("box", { ...this.initVec2 });
    },

    Dragging() {
      const transVec2 = {
        x: this.pointer.x - this.startVec2.x,
        y: this.pointer.y - this.startVec2.y,
      };
      //座標変換
      const { x, y } = convertLocalPosition(
        1.0 / this.transform.scale,
        { x: 0, y: 0 },
        transVec2
      );
      this.convPointer = {
        x: this.initVec2.x + x,
        y: this.initVec2.y + y,
      };

      if (this.callback) {
        this.callback(this.index, this.convPointer);
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
  min-width: 72px;
  min-height: 72px;
}
</style>
<template>
  <!-- 動き実装 -->
  <Mover ref="box" :pointer="convPointer">
    <!-- イベント実装 -->
    <EventWrapper @callback="callbackEvent">
      <!-- refを設定しても取得できない -->
      <div class="box"></div>
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
    parentRect: {
      type: Object,
      default: () => {
        return { x: 0, y: 0 };
      },
    },
    scale: {
      type: Number,
    },
  },
  components: {
    EventWrapper,
    Mover,
  },
  mounted() {
    this.initPointerEvent();

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
  },
  beforeDestroy() {
    this.destroyPointerEvent();
  },
  methods: {
    initPointerEvent() {
      window.addEventListener("mousemove", this.pointerEvent);
    },
    destroyPointerEvent() {
      window.removeEventListener("mousemove", this.pointerEvent);
    },
    getPosition() {
      console.log(
        "pos",
        this.parentRect.x,
        this.$refs.box.$el.getBoundingClientRect()
      );
      console.log("parentRect", this.parentRect.x);
    },
    pointerEvent(e) {
      this.pointer = {
        x: e.clientX - this.parentRect.x,
        y: e.clientY - this.parentRect.y,
      };
      // Dragging
      if (this.isDown && this.isEnter) {
        // this.Dragging();
        this.convPointer = DeepCopy(this.pointer);
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

    DragStart() {
      console.log("start");
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
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 16px;
  height: 16px;
  border: 1px solid red;
  background-color: white;
}
</style>
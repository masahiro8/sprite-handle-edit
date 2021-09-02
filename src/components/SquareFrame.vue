<template>
  <Draggable
    :enable="dragEventType === DRAG_EVENT.MOVE"
    :position="nPosition"
    :scale="scale"
    :callback="dragCallback"
  >
    <div ref="self" class="self">
      <HandleBox
        v-for="(value, index) in handelPosition"
        ref="handle"
        :key="index"
        :index="index"
        :position="handelPosition[index]"
        :scale="scale"
        :callback="callback"
      />
      <div ref="wrapper" class="wrapper" :style="getRectangleStyle()">
        <slot></slot>
      </div>
    </div>
  </Draggable>
</template>
<script>
import Draggable from "@/components/Draggable.vue";
import HandleBox from "./HandleBox.vue";
import { DeepCopy } from "@/util/Util.js";
import { matrix3x3 } from "@/util/Matrix3x3.js";

const DRAG_EVENT = {
  SCALE: "scale",
  MOVE: "move",
};

const getLocalRect = (el) => {
  const lbox = window.getComputedStyle(el, null);
  const top = 0;
  const left = 0;
  const width = +lbox.getPropertyValue("width").replace("px", "");
  const height = +lbox.getPropertyValue("height").replace("px", "");
  return {
    left,
    top,
    width,
    height,
  };
};

export default {
  data: () => {
    return {
      DRAG_EVENT,
      initialized: false,
      self: null,
      wrapper: null,
      handelPosition: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      nPosition: {},
      localPosition: {},
      dragEventType: null,
    };
  },
  props: {
    position: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0,
        };
      },
    },
    scale: {
      type: Number,
      default: 1.0,
    },
  },
  components: {
    HandleBox,
    Draggable,
  },
  mounted() {
    this.self = this.$refs.self.$el;
    this.wrapper = this.$refs.wrapper;
    this.$nextTick(() => {
      this.init();
    });

    this.$watch(
      () => this.position,
      (newValue) => {
        this.nPosition = newValue;
        this.localPosition = matrix3x3(
          [
            [1 / this.scale, 0, 0],
            [0, 1 / this.scale, 0],
            [0, 0, 1],
          ],
          { ...newValue, z: 1 }
        );
      },
      {
        immediate: true,
        deep: true,
      }
    );
  },
  computed: {},
  methods: {
    getRectangleStyle() {
      if (!this.initialized) return "";
      const pos = DeepCopy(this.handelPosition);
      let style = "";
      style += `left:${pos[0].x}px;`;
      style += `top:${pos[0].y}px;`;
      style += `width:${pos[2].x - pos[0].x}px;`;
      style += `height:${pos[2].y - pos[0].y}px;`;
      return style;
    },
    updateWrapperStyle() {
      const vec2 = DeepCopy({
        x: this.handelPosition[0].x,
        y: this.handelPosition[0].y,
        z: 1,
      });

      const handelPosition = DeepCopy(this.handelPosition).map((item) => {
        return {
          x: item.x - vec2.x,
          y: item.y - vec2.y,
        };
      });

      const nPosition = matrix3x3(
        [
          [this.scale, 0, 0],
          [0, this.scale, 0],
          [0, 0, 1],
        ],
        { ...this.localPosition, z: 1 }
      );

      this.nPosition = {
        x: nPosition.x + vec2.x,
        y: nPosition.y + vec2.y,
      };

      this.$nextTick(() => {
        this.handelPosition = handelPosition;
      });

      console.log(
        "update",
        { ...this.nPosition },
        { ...vec2 },
        { ...handelPosition[0] },
        { ...this.handelPosition[0] }
      );
    },
    init() {
      const { left, top, width, height } = getLocalRect(this.wrapper);
      console.log(left, top, width, height);
      this.handelPosition = [
        { x: left, y: top },
        { x: left + width, y: top },
        { x: left + width, y: top + height },
        { x: left, y: top + height },
      ];
      this.initialized = true;
    },
    callback(index, { x, y }) {
      console.log("scale", index);
      // 停止
      if (index === null) {
        this.dragEventType = DRAG_EVENT.MOVE;
        this.updateWrapperStyle();
        return;
      }

      this.dragEventType = DRAG_EVENT.SCALE;
      if (index === 0) {
        this.handelPosition[0].x = x;
        this.handelPosition[0].y = y;
        this.handelPosition[1].x = this.handelPosition[2].x;
        this.handelPosition[1].y = y;
        this.handelPosition[3].x = x;
        this.handelPosition[3].y = this.handelPosition[2].y;
      } else if (index === 1) {
        this.handelPosition[0].y = this.handelPosition[2].x = x;
      } else if (index === 2) {
        this.handelPosition[1].x = x;
        this.handelPosition[1].y = this.handelPosition[0].y;
        this.handelPosition[2].x = x;
        this.handelPosition[2].y = y;
        this.handelPosition[3].x = this.handelPosition[0].x;
        this.handelPosition[3].y = y;
      } else if (index === 3) {
        this.handelPosition[2].y = y;
        this.handelPosition[0].x = x;
      }
    },
    dragCallback(index, { x, y }) {
      console.log("dragCallback ", index, x, y);
      this.localPosition = { x, y };
      this.nPosition = matrix3x3(
        [
          [this.scale, 0, 0],
          [0, this.scale, 0],
          [0, 0, 1],
        ],
        { x, y, z: 1 }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.self {
  border: 2px dashed green;
  position: relative;
}
.wrapper {
  position: relative;
  display: inline-block;
  border: 1px solid red;
}
.rectangle {
  position: relative;
  display: inline-block;
  border: 1px dashed blue;
}
</style>
<template>
  <div class="self" :style="getSelfStyle">
    <HandleBox
      v-for="(value, index) in handelPosition"
      ref="handle"
      :key="index"
      :index="index"
      :position="handelPosition[index]"
      :scale="scale"
      :rotate="transform.rotate"
      :callback="callback"
    />
    <EventWrapper @callback="DragCallbackEvent">
      <div ref="wrapper" class="wrapper" :style="wrapperStyle()">
        <slot></slot>
      </div>
    </EventWrapper>
  </div>
</template>
<script>
  import EventWrapper, { EVENTS } from "./core/EventWrapper.vue";
  import HandleBox from "./HandleBox.vue";
  import { DeepCopy } from "@/util/Util.js";
  import { Affin } from "@/util/Affin.js";

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
        initialized: false,
        wrapper: null,
        handelPosition: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],

        // draggable
        pointer: { x: null, y: null },
        isEnter: false,
        isDown: false,

        startVec2: { x: null, y: null },
        startHandlePosition: [],
        convPointer: { x: null, y: null },
      };
    },
    props: {
      scale: {
        type: Number,
        default: 1.0,
      },
      // ローカル座標の初期値
      transform: {
        type: Object,
      },
      enable: {
        type: Boolean,
        default: true,
      },
    },
    components: {
      HandleBox,
      EventWrapper,
    },
    computed: {
      getSelfStyle() {
        return `transform:rotate(${this.transform.rotate}deg);`;
      },
    },

    mounted() {
      this.wrapper = this.$refs.wrapper;

      this.$nextTick(() => {
        this.init();
      });

      this.initPointerEvent();
    },

    beforeDestroy() {
      this.destroyPointerEvent();
    },

    methods: {
      initPointerEvent() {
        // マウス移動イベントを追加
        window.addEventListener("mousemove", this.DragPointerEvent);
        window.addEventListener("mouseup", this.DragForceDragEnd);
      },
      destroyPointerEvent() {
        // マウス移動イベントを削除
        window.removeEventListener("mousemove", this.DragPointerEvent);
        window.removeEventListener("mouseup", this.DragForceDragEnd);
      },
      /**
       * ドラッグイベント
       */
      DragPointerEvent(e) {
        if (!this.enable) return;
        this.pointer = {
          x: e.clientX,
          y: e.clientY,
        };
        // Dragging
        if (this.isDown && this.isEnter) {
          this.Dragging();
        }
      },
      DragForceDragEnd() {
        this.isDown = false;
      },
      DragCallbackEvent({ type }) {
        if (!this.enable) return;
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
        this.startVec2 = DeepCopy(this.pointer);
        this.startHandlePosition = DeepCopy(this.handelPosition);
      },

      Dragging() {
        const transVec2 = {
          x: this.pointer.x - this.startVec2.x,
          y: this.pointer.y - this.startVec2.y,
        };

        const { x, y } = Affin(
          1.0 / this.scale,
          this.transform.rotate,
          {
            x: 0,
            y: 0,
          },
          transVec2
        );

        this.handelPosition = DeepCopy(this.startHandlePosition).map((item) => {
          return {
            x: item.x + x,
            y: item.y + y,
          };
        });

        // if (this.callback) {
        //   this.callback(this.index, this.convPointer);
        // }
      },

      /**
       * ハンドルイベント
       */
      wrapperStyle() {
        if (!this.initialized) return "";
        const pos = DeepCopy(this.handelPosition);
        let style = "";
        style += `left:${pos[0].x}px;`;
        style += `top:${pos[0].y}px;`;
        style += `width:${pos[2].x - pos[0].x}px;`;
        style += `height:${pos[2].y - pos[0].y}px;`;
        return style;
      },
      init() {
        if (
          this.transform &&
          "width" in this.transform &&
          "height" in this.transform
        ) {
          const { x, y, width, height } = this.transform;
          this.handelPosition = [
            { x: x, y: y },
            { x: x + width, y: y },
            { x: x + width, y: y + height },
            { x: x, y: y + height },
          ];
        } else {
          const { left, top, width, height } = getLocalRect(this.wrapper);
          console.log(left, top, width, height);
          this.handelPosition = [
            { x: left, y: top },
            { x: left + width, y: top },
            { x: left + width, y: top + height },
            { x: left, y: top + height },
          ];
        }

        this.initialized = true;
      },
      callback(index, { x, y }) {
        if (index === 0) {
          this.handelPosition[0].x = x;
          this.handelPosition[0].y = y;
          this.handelPosition[1].x = this.handelPosition[2].x;
          this.handelPosition[1].y = y;
          this.handelPosition[3].x = x;
          this.handelPosition[3].y = this.handelPosition[2].y;
          console.log("move", x, y);
        } else if (index === 1) {
          this.handelPosition[0].y = y;
          this.handelPosition[1].x = x;
          this.handelPosition[1].y = y;
          this.handelPosition[2].x = x;
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
          this.handelPosition[3].x = x;
          this.handelPosition[4].y = y;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .self {
    border: 2px dashed green;
    position: relative;
    width: 32px;
    height: 32px;
    // transform: rotate(30deg);
  }
  .wrapper {
    position: absolute;
    display: inline-block;
    border: 1px solid red;
  }
</style>

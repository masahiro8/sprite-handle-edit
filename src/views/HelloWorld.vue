<template>
  <div ref="stage" class="stage" :style="stageStyle">
    <DraggableBox :position="position" :scale="scale" />
    <SquareHandle :scale="scale">
      <div
        style="
          width: 100%;
          height: 100%;
          min-width: 64px;
          min-height: 64px;
          background-color: blue;
        "
      ></div>
    </SquareHandle>
  </div>
</template>

<script>
import DraggableBox from "@/components/DraggableBox.vue";
import SquareHandle from "@/components/SquareHandle.vue";
export default {
  name: "HelloWorld",
  data: () => {
    return {
      stage: null,
      scale: 0.7,
      position: {
        x: 30,
        y: 30,
      },
    };
  },
  props: {},
  components: {
    DraggableBox,
    SquareHandle,
  },
  mounted() {
    if (this.$refs.stage) this.stage = this.$refs.stage;
  },
  computed: {
    stageRect() {
      if (!this.stage) return {};
      return this.stage.getBoundingClientRect();
    },
    stageStyle() {
      return `transform:scale(${this.scale});`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.stage {
  position: relative;
  width: 800px;
  height: 400px;
  border: 1px solid green;
  /* transform: scale(0.8); */
}
</style>

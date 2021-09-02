<template>
  <div ref="stage" class="stage" :style="stageStyle">
    <!-- <HandleBox :position="position" :scale="scale" /> -->
    <!-- <Draggable :position="position" :scale="scale"> </Draggable> -->
    <!--  -->
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

    <SquareFrame :position="position" :scale="scale">
      <div
        style="
          width: 100%;
          height: 100%;
          min-width: 64px;
          min-height: 64px;
          background-color: blue;
        "
      ></div>
    </SquareFrame>
  </div>
</template>

<script>
// import HandleBox from "@/components/HandleBox.vue";
// import Draggable from "@/components/Draggable.vue";
import SquareHandle from "@/components/SquareHandle.vue";
import SquareFrame from "@/components/SquareFrame.vue";
export default {
  name: "HelloWorld",
  data: () => {
    return {
      stage: null,
      scale: 0.7,
      position: {
        x: 130,
        y: 130,
      },
    };
  },
  props: {},
  components: {
    // Draggable,
    SquareHandle,
    SquareFrame,
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

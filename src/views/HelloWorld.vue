<template>
  <div ref="stage" class="stage" :style="stageStyle">
    <!--  -->
    <SquareHandleMove :transform="transform" :scale="scale">
      <div
        style="
          width: 100%;
          height: 100%;
          min-width: 64px;
          min-height: 64px;
          background-color: blue;
        "
      ></div>
    </SquareHandleMove>
  </div>
</template>

<script>
  import SquareHandleMove from "@/components/SquareHandleMove.vue";
  export default {
    name: "HelloWorld",
    data: () => {
      return {
        stage: null,
        scale: 0.8,
        transform: {
          x: 120,
          y: 130,
          width: 120,
          height: 120,
          rotate: 12,
        },
      };
    },
    props: {},
    components: {
      // Draggable,
      SquareHandleMove,
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

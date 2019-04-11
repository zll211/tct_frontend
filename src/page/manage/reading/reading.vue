<template>
  <div class="reading">
    <div class="reading-one">
      <center-view :id="id"></center-view>
    </div>
    <div class="reading-two" :style="{flex:reportFlex,minWidth:reportWidth+'px'}">
      <right-view :sectionId="id" @showReport="showReport" @hiddenReport="hiddenReport"></right-view>
    </div>
  </div>
</template>

<script>
  import CenterView from "../diagnostic/centerView";
  import RightView from "../diagnostic/rightView";

  export default {
    name: "reading",
    components: {RightView, CenterView},
    props: ['id'],
    data() {
      return {
        reportFlex: 0,
        reportWidth: 0,
      }
    },
    mounted() {
      this.$root.$on('file-change', ({idList, idIndex}) => {
        this.$router.push(`/reading/${idList[idIndex]}`);
      })
    },
    methods: {
      showReport() {
        this.reportFlex = 4;
        this.reportWidth = 500
      },
      hiddenReport() {
        this.reportFlex = 0;
        this.reportWidth = 0
      }
    },
    beforeDestroy() {
      this.$root.$off('file-change');
    },
  }
</script>

<style lang="scss">
  .reading {
    display: flex;
    flex: 1;
    height: calc(100vh - 68px);
    .reading-one {
      flex: 7;
      height: 100%;
      display: flex;
    }
    .reading-two {
      background-color: #ffffff;
      padding: 5px 10px;
      color: #15233D;

    }
  }
</style>

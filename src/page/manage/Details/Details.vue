<template>
  <center-view :id="id"></center-view>
</template>

<script>
  import CenterView from "../diagnostic/centerView";
  export default {
    name: "Details",
    components: {CenterView},
    props: ['id'],
    data() {
      return {}
    },
    mounted() {
      this.$root.$on('file-change', ({idList, idIndex}) => {
        this.$router.push(`/Details/${idList[idIndex]}`);
      })
    },
    beforeDestroy() {
      this.$root.$off('file-change');
    },
  }
</script>

<style scoped>

</style>

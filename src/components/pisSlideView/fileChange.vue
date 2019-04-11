<template>
  <div class="file-change flex column" v-if="idList.length>1">
    <el-button type="primary" size="small" class="last-btn" :disabled="idIndex===0" @click="lastFile">上一例
    </el-button>
    <el-button type="primary" size="small" class="next-btn" :disabled="idIndex===idList.length-1"
               @click="nextFile">下一例
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'fileChange',
    /* props: {
       fileNameList: {
         type: Array,
         default: () => [],
       },
       fileIndex: {
         type: Number,
         default: 0,
       },
     },*/
    data() {
      return {
        idList: window.sessionStorage.getItem('idList') ? JSON.parse(window.sessionStorage.getItem('idList')) : [],
        idIndex: window.sessionStorage.getItem('idIndex') ? window.sessionStorage.getItem('idIndex') / 1 : 0,
      }
    },
    methods: {
      lastFile() {
        this.idIndex--;
        window.sessionStorage.setItem('idIndex', this.idIndex);
        this.$root.$emit('file-change', {idIndex: this.idIndex, idList: this.idList});
      },
      nextFile() {
        this.idIndex++;
        window.sessionStorage.setItem('idIndex', this.idIndex);
        this.$root.$emit('file-change', {idIndex: this.idIndex, idList: this.idList});
      },
    },
  };
</script>

<style scoped lang="scss">
  .file-change {
    position: absolute;
    right: 10px;
    top: 240px;
    z-index: 999;
    .next-btn {
      margin-left: 0;
      margin-top: 10px;
    }
  }
</style>

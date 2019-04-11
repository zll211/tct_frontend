<template>
  <div class="tabs-header">
    <router-link :to="'/diagnostic/pending/analyzed'">
      已分析
    </router-link>
    <router-link :to="'/diagnostic/pending/analyzing'">
      分析中
    </router-link>
    <router-link :to="'/diagnostic/pending/notanalyzed'">
      未分析
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "TabsHeader"
  }
</script>

<style lang="scss">
  .tabs-header {
    display: flex;
    border-bottom: 2px solid #e4e7ed;
    &>a {
      color: #303133;
      height: 40px;
      line-height: 40px;
      margin: 0 20px;
      &:first-child {
        margin-left: 0;
      }
    }
    .router-link-active {
      border-bottom: 2px solid #4868B9;
      color: #4868B9;
    }

  }
</style>

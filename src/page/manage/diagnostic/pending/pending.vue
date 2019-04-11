<template>
  <!--<div class="main-container diagnostic-main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已分析" name="analyzed">用户管理</el-tab-pane>
      <el-tab-pane label="分析中" name="analyzing">
        <analyzing></analyzing>
      </el-tab-pane>
      <el-tab-pane label="待分析" name="notAnalyzed">
        <not-analyzed></not-analyzed>
      </el-tab-pane>
    </el-tabs>
  </div>-->
  <router-view></router-view>
</template>
<script>
import NotAnalyzed from "@/page/manage/diagnostic/pending/NotAnalyzed.vue";
import Analyzing from "@/page/manage/diagnostic/pending/Analyzing.vue";
export default {
  data() {
    return {
      activeName: "analyzing"
    };
  },
  components: {
    Analyzing,
    NotAnalyzed
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss">
.common-table-header {
  margin: 0 0 25px;
}

.el-main {
  display: flex;
  .diagnostic-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    // overflow: hidden;
    .el-tabs {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .el-tabs__content {
      flex: 1;
      display: flex;
    }
    .el-tab-pane {
      flex: 1;
      display: flex;
    }
    .common-header {
      .el-input--suffix {
        .el-input__inner {
          line-height: 32px !important;
          height: 32px !important;
        }
        .el-select__caret {
          line-height: 32px !important;
        }
      }
      .el-range-editor {
        width: 350px !important;
        line-height: 32px !important;
        height: 32px !important;
        .el-range__icon {
          line-height: 24px !important;
        }
        .el-range-separator {
          line-height: 24px !important;
        }
      }
    }
    .common-table {
      position: relative;
      /*padding-bottom: 80px !important;*/
      flex: 1;
      .diagnostic-table {
        height: calc(100% - 80px);
        .el-table__fixed-right-patch {
          background-color: #f5f6fa;
        }
      }
      .diagnostic-page {
        position: absolute;
        bottom: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        height: 40px;
        .el-pager li,
        button,
        .el-input__inner {
          background-color: #f5f6fa;
        }
      }
      .progress-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        height: 40px;
        align-items: center;
        p {
          padding-right: 6px;
          font-size: 14px;
          color: #8b95aa;
          span {
            color: #15233d;
            margin: 0 5px;
          }
        }
        .el-progress {
          width: 160px;
        }
      }
    }
  }
}
</style>

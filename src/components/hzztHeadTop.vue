<template>
  <div class="header-main">
    <div class="header-start text-center">{{ mainTitle }}</div>
    <div v-if="hasProcessing" class="top-message">
      <p><span class="message-title">姓名:</span> <span>{{current.name}}</span> </p>
      <p class="progress-bar"><span class="message-title">进度:</span> <el-progress :stroke-width="15" :percentage="current.progress" :show-text="false" color="#4868B9"></el-progress><span class="message-title progress-title">{{ current.progress }}%</span></p>
      <p><span class="message-title">等待分析:</span><span>{{pendingCount}}</span></p>
    </div>
    <div class="header-end">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="dropdown-button">
          <!--<img class="user-avatar" src="assets/img/default-avator.png"/>-->
          <span class="real-name">{{user.name}}</span>
          <i class="el-icon-caret-bottom drop-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { loginService } from "../page/base/login/login.service";
  import { createNamespacedHelpers } from "vuex";
  import { ANALYSIS_MODULE_NAME } from "@/store/analysis.module";
  import Config from '@/config/config';

  const {
    mapState: mapAnalysisState,
    mapGetters: mapAnalysisGetters
  } = createNamespacedHelpers(ANALYSIS_MODULE_NAME);

  export default {
    data() {
      return {
        mainTitle: Config.mainTitle,
      };
    },
    computed: {
      ...mapState(["user", "collapse"]),
      ...mapAnalysisState(["current", "pendingCount"]),
      ...mapAnalysisGetters(["hasProcessing"])
    },
    mounted() {},
    methods: {
      handleCommand(command) {
        if (command === "logout") {
          loginService
            .logout()
            .then(({ body }) => {
              if (!body.status_code) {
                window.sessionStorage.removeItem("accessToken");
                this.$store.commit("isLogin", false);
                document.title = Config.mainTitle;
                this.$router.replace("/login");
              } else {
                this.$message.error("退出失败");
              }
            })
            .catch(() => {
              this.$message.error("退出失败");
            });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../style/variables";

  .header-main {
    display: flex;
    justify-content: space-between;
    position: relative;
    .top-message{
      display:flex;
      align-items: center;
      justify-content: space-between;
      .message-title{
        color:rgba(139,149,170,1);
        margin-right:5px;
        &.progress-title {
          display: inline-block;
          width: 45px;
        }
      }
      .progress-bar {
        display: flex;
        justify-content: center;
        height: 40px;
        align-items: center;
        span {
          color:rgba(139,149,170,1);
          margin: 0 5px;
        }
        .el-progress {
          width: 260px;
        }
      }
    }
  }
  @media screen and (max-width: 1366px){
    .header-main{
      .top-message{
        width:50%;
      }
    }

  }
  @media (min-width: 1366px)and (max-width:1600px){
    .header-main{
      .top-message{
        width:55%;
      }
    }

  }
  @media (min-width: 1601px)and (max-width:1700px){
    .header-main{
      .top-message{
        width:45%;
      }
    }
  }
  @media (min-width: 1701px)and (max-width:1920px){
    .header-main{
      .top-message{
        width:43%;
      }
    }
  }
  @media screen and (min-width: 1921px){
    .header-main{
      .top-message{
        width:33%;
      }
    }

  }
  /*@media screen and (max-width: 1930px){*/
  /*.header-main{*/
  /*.top-message{*/
  /*width:50%;*/
  /*}*/
  /*}*/

  /*}*/

  .header-start {
    align-items: center;
    display: flex;
    cursor: pointer;
    padding-left: 44px;
  }

  .header-end {
    align-items: center;
    display: flex;
    height: 68px;
  }

  .dropdown-button {
    cursor: pointer;
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 66px;
    &:hover {
      background-color: #ffffff !important;
    }
    .user-avatar {
      margin-right: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .real-name {
      margin-right: 28px;
      color: $_pm-default-color;
      font-size: 14px;
    }
    .drop-bottom {
      margin-right: 8px;
      &::before {
        width: 9px;
        height: 9px;
        color: #8993a8;
      }
    }
    &:hover {
      background: $_pm-default-background;
    }
  }

  .el-dropdown-menu {
    padding: 4px 0;
    .popper__arrow {
      border-width: 0 !important;
      &:after {
        border-width: 0 !important;
      }
    }
  }

  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }

  .el-dropdown-menu__item {
    color: $_pm-default-dark-color;
    height: 42px;
    line-height: 42px;
    margin-top: 0;
    padding: 0 30px;
    &:before {
      height: 0;
    }
    &:focus {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    &:not(.is-disabled):hover {
      background-color: $_pm-base-color;
    }
    a {
      color: $_pm-default-dark-color;
    }
  }
</style>

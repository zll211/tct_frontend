<template>
  <el-container class="fill-contain">
    <side-nav></side-nav>
    <el-container>
      <el-header>
        <head-top></head-top>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import headTop from "@/components/hzztHeadTop";
import sideNav from "@/components/hzztSideNav";
import { manageService } from "./manage.service";
import { manageRoute } from "./manage.route";
import stompInit from "@/services/stomp_init.service";
import analysisService, {
  ProcessingAnalysisStatus,
  AnalysisStatus
} from "@/services/analysis.service";
import {
  ANALYSIS_MODULE_NAME,
  SET_PENDING_COUNT,
  UPDATE_CURRENT
} from "@/store/analysis.module";
import { createNamespacedHelpers } from "vuex";
import Vue from "vue";

import configService from "@/services/config.service";
import {
  UPDATE_ANALYSIS_CONFIG,
  UPDATE_RABBITMQ_CONFIG,
  CONFIG_MODULE_NAME
} from "@/store/config.module";

import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  switchMapTo,
  tap,
  withLatestFrom,
  catchError,
  filter,
  first,
  mergeAll,
  mapTo,
  mergeMap,
  concatAll,
  race,
  switchMap,
  pluck
} from "rxjs/operators";

import { Observable, defer, from, of } from "rxjs";

import { baseUrl } from "@/config/config";

export default {
  beforeDestroy() {
    window.onresize = null;
    stompInit.dispose();
    analysisService.dispose();
    configService.dispose();

    // 退订stomp
    if (stompInit.rxStomp.connected()) {
      this.stompProgressSub.unsubscribe();
    }

    // 退订待分析列表
    this.pendingCountSub.unsubscribe();
    this.currentAnalyzingSub.unsubscribe();

    // 退订设置
    this.analysisConfigSub.unsubscribe();
    this.rabbitmqConfigSub.unsubscribe();
  },
  components: {
    headTop,
    sideNav
  },
  async created() {
    this.user();
    this.$store.commit("setMenus", manageRoute[0].children);
    this.init();
  },
  methods: {
    user() {
      manageService.user().then(({ body }) => {
        if (!body.status_code) {
          this.$store.commit("setUser", body || {});
        }
      });
    },
    init() {
      // 初始化stomp
      stompInit.init();
      this.subscribeAnalysis();
      this.subscribeConfigSetting();
    },

    // 初始化分析相关的监听
    subscribeAnalysis() {
      analysisService.init();
      // 监听分析进度消息，并更新store
      this.stompProgressSub = stompInit.progress$.subscribe(
        current => {
          this.$store.commit(
            ANALYSIS_MODULE_NAME + "/" + UPDATE_CURRENT,
            current
          );
          // 如果分析过程到了一个新的状态
          if (
            current.progress === 0 ||
            current.status === ProcessingAnalysisStatus.done ||
            current.status === ProcessingAnalysisStatus.failed
          ) {
            // 更新等待分析数量
            this.updatePendingCount();
          }
        },
        error => console.error("stompProgressSub", error)
      );

      // 当前正在分析的那一个
      // 使用进度信息里的id
      this.currentAnalyzingSub = stompInit.progress$
        .pipe(
          distinctUntilKeyChanged("id"),
          pluck("id"),
          filter(id => id !== undefined),
          switchMap(id => Vue.http.get(`${baseUrl}/sections/${id}`)),
          pluck("body"),
          filter(data => data.id)
        )
        .subscribe(
          data => {
            console.log("currentAnalyzingSub", data);
            analysisService.current$.next(data);
            this.$store.commit(
              ANALYSIS_MODULE_NAME + "/" + UPDATE_CURRENT,
              data
            );
          },
          error => console.error("currentAnalyzingSub", error)
        );

      // 监听等待分析数量
      this.pendingCountSub = analysisService.pendingCount$.subscribe(
        list => {
          console.log("pendingCountSub", list);
          this.$store.commit(
            ANALYSIS_MODULE_NAME + "/" + SET_PENDING_COUNT,
            list
          );
        },
        error => console.error("pendingCountSub", error)
      );

      this.updatePendingCount();
    },

    // 初始化系统管理相关监听
    subscribeConfigSetting() {
      configService.init();
      this.analysisConfigSub = configService.analysisConfig$.subscribe(
        data => {
          this.$store.commit(
            CONFIG_MODULE_NAME + "/" + UPDATE_ANALYSIS_CONFIG,
            data
          );
        },
        error => console.error("analysisConfigSub", error)
      );
      configService.updateAnalysisConfig$.next();

      this.rabbitmqConfigSub = configService.rabbitmqConfig$.subscribe(
        data => {
          this.$store.commit(
            CONFIG_MODULE_NAME + "/" + UPDATE_RABBITMQ_CONFIG,
            data
          );
        },
        error => console.error("rabbitmqConfigSub", error)
      );
      configService.updateRabbitmqConfig$.next();
    },
    updatePendingCount() {
      analysisService.updatePendingCount$.next();
    }
  },
  mounted() {
    window.onresize = () => {
      this.$root.$emit("size-change");
    };
  }
};
</script>

<style lang='scss' src="./manage.scss"></style>

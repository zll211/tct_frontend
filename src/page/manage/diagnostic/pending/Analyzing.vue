<template>
  <CenterView :from-analyzing="true" :id="current.id" v-if="hasProcessing && current.section_path"></CenterView>
  <NoAnalyzing v-else></NoAnalyzing>
</template>

<script>
import CenterView from "@/page/manage/diagnostic/centerView";
import NoAnalyzing from "@/page/manage/diagnostic/pending/NoAnalyzing";
import stompInit from "@/services/stomp_init.service";
import analysisService from "@/services/analysis.service";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters } = createNamespacedHelpers("analysis");
import { ANALYSIS_MODULE_NAME, UPDATE_PICTURES } from "@/store/analysis.module";
import { baseUrl } from "@/config/config";
import {
  switchMapTo,
  tap,
  withLatestFrom,
  catchError,
  filter,
  switchMap,
  exhaustMap,
  map,
  pluck
} from "rxjs/operators";
import { defer, from } from "rxjs";
import Vue from "vue";
export default {
  computed: {
    ...mapState(["current"]),
    ...mapGetters(["hasProcessing"])
  },
  components: {
    CenterView,
    NoAnalyzing
  },
  created() {
    console.log("Analyzing created");
    // 监听图片消息，并更新图片
    this.stompPictureSub = stompInit.picture$
      .pipe(
        withLatestFrom(
          analysisService.current$,
          (pictureMsg, current) => current
        ),
        filter(current => current.id),
        tap(current => console.log("stompPictureSub", current)),
        exhaustMap(current =>
          Vue.http.get(`${baseUrl}/slice/labels`, {
            params: {
              file: current.section_path,
              id: current.id
            }
          })
        ),
        pluck("body"),
        filter(pictures => Array.isArray(pictures))
      )
      .subscribe(
        pictures => {
          this.$store.commit(
            ANALYSIS_MODULE_NAME + "/" + UPDATE_PICTURES,
            pictures
          );
        },
        error => console.error(error)
      );
  },
  beforeDestroy() {
    console.log("Analyzing beforeDestroy");
    if (stompInit.rxStomp.connected()) {
      this.stompPictureSub && this.stompPictureSub.unsubscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

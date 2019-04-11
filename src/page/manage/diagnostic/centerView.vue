<template>
  <div class="reading-left" v-if="fromAnalyzing || dataReady">
    <div class="left-view">
      <pis-slide-view
        :file-index="0"
        ref="pisSlideView"
        :labelList="labelList"
        :file-name="current.section_path"
      ></pis-slide-view>
    </div>
    <div class="center-view">
      <el-row class="pathology-info">
        <el-col :span="16">
          <p>
            姓名：
            <span>{{current.name}}</span>
          </p>
          <p>
            病理号：
            <span>{{current.pathology_id}}</span>
          </p>
        </el-col>
        <el-col :span="8">
          <p>
            年龄：
            <span>{{current.age}}</span>
          </p>
          <p>
            性别：
            <span>{{current.gender}}</span>
          </p>
        </el-col>
        <el-col :span="16">
          <p>
            识别图:
            <span>{{ pictures.length }}</span>
          </p>
        </el-col>
        <el-col :span="8" v-if="fromAnalyzing">
          <el-checkbox v-model="autoFollow">自动跟踪</el-checkbox>
        </el-col>
      </el-row>
      <div class="img-row" ref="imgContainer">
        <el-row :gutter="10">
          <el-col :span="12" v-for="(item, index) in pictures" :key="index">
            <div
              class="border-lines"
              :class="{'selected': imgSelectedIndex === index}"
              @click="choosePicture(item, index)"
            >
              <img v-lazy="item.imageUrl" class="label-img">
              <!--<div class="verify-btn">
                <el-button type="text" size="mini" class="verify-true" @click="VerifyTrueDialog">正确</el-button>
                <el-button type="text" size="mini" class="verify-false" @click="VerifyFalseDialog">错误</el-button>
              </div>-->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <div v-else>加载中</div>
</template>

<script>
  import PisSlideView from "@/components/pisSlideView/pisSlideView";
  import {baseUrl} from "@/config/config";
  import Vue from "vue";
  import {ANALYSIS_MODULE_NAME, UPDATE_PICTURES} from "@/store/analysis.module";

  export default {
    name: "centerView",
    computed: {
      current() {
        return this.fromAnalyzing
          ? this.$store.state.analysis.current
          : this.pathology;
      },
      pictures() {
        const _pictures = this.$store.state.analysis.pictures;
        const _length = _pictures.length;
        // 如果是正在分析且打开了自动跟踪
        if (this.fromAnalyzing && this.autoFollow && _length > 0) {
          // 自动选择图
          this.choosePicture(_pictures[_length - 1], _length - 1);
          if (this.$refs.imgContainer) {
            // 并滑动到最底部
            this.$refs.imgContainer.scrollTop = 1000000;
          }
        }
        return _pictures;
      },
      labelList() {
        return this.pictures.map((item, index) => ({
          id: index + 1,
          region: {
            x: Number(item.region.x || '0'),
            y: Number(item.region.y || '0'),
            width: Number(item.region.width || '0'),
            height: Number(item.region.height || '0'),
          },
          color: "#ff0000",
          type: "Rectangle",
          pin: 1,
          points: [],
          scale: 1
        }));
      }
    },
    watch: {
      id() {
        this.init();
      },
    },
    components: {PisSlideView},
    props: {
      id: Number | String,
      fromAnalyzing: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pathology: {},
        dataReady: false,
        imageList: [],
        imgSelectedIndex: -1,
        autoFollow: true
      };
    },
    created() {
      this.init();
    },
    methods: {
      choosePicture(item, index) {
        if (!this.$refs.pisSlideView?.kfbView?.area?.moveCenterPoint) {
          return;
        }
        this.imgSelectedIndex = index;
        this.$refs.pisSlideView.kfbView.area.moveCenterPoint({
          region: {
            x: Number(item.region.x || '0'),
            y: Number(item.region.y || '0'),
            width: Number(item.region.width || '0'),
            height: Number(item.region.height || '0'),
          },
          scale: item.region.scale / this.$refs.pisSlideView.kfbView.scale
        });
      },
      init() {
        if (this.fromAnalyzing) {
          this.getImageList(this.current.section_path, this.current.id);
        } else {
          this.getPathologyData();
        }
      },
      async getPathologyData() {
        try {
          const response = await Vue.http.get(`${baseUrl}/sections/${this.id}`);
          this.pathology = response.body;
          this.$store.commit(
            ANALYSIS_MODULE_NAME + "/" + UPDATE_PICTURES,
            []
          );
          await this.getImageList(this.pathology.section_path, this.pathology.id);
          this.dataReady = true;
        } catch (e) {
          console.error("getPathologyData catch error", e);
        }
      },
      async getImageList(file, id) {
        if (!file) return;
        try {
          let params = {
            file,
            id
          };
          if (!this.fromAnalyzing) {
            params.sort = true;
          }
          const response = await Vue.http.get(`${baseUrl}/slice/labels`, {
            params
          });
          // this.imageList = response.body;
          this.$store.commit(
            ANALYSIS_MODULE_NAME + "/" + UPDATE_PICTURES,
            response.body
          );
        } catch (e) {
          console.error("getImageList catch error", e);
        }
      }
    }
  };
</script>

<style lang="scss">
  .reading-left {
    display: flex;
    flex: 1;
    // height: 100%;
    .left-view {
      flex: 7;
    }
    .center-view {
      background-color: #ffffff;
      padding: 0 10px;
      width: 316px;
      display: flex;
      flex-direction: column;
      .pathology-info {
        padding: 10px 0;
        p {
          line-height: 26px;
          span {
            color: #8993a8;
          }
        }
      }
      .img-row {
        // height: calc(100vh - 145px);
        flex: 1;
        overflow-y: auto;
        .el-col {
          margin: 8px 0;
          /*height: 130px;*/

          .border-lines {
            border: 2px solid #dde2ee;
            border-radius: 3px;
            height: 100px;
            &.selected {
              border-color: #ff0000;
            }
            .label-img {
              width: 100%;
              height: 100%;
              display: block;
              object-fit: cover;
            }
            .verify-btn {
              display: flex;
              .el-button + .el-button {
                margin-left: 0;
              }
              .verify-true {
                flex: 1;
                color: #4868b9;
                background-color: #ffffff;
                &:hover {
                  background-color: #4868b9;
                  color: #ffffff;
                }
              }
              .verify-false {
                flex: 1;
                color: #da7265;
                background-color: #ffffff;
                &:hover {
                  background-color: #da7265;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

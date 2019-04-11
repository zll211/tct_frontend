<template>
  <div class="diagnostic-main">
    <div class="common-header" v-if="!isAuto">
      <div class="common-header-end flex align-items-center">
        <el-button type="primary" size="small" @click="analysis()">分析</el-button>
      </div>
    </div>
    <div class="common-table">
      <div class="diagnostic-table">
        <el-table
          ref="pTable"
          v-loading="loading"
          :data="list"
          :row-key="'id'"
          height="100%"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            fixed="left"
            type="selection"
            align="center"
            :selectable="this.selectable"
          ></el-table-column>
          <el-table-column
            v-for="item in headers"
            :key="item.label"
            :fixed="item.fixed"
            :prop="item.prop"
            :label="item.label"
            :min-width="item['min-width']"
          ></el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="200">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-end wrap">
                <div v-if="scope.row.id === current.id">
                  <el-progress :stroke-width="10" :percentage="current.progress" color="#4868B9"></el-progress>
                </div>
                <div v-else-if="scope.row.ananysis_status === AnalysisStatus.pending">
                  <el-button type="text">等待分析...</el-button>
                  <el-button type="primary" size="small" @click="deleteCase(scope.row.id)">删除</el-button>
                </div>
                <div v-else class="flex align-items-center">
                  <el-button type="primary" size="small" @click="analysis(scope.row.id)">分析</el-button>
                  <el-button type="primary" size="small" @click="deleteCase(scope.row.id)">删除</el-button>
                  <el-upload
                    name="image"
                    action="/api/images"
                    :show-file-list="false"
                    :headers="uploadImgHeader"
                    accept=".json"
                    :data="scope.row"
                    :http-request="uploadJSON">
                    <el-button type="primary" size="small" style="margin-left: 10px">上传json</el-button>
                  </el-upload>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="diagnostic-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-right: 10px"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
  import {pendingService} from "./pending.service";
  import {baseUrl} from "@/config/config";
  import {createNamespacedHelpers} from "vuex";
  import analysisService, {AnalysisStatus} from "@/services/analysis.service";
  import {ANALYSIS_MODULE_NAME} from "@/store/analysis.module";
  import Vue from "vue";

  const {mapState, mapGetters} = createNamespacedHelpers(ANALYSIS_MODULE_NAME);

  export default {
    created() {
      this.pendingList();
    },
    computed: {
      AnalysisStatus() {
        return AnalysisStatus;
      },
      ...mapState(["current", "pendingCount"]),
      ...mapGetters(["hasProcessing"]),
      isAuto() {
        return this.$store.state.config.analysis.analysis_style === "自动";
      }
    },
    components: {},
    data() {
      return {
        list: [],
        headers: [
          {
            prop: "pathology_id",
            label: "病理号",
            "min-width": 120
          },
          {
            prop: "name",
            label: "姓名",
            "min-width": 120
          },
          {
            prop: "gender",
            label: "性别",
            "min-width": 120
          },
          {
            prop: "age",
            label: "年龄",
            "min-width": 120
          },
          {
            prop: "sample",
            label: "取样医生",
            "min-width": 120
          },
          {
            prop: "sample_time",
            label: "取样时间",
            "min-width": 120
          }
        ],
        iconName: "el-icon-arrow-left",
        keyword: "",
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        tableHeight: undefined,
        checkedId: 0,
        multipleSelection: [],
        uploadImgHeader: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
      };
    },
    methods: {
      // 待诊断列表
      pendingList() {
        let params = {
          page: this.pageIndex,
          per_page: this.pageSize,
          ananysis_status: [AnalysisStatus.notAnalyzed, AnalysisStatus.pending],
          pathology_id: this.keyword,
          include: "report",
          diagnosis_status: "待诊断"
        };
        this.loading = true;
        pendingService
          .pendingList(params)
          .then(({body}) => {
            if (body.status_code === undefined) {
              this.list = body.data;
              this.total = body.meta.pagination.total;
            } else {
              this.$message.error("加载待分析列表失败");
            }
          })
          .catch(e => {
            console.error(e);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      //分析
      async analysis(id) {
        try {
          let ids = [];
          if (id) {
            console.log("analysis target id", id);
            ids = [id];
          } else if (this.multipleSelection.length > 0) {
            ids = this.multipleSelection.map(i => i.id);
          }
          if (ids.length === 0) {
            this.$message.error("请先选择病理");
          } else {
            console.log("analysis target ids", ids);
            const response = await Vue.http.post(`${baseUrl}/sections/analyses`, {
              ids
            });
            if (!response.body.hasOwnProperty("status_code")) {
              // this.$message.success("开始分析");
              // 更新
              analysisService.updatePendingCount$.next();
              await this.pendingList();
              // if (!this.hasPending && !id) {
              //   this.$router.push(`/diagnostic/pending/analyzing`);
              // }
            }
          }
        } catch (e) {
          console.error('analysis catch error', e);
          this.$message.error("分析失败");
        }
      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.pendingList();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.pendingList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("handleSelectionChange", val);
      },
      selectable(row, index) {
        return row.ananysis_status === AnalysisStatus.notAnalyzed && row.section_path;
      },
      deleteCase(id) {
        pendingService.deleteReport({ids: [id]})
          .then(({body}) => {
            this.pendingList();
          }).catch(() => {
          this.$message.error('删除失败');
        })
      },
      uploadJSON({file, data}) {
        const fd = new FormData();
        fd.append('image', file);
        pendingService.uploadJson(fd)
          .then(({body}) => {
            if (!body.status_code) {
              pendingService.identificationData({path: body.path, id: data.id})
                .then(({body}) => {
                  this.pendingList();
                }).catch(() => {
                this.$message.error('上传失败');
              })
            } else {
              this.$message.error(body.message);
            }
          }).catch(() => {
          this.$message.error('上传失败');
        })
      },
    }
  };
</script>

<style lang="scss">
</style>

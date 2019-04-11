<template>
  <div class="main-container diagnostic-main">
    <div class="common-header">
      <hzzt-title>待诊断</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入病理号"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="pendingList()"
                  @clear="pendingList()">
        </el-input>
        <el-select style="margin-right: 10px" v-model="analysisValue" placeholder="分析状态" @change="analysisHandleChange"
                   clearable>
          <el-option
            v-for="item in analysisOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="analysis()">分析</el-button>
      </div>
    </div>
    <div class="common-table">
      <div class="diagnostic-table">
        <el-table
          ref="pTable"
          v-loading="loading"
          :data="data"
          height="100%"
          style="width: 100%;">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column v-for="(data, index) in headers"
                           :key="index"
                           :fixed="data.fixed"
                           :prop="data.prop"
                           :label="data.label"
                           :min-width="data['min-width']"
                           :align="data.align">
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="200">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-center wrap">
                <el-button type="primary" size="small" @click="diagnosisBtn(scope.row.id, scope.$index)">诊断</el-button>
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
          :total="total">
        </el-pagination>
      </div>
      <div class="progress-bar">
        <p>共<span>{{progressCount}}</span>张，已分析<span>{{progressFinish}}</span>张，当前分析到<span>{{progressCurrent}}</span>分析进度
        </p>
        <el-progress :stroke-width="10" :percentage="80" color="#4868B9"></el-progress>
      </div>
    </div>
    <!--<el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="诊断"
               :close-on-press-escape="false" v-if="showFile">
      <div class="center-view">
        <center-view @showForm="showForm" :iconName="sectionId?iconName:undefined"></center-view>
      </div>
      <div class="right-view" v-show="showFormList" v-if="sectionId">
        <right-view @pendingList="pendingList" @closeDialog="closeDialog" :showFile="showFile"
                    :sectionId="sectionId"></right-view>
      </div>
    </el-dialog>-->


  </div>
</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {pendingService} from "./pending.service";
  import {baseUrl} from '@/config/config';
  import pisSlideView from "@/components/pisSlideView/pisSlideView";
  import CenterView from "../centerView";
  import RightView from "../rightView";

  export default {
    created() {
      this.pendingList();
    },
    components: {
      RightView,
      CenterView,
      pisSlideView,
      hzztTitle,
    },
    data() {
      return {
        analysisValue: '',
        analysisOption: [{
          value: '已分析',
          label: '已分析'
        }, {
          value: '未分析',
          label: '未分析'
        }],
        data: [],
        headers: [
          {
            'prop': 'pathology_id',
            'label': '病理号',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'ananysis_result',
            'label': '分析结果',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'name',
            'label': '姓名',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'gender',
            'label': '性别',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'age',
            'label': '年龄',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'expert',
            'label': '诊断专家',
            'min-width': 120,
            'align': 'center',
          }
        ],
        iconName: 'el-icon-arrow-left',
        keyword: '',
        loading: false,
        pageIndex: window.sessionStorage.getItem('pageIndex') ? window.sessionStorage.getItem('pageIndex') / 1 : 1,
        pageSize: 10,
        progressCount: 10,
        progressFinish: 7,
        // TODO: 修改成真实数据
        progressCurrent: 'B201800102001',
        // TODO: 修改成真实数据
        total: 10,
        tableHeight: undefined,
        checkedId: 0,
      };
    },
    methods: {
      // 待诊断列表
      pendingList() {
        let params = {
          page: this.pageIndex,
          per_page: this.pageSize,
          ananysis_status: this.analysisValue,
          diagnosis_time: this.date,
          pathology_id: this.keyword,
          include: 'report',
          diagnosis_status: '待诊断'
        };
        this.loading = true;
        pendingService.pendingList(params)
          .then(({body}) => {
            if (body.status_code === undefined) {
              this.data = body.data;
              this.total = body.meta.pagination.total;
            } else {
              // TODO: 出错提示,数据重置
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      // 分析状态值变化时触发
      analysisHandleChange(value) {
        this.analysisValue = value;
        this.pendingList()
      },
      //分析
      analysis() {
        // TODO: 分析
      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.pendingList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.pendingList()
      },
      //诊断
      diagnosisBtn(id, index) {
        window.sessionStorage.setItem('pageIndex', this.pageIndex);
        window.sessionStorage.setItem('idList', JSON.stringify(this.data.map((item) => item.id)));
        window.sessionStorage.setItem('idIndex', index);
        this.$router.push(`/reading/${id}`);
      },
      deleteCase(id) {
        pendingService.deleteReport({ids: [id]})
          .then(({body}) => {

          })
      }
    }
  }
</script>

<style lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }

  .el-main {
    height: 100%;
    .diagnostic-main {
      height: calc(100% - 68px);
      display: flex;
      flex-direction: column;
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
            background-color: #F5F6FA;
          }
        }
        .diagnostic-page {
          position: absolute;
          bottom: 40px;
          width: 100%;
          display: flex;
          justify-content: center;
          height: 40px;
          .el-pager li, button, .el-input__inner {
            background-color: #F5F6FA;
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
            color: #8B95AA;
            span {
              color: #15233D;
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

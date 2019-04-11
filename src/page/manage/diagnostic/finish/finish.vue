<template>
  <div class="main-container diagnostic-main">
    <div class="common-header">
      <hzzt-title>已诊断</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入病理号"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="finishList()"
                  @clear="finishList()">
        </el-input>
        <el-button style="margin-right: 7px" type="text" disabled>诊断时间</el-button>
        <el-date-picker
          v-model="date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
          value-format="yyyy-MM-dd"
          @change="datePicker">
        </el-date-picker>
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
                <el-button type="primary" size="small" @click="viewDetails(scope.row.id, scope.$index)">查看详情</el-button>
                <el-button type="primary" size="small" @click="viewReport(scope.row.id)">查看报告</el-button>
                <el-button type="primary" size="small" @click="deleteCase(scope.row.id)">删除
                </el-button>
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
    </div>
  </div>
</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {finishService} from "./finish.service";
  import {baseUrl} from '@/config/config';
  import HzztIcon from "../../../../components/hzztIcon";
  import CenterView from "../centerView";

  export default {
    created() {
      this.finishList();
    },
    components: {
      HzztIcon,
      hzztTitle,
      CenterView,
    },
    data() {
      return {
        data: [],
        date: '',
        datePickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        headers: [
          {
            'prop': 'pathology_id',
            'label': '病理号',
            'min-width': 120,
            'align': 'center',
          },

          {
            'prop': 'name',
            'label': '姓名',
            'min-width': 100,
            'align': 'center',
          },
          {
            'prop': 'gender',
            'label': '性别',
            'min-width': 60,
            'align': 'center',
          },
          {
            'prop': 'age',
            'label': '年龄',
            'min-width': 60,
            'align': 'center',
          },
          {
            'prop': 'ananysis_result',
            'label': '分析结果',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'diagnosis_result',
            'label': '诊断结果',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'expert',
            'label': '诊断专家',
            'min-width': 120,
            'align': 'center',
          },
          {
            'prop': 'diagnosis_time',
            'label': '诊断时间',
            'min-width': 180,
            'align': 'center',
          }
        ],
        keyword: '',
        loading: false,
        pageIndex: window.sessionStorage.getItem('pageIndex') ? window.sessionStorage.getItem('pageIndex') / 1 : 1,
        pageSize: 10,
        progressCount: 10,
        progressFinish: 7,
        progressCurrent: 'B201800102001',
        sectionId: 0,
        total: 10,
        tableHeight: undefined,
      };
    },
    methods: {
      // 已诊断列表
      finishList() {
        let params = {
          page: this.pageIndex,
          per_page: this.pageSize,
          ananysis_status: this.analysisValue,
          diagnosis_time: this.date,
          pathology_id: this.keyword,
          include: 'report',
          diagnosis_status: '已诊断'
        };
        this.loading = true;
        finishService.finishList(params)
          .then(({body}) => {
            if (body.status_code === undefined) {
              this.data = body.data;
              this.total = body.meta.pagination.total;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      //日期选择器
      datePicker() {
        this.finishList()
      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.finishList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.finishList()
      },
      //查看详情
      viewDetails(id, index) {
        window.sessionStorage.setItem('pageIndex', this.pageIndex);
        window.sessionStorage.setItem('idList', JSON.stringify(this.data.map((item) => item.id)));
        window.sessionStorage.setItem('idIndex', index);
        this.$router.push(`/Details/${id}`);
      },
      //查看报告
      viewReport(id) {
        window.open(`${baseUrl}/sections/pdf/${id}`);
      },

      deleteCase(id) {
        finishService.deleteReport({ids: [id]})
          .then(({body}) => {
            this.finishList();
          }).catch(() => {
          this.$message.error('删除失败');
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
        .el-input__prefix {
          .el-icon-date {
            line-height: 32px !important;
          }
        }
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
        /*padding-bottom: 60px !important;*/
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
      }
    }
  }

</style>

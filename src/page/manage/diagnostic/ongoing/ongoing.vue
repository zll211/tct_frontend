<template>
  <div class="main-container diagnostic-main">
    <div class="common-header">
      <hzzt-title>诊断中</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入病理号"
                  suffix-icon="el-icon-search">
        </el-input>
        <el-button style="margin-right: 7px" type="text" disabled>诊断时间</el-button>
        <el-date-picker
          style="margin-right: 10px"
          v-model="date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
          value-format="yyyy-MM-dd"
          @change="datePicker">
        </el-date-picker>
        <el-select style="margin-right: 10px" v-model="analysisValue" placeholder="分析状态" @change="analysisHandleChange">
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
          <el-table-column prop="operate" align="center" label="操作" fixed="right"  min-width="200">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-center wrap">
                <el-button type="danger" size="small" @click="deleteBtn(scope.row.id)">删除</el-button>
                <el-button type="primary" size="small" @click="editBtn(scope.row)">编辑</el-button>
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
        <p>共<span>{{progressCount}}</span>张，已分析<span>{{progressFinish}}</span>张，当前分析到<span>{{progressCurrent}}</span>分析进度</p>
        <el-progress :stroke-width="10" :percentage="80" color="#4868B9"></el-progress>
      </div>
    </div>

  </div>
</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {ongoingService} from "./ongoing.service";
  import {baseUrl} from '@/config/config';
  import HzztIcon from "../../../../components/hzztIcon";

  export default {
    created() {
      this.ongoingList();
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
        analysisValue: '',
        analysisOption: [{
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }],
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
            'prop': 'Pathology',
            'label': '病理号',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'analysisResult',
            'label': '分析结果',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'name',
            'label': '姓名',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'sex',
            'label': '性别',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'age',
            'label': '年龄',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'diagnosis',
            'label': '诊断结果',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'diagnosisExperts',
            'label': '诊断专家',
            'min-width': 120,
            'align': 'center',
          }, {
            'prop': 'time',
            'label': '诊断时间',
            'min-width': 120,
            'align': 'center',
          }],
        keyword: '',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        progressCount: 10,
        progressFinish: 7,
        progressCurrent: 'B201800102001',
        total: 10,
        tableHeight: undefined,


      };
    },
    methods: {
      // 诊断中列表
      ongoingList() {
        let params = {
          /*page: this.pageIndex,
          page_size: this.pageSize,
          pathology_id: this.keyword,
          date: this.date*/
        };
        /*this.loading = true;
        ongoingService.ongoingList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              /!*this.data = body.data.list;
              this.total = body.data.meta.count;*!/
            }
          }).finally(() => {
          this.loading = false;
        })*/
      },
      //日期选择器
      datePicker() {
        this.ongoingList()
      },
      // 分析状态值变化时触发
      analysisHandleChange(value) {
        this.analysisValue=value;
        this.ongoingList()
      },
      //分析
      analysis() {

      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.ongoingList()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      deleteBtn() {

      },
      editBtn() {

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
      .common-header{
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
          .el-range__icon{
            line-height: 24px !important;
          }
          .el-range-separator{
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
          .el-pager li, button, .el-input__inner{
            background-color: #F5F6FA;
          }

        }
        .progress-bar{
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

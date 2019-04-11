<template>
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
          <template slot-scope="scope">
            <span v-if="data.prop !== 'age'">{{scope.row[data.prop]}}</span>
            <span v-if="data.prop === 'age'">{{scope.row.age}}{{scope.row.age_unit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ananysis_result" label="分析结果" min-width="120" align="center">
          <template slot-scope="scope">
            <div class="flex align-items-center justify-content-center wrap">
              <el-tag v-if="scope.row.ananysis_result==='阳性'" type="danger">{{scope.row.ananysis_result}}</el-tag>
              <el-tag v-if="scope.row.ananysis_result==='阴性'" type="success">{{scope.row.ananysis_result}}</el-tag>
              <el-tag v-if="scope.row.ananysis_result==='疑似阳性'">{{scope.row.ananysis_result}}</el-tag>
              <el-tag v-if="scope.row.ananysis_result===''" color="rgb(224, 224, 224)" class="unknow">未知</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <div class="flex align-items-center justify-content-center wrap">
              <el-button type="primary" size="small" @click="editCase(scope.row)">修改
              </el-button>
              <el-button type="primary" size="small" @click="diagnosisBtn(scope.row.id, scope.$index)">诊断
              </el-button>
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
    <el-dialog title="编辑病例" :visible.sync="editCaseShow" center width="500px">
      <el-form
        size="small" :model="caseForm" label-width="80px" label-position="left"
        class="edit-user-form" ref="caseForm">
        <el-form-item label="病理号" prop="pathology_id">
          <el-input v-model="caseForm.pathology_id" auto-complete="off" placeholder="请输入病理号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="caseForm.name" auto-complete="off" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="caseForm.gender" size="small" clearable>
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="caseForm.age" style="width: 55%" size="small" clearable></el-input>
          <el-select v-model="caseForm.age_unit" style="width: 40%" size="small">
            <el-option label="岁" value="岁"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="天" value="天"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCase" round
                   class="messagebox-button">保 存
        </el-button>
        <el-button @click="cancelCase" round class="messagebox-button">取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import NotAnalyzed from "@/page/manage/diagnostic/pending/NotAnalyzed.vue";
  import Analyzing from "@/page/manage/diagnostic/pending/Analyzing.vue";
  import {pendingService} from "./pending.service";

  export default {
    data() {
      return {
        activeName: "analyzing",
        data: [],
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
            'prop': 'created_at',
            'label': '分析时间',
            'min-width': 180,
            'align': 'center',
          },
        ],
        keyword: '',
        loading: false,
        pageIndex: window.sessionStorage.getItem('pageIndex') ? window.sessionStorage.getItem('pageIndex') / 1 : 1,
        pageSize: 10,
        total: 10,
        tableHeight: undefined,
        editCaseShow: false,
        caseForm: {},
      };
    },
    components: {
      Analyzing,
      NotAnalyzed
    },
    created() {
      this.pendingList();
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      //已分析列表
      pendingList() {
        let params = {
          page: this.pageIndex,
          per_page: this.pageSize,
          ananysis_status: '已分析',
          diagnosis_time: this.date,
          pathology_id: this.keyword,
          include: ['report', 'analyses'],
          diagnosis_status: '待诊断'
        };
        this.loading = true;
        pendingService.pendingList(params)
          .then(({body}) => {
            if (body.status_code === undefined) {
              this.data = body.data;
              this.total = body.meta.pagination.total;
            } else {
              this.$message.error('列表数据获取失败')
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.pendingList()
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.pendingList()
      },
      diagnosisBtn(id, index) {
        window.sessionStorage.setItem('pageIndex', this.pageIndex);
        window.sessionStorage.setItem('idList', JSON.stringify(this.data.map((item) => item.id)));
        window.sessionStorage.setItem('idIndex', index);
        this.$router.push(`/reading/${id}`);
      },
      deleteCase(id) {
        pendingService.deleteReport({ids: [id]})
          .then(({body}) => {
            this.pendingList();
          }).catch(() => {
          this.$message.error('删除失败');
        })
      },
      editCase(row) {
        this.caseForm = row;
        this.editCaseShow = true;
      },
      saveCase() {
        pendingService.saveCase(this.caseForm.id, this.caseForm)
          .then(({body}) => {
            if (body.status_code === undefined) {
              this.$message.success('修改病例信息成功');
              this.pendingList();
              this.cancelCase();
            } else {
              this.$message.error(body.message || '修改病例信息失败')
            }
          }).catch(() => {
          this.$message.error('修改病例信息失败');
        })
      },
      cancelCase() {
        this.$refs.caseForm.resetFields();
        this.caseForm = {};
        this.editCaseShow = false;
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
          .unknow {

            color: #6b6a6a;

          }
          .el-tag {
            width: 70px;
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

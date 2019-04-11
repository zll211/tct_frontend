<template>
  <div class="system-main main-container">
    <div class="common-header">
      <hzzt-title>分析方式设置</hzzt-title>
    </div>
    <div class="system-content">
      <el-checkbox-group v-model="analysisWay">
        <el-checkbox label="手动" name="analysis" @change="selectAnalysisWay('手动')"></el-checkbox>
        <el-checkbox label="自动" name="analysis" @change="selectAnalysisWay('自动')"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="common-header">
      <hzzt-title>分析后跳转</hzzt-title>
    </div>
    <div class="system-content">
      <el-checkbox-group v-model="redirect">
        <el-checkbox label="是" name="redirect" @change="selectRedirect('是')"></el-checkbox>
        <el-checkbox label="否" name="redirect" @change="selectRedirect('否')"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="common-header">
      <hzzt-title>分析结果设置</hzzt-title>
    </div>
    <div class="system-content">
      <div class="analysis-result flex align-items-center" v-for="(analysis, index) in analysisResultList" :key="index">
        <div class="flex align-items-center margin-right-common">
          <el-input-number class="margin-right-common" size="small" v-model="analysis.min" :min="1" :max="100"
                           label="描述文字"></el-input-number>
          <span class="margin-right-common">至</span>
          <el-input-number size="small" v-model="analysis.max" :min="1" :max="100" label="描述文字"></el-input-number>
        </div>
        <el-select
          class="margin-right-common"
          v-model="analysis.name"
          filterable
          allow-create
          default-first-option
          size="small"
          placeholder="请选择分析结果">
          <el-option
            v-for="item in resultList"
            :key="item.label"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
        <el-button class="margin-right-common" type="danger" icon="el-icon-delete" size="small"
                   @click="deleteAnalysisResultItem(index)"></el-button>
      </div>
      <el-button type="primary" size="small" @click="addAnalysisResultItem">新增分析项</el-button>
    </div>
    <div class="system-content" style="margin: 20px 0">
      <el-button type="primary" size="small" @click="saveSetting">保存</el-button>
    </div>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {systemService} from "../system.service";

  export default {
    components: {
      hzztTitle,
    },
    created() {
      this.getAnalysis();
    },
    data() {
      return {
        name: '',
        analysisWay: [],
        redirect: [],
        resultList: [{label: '阴性'}, {label: '疑似阳性'}, {label: '阳性'}],
        analysisResultList: [{
          min: 1,
          max: 33,
          name: '',
        }]
      }
    },
    watch: {},
    methods: {
      getAnalysis() {
        systemService.settings(['analysis_style', 'analysis_result'])
          .then(({body}) => {
            if (!body.status_code) {
              this.analysisResultList = body.analysis_result;
              this.analysisWay = [body.analysis_style];
              this.redirect = [body.redirect];
            }
          })
      },
      addAnalysisResultItem() {
        this.analysisResultList.push({name: ''});
      },
      deleteAnalysisResultItem(index) {
        this.analysisResultList.splice(index, 1);
      },
      selectAnalysisWay(way) {
        this.analysisWay = [way]
      },
      selectRedirect(data) {
        this.redirect = [data]
      },
      saveSetting() {
        const params = {
          analysis_style: this.analysisWay[0],
          redirect: this.redirect[0],
          analysis_result: this.analysisResultList,
        };
        systemService.saveSettings(params)
          .then(({body}) => {
            if (!body.status_code) {
              this.$message.success('保存成功');
            } else {
              this.$message.error('保存失败');
            }
          }).catch(() => {
          this.$message.error('保存失败');
        })
      }
    },
  }
</script>

<style lang="scss">
  @import "../../../../style/variables";

  .system-main {
    .system-content {
      padding: 0 25px;
      .analysis-result {
        margin-bottom: 10px;
      }
      .margin-right-common {
        margin-right: 10px;
      }
    }
  }

</style>

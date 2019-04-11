<template>
  <div class="main-container scan-main">
    <div class="common-header">
      <hzzt-title>rabbitmq管理</hzzt-title>
    </div>
    <div class="common-table">

      <div class="scan-table">
        <el-form class="scan-log-form" size="small" :model="scanLogForm" :rules="scanLogRules"
                 ref="scanLogForm" label-width="100px" >
          <el-form-item label="ip" prop="host">
            <el-input v-model="scanLogForm.host"></el-input>
          </el-form-item>
          <el-form-item label="port" prop="port">
            <el-input v-model="scanLogForm.port"></el-input>
          </el-form-item>
          <el-form-item label="queue" prop="from_queue">
            <el-input v-model="scanLogForm.from_queue"></el-input>
          </el-form-item>
          <el-form-item label="vhost" prop="vhost">
            <el-input v-model="scanLogForm.vhost"></el-input>
          </el-form-item>
          <el-form-item label="username" prop="username">
            <el-input v-model="scanLogForm.username"></el-input>
          </el-form-item>
          <el-form-item label="password" prop="password">
            <el-input v-model="scanLogForm.password"></el-input>
          </el-form-item>
          <el-form-item class="flex justify-content-center">
            <el-button type="primary" @click="saveScanLog">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {baseUrl} from '@/config/config';
  import HzztIcon from "../../../../components/hzztIcon";
  import {systemService} from "../system.service";

  export default {
    created() {
      this.getScanLog()
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
        data: [],
        loading: false,
        scanLogForm: {},
        scanLogRules: {
          host: [{required: true, message: '请输入RabbitMQ的ip', trigger: 'blur'}],
          port: [{required: true, message: '请输入RabbitMQ的port', trigger: 'blur'}],
          vhost: [{required: true, message: '请输入RabbitMQ的vhost', trigger: 'blur'}],
          from_queue: [{required: true, message: '请输入RabbitMQ的queue', trigger: 'blur'}],
          username: [{required: true, message: '请输入RabbitMQ的username', trigger: 'blur'}],
          password: [{required: true, message: '请输入RabbitMQ的password', trigger: 'blur'}],
        },
        scanRules: {
          name: [{required: true, message: '请输入扫描仪名称', trigger: 'blur'}],
          ip: [{required: true, message: '请输入ip地址', trigger: 'blur'}],
          version: [{required: true, message: '请输入扫描仪型号', trigger: 'blur'}],
          source_id: [{required: true, message: '请选择扫描仪来源', trigger: 'change'}],
          liable_user: [{required: true, message: '请输入扫描仪负责人', trigger: 'blur'}],
        },
        tableHeight: undefined,
      }
    },
    methods: {
      getScanLog() {
        systemService.settings()
          .then(({body}) => {
            if (!body.status_code) {
              this.scanLogForm = body || {};
            }
          })
      },
      saveScanLog() {
        this.$refs['scanLogForm'].validate((valid) => {
          if (valid) {
            systemService.saveSettings(this.scanLogForm)
              .then(({body}) => {
                if (!body.status_code) {
                  this.$message.success('保存成功');
                } else {
                  this.$message.error(body?.ret_msg || '保存失败');
                }
              }).catch(() => {
              this.$message.error('保存失败');
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss">

  .el-main {
    height: 100%;
    .scan-main {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      .common-table {
        position: relative;
        padding-bottom: 60px !important;
        flex: 1;
        .scan-table {
          height: 100%;
          .el-table__fixed-right-patch {
            background-color: #EBEEF6;
          }
          .scan-log-form {
            width: 500px;
            margin: 0 auto 0 20px;
          }
        }
      }
    }
  }
</style>

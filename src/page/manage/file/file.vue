<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>上传kfb文件</hzzt-title>
    </div>
    <div class="file-body">
      <div style="width: 500px">
        <el-upload
          class="upload-demo"
          drag
          name="file"
          action="/api/files"
          :show-file-list="false"
          :headers="uploadImgHeader"
          :on-success="onSuccess"
          accept=".kfb,.KFB"
          multiple
          ref="my-upload"
          :on-change="onChange"
          :on-progress="onProgress"
          :on-error="onError">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将kfb文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="file-list" v-if="fileList && fileList.length>0">
          <ul>
            <li class="flex align-items-center"
                v-for="(item, index) in fileList"
                :key="index">
              <div class="flex column">
                <div>
                  <i class="el-icon-document"></i>
                  <el-popover
                    placement="top-start"
                    width="200"
                    class="popover ellipsis file-name"
                    trigger="hover">
                    <p>{{item.name}}</p>
                    <span slot="reference">{{item.name}}</span>
                  </el-popover>
                  <el-input
                    v-show="item.success"
                    placeholder="请输入病理号"
                    v-model="item.pathology_id"
                    size="mini"
                    :change="pathologyChange(item.pathology_id,index)"
                    clearable>
                  </el-input>
                  <i v-show="item.success" class="el-icon-remove-outline" @click="deleteFile(index)"></i>
                </div>
                <el-progress
                  v-show="!item.success"
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="item.progressValve"
                  color="#4868B9"
                ></el-progress>
              </div>
              <!--<el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>-->
            </li>
          </ul>
        </div>
        <!-- <div class="progress" v-if="$store.state.progress&&this.$store.state.progress>0">
           <div class="progress-bar">
             <el-progress
               :text-inside="true"
               :stroke-width="18"
               :percentage="$store.state.progress*1"
               color="#4868B9"
             ></el-progress>
           </div>
           <div class="upload-progress">{{$store.state.fileList.length}}/{{$store.state.count}}</div>
         </div>-->
      </div>
      <div style="margin: 20px 0px;">
        <el-button type="primary" size="small" @click="submit"
                   :disabled="!isCanSubmit">提交
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {mapState} from 'vuex';
  import {fileService} from "./file.service";

  export default {
    name: "file",
    components: {
      hzztTitle,

    },
    data() {
      return {
        fileList: [],
        path: '',
        origin_path: '',
        pathologyValve: '',
        uploadImgHeader: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
      }
    },
    computed: {
      // ...mapState(["progress", "pathologyInfo", "deleteIndex", "count",]),
      isCanSubmit() {
        return this.fileList.length > 0 && this.fileList.every((file) => file.success);
      },
    },
    methods: {
      onChange(file, fileList) {
        /* let hash = {};
         // 去重
         let list = this.$store.state.fileListTotal.concat(fileList).reduce(function (arr, current) {
           hash[current.uid] ? '' : hash[current.uid] = true && arr.push(current);
           return arr
         }, []);
         this.$store.commit("saveStatus", {state: "fileListTotal", value: list});
         this.$store.commit("saveStatus", {state: "count", value: list.length - this.$store.state.delNum});*/
        let hash = {};
        this.fileList = [...this.fileList, ...fileList].filter((file) => {
          return hash[file.uid] ? false : (hash[file.uid] = file, true);
        }).map((item) => ({
          ...item,
          success: item.success || false,
          progressValve: item.progressValve || 0,
        }));
        // console.log(this.fileList);
      },
      // 文件上传时的钩子
      onProgress(event, file, fileList) {
        // console.log("上传的钩子111");
        const _file = this.fileList.find((item) => file.uid === item.uid);
        if (_file) {
          _file.progressValve = (event.loaded / event.total * 100).toFixed(2) / 1;
        }
        /*  let progressValve = (event.loaded / event.total * 100).toFixed(0);
          this.$store.commit("setProgress", progressValve);*/
      },
      // 失败的钩子
      onError(err, files, fileList) {
        this.$message.error(JSON.parse(err.message).message);
        // console.log("err",err);
        // console.log("第一个参数",JSON.parse(err.message).message);
      },
      // 成功的钩子
      onSuccess(response, file, fileList) {
        if (!response.status_code) {
          /* let params = {
             name: file.name,
             path: response.path,
             origin_path: response.origin_path,
           }*/
          const _file = this.fileList.find((item) => file.uid === item.uid);
          if (_file) {
            _file.success = true;
            _file.name = file.name;
            _file.path = response.path;
            _file.origin_path = response.origin_path;
          }
          //  this.$store.commit("setFileList", params);
        } else {
          this.$message.error(response.message)
        }
      },
      //提交文件信息
      submit() {
        let params = {
          data: this.fileList.map((item) => ({
            path: item.path,
            origin_path: item.origin_path,
            pathology_id: item.pathology_id,
          })),
        };
        // console.log("params",params);
        fileService.addCase(params)
          .then(({body}) => {
            if (!body.status_code) {
              this.$message.success('提交成功');
              // this.$store.commit("resetFileList");
              this.fileList = [];
              this.$refs['my-upload'].clearFiles();
              this.$router.push('/diagnostic/pending/notanalyzed');
            } else {
              this.$message.error('提交失败');
            }
          }).catch(({body}) => {
          this.$message.error(body.message);
        });
      },
      // 输入病理号操作
      pathologyChange(id, index) {
        /*  let params = {
            pathology_id: id,
            index: index
          };
          this.$store.commit("updateFileList", params);*/
        // console.log("编辑时文件列表",this.$store.state.fileList);
        this.fileList[index].pathology_id = id;
      },
      //删除文件操作
      deleteFile(index) {
        this.fileList.splice(index, 1);
        // this.$store.commit("deleteFileList", index);
        // console.log("删除后文件列表",this.$store.state.fileList);
        // console.log("this.$store.state.count",this.$store.state.count);
      }
    }
  }
</script>

<style lang="scss">
  .file-body {
    padding: 0 25px;
    .file-list {
      max-height: calc(100vh - 519px);
      margin: 20px 0;
      overflow-y: auto;
      li {
        min-height: 40px;
        min-width: 360px;
        i {
          color: #909399;
        }
        .file-name {
          width: 220px;
        }
        .el-input {
          width: 200px;
        }
        .el-icon-remove-outline {
          cursor: pointer;
          margin: 0 10px;
        }
        .el-progress {
          margin: 10px 0;
          width: 360px;
        }
      }

    }
    .progress {
      display: flex;
      .progress-bar {
        flex: 2;
      }
      .upload-progress {
        flex: 1;
      }
    }

  }
</style>

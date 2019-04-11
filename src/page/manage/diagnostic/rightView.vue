<template>
  <div class="report">
    <el-form
      size="mini"
      :model="reportForm"
      ref="reportForm"
      :rules="reportFormRules"
      v-show="showFormList"
    >
      <h3>液基薄层细胞学（TCT）报告单</h3>
      <el-row class="tct-content-one">
        <el-col :span="8">
          <p>姓名：<span>{{caseInfoForm.name}}</span></p>
          <p>取样医师：<span>{{caseInfoForm.sample}}</span></p>
        </el-col>
        <el-col :span="5">
          <p>年龄：<span>{{caseInfoForm.age}}</span></p>
          <p>性别：<span>{{caseInfoForm.gender}}</span></p>
        </el-col>
        <el-col :span="11">
          <p>病理号：<span>{{caseInfoForm.pathology_id}}</span></p>
          <p>取样日期：<span>{{caseInfoForm.sample_time}}</span></p>
        </el-col>
      </el-row>
      <el-row class="tct-content-two">
        <el-col :span="12">
          <el-row>
            <el-form-item>
              <el-col :span="9">标本满意度：</el-col>
              <el-col :span="12">
                <el-select v-model="reportForm.specimen_satisfaction">
                  <el-option label="满意" value="满意"></el-option>
                  <el-option label="基本满意" value="基本满意"></el-option>
                  <el-option label="重新采纳" value="重新采纳"></el-option>
                  <el-option label="不满意" value="不满意"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3"></el-col>
            </el-form-item>
          </el-row>
          <el-row class="form-color form-child">
            <el-form-item>
              <el-col :span="9">上皮细胞数：</el-col>
              <el-col :span="12">
                <el-select v-model="reportForm.epithelium_count">
                  <el-option label=">5000个细胞" value=">5000个细胞"></el-option>
                  <el-option label="<5000个细胞" value="<5000个细胞"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3"></el-col>
            </el-form-item>
          </el-row>
          <el-row class="form-color form-child">
            <el-form-item>
              <el-col :span="9">颈管细胞：</el-col>
              <el-col :span="12">
                <el-select v-model="reportForm.neck_canal_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3"></el-col>
            </el-form-item>
          </el-row>
          <el-row class="form-color form-child">
            <el-form-item>
              <el-col :span="9">化生细胞：</el-col>
              <el-col :span="12">
                <el-select v-model="reportForm.metaplastic_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="9">炎症程度：</el-col>
              <el-col :span="12">
                <el-select v-model="reportForm.inflammation">
                  <el-option label="无" value="无"></el-option>
                  <el-option label="轻度炎症" value="轻度炎症"></el-option>
                  <el-option label="重度炎症" value="重度炎症"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3"></el-col>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col>微生物项目：</el-col>
            <el-form-item>
              <el-col
                class="form-color"
                v-for="item in reportForm.microbial"
                :key="item.name"
                :span="12"
              >
                <el-checkbox style="margin-right: 10px" v-model="item.checked"></el-checkbox>
                {{item.name}}
              </el-col>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="tct-content-three">
        <p class="tct-content-three-header">TBS标准诊断</p>
        <div class="flex">
          <div class="flex-2">
            <p class="header-child">鳞状上皮细胞</p>
            <el-row>
              <el-col :span="12" v-for="(cell, index) in reportForm.squamous_cell" :key="index">
                <el-form-item>
                  <el-checkbox v-model="cell.checked" @change="cellCheck(cell, $event)"></el-checkbox>
                  <span>{{cell.name}}</span>
                </el-form-item>
                <el-form-item
                  class="form-color form-child"
                  v-for="(item, index) in cell.children"
                  :key="index"
                >
                  <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                  <span>{{item.name}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="flex-1">
            <p style="line-height: 30px;color: #4868B9">选取截图</p>
            <div v-if="imgCheckedList&&imgCheckedList.length>0" class="img-checked" @click="screenshotsBtn">
              <ul>
                <li v-for="(item,index) in imgCheckedList" :key="index">
                  <img :src="item.path" alt="" class="screenshot">
                </li>
              </ul>
            </div>
            <el-button v-else class="screenshots" icon="el-icon-picture-outline" @click="screenshotsBtn"></el-button>

            <el-dialog :visible.sync="dialogImage">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </div>
        </div>
        <div style="margin: 10px 0">
          <p class="header-child">腺上皮细胞</p>
          <el-row>
            <el-col :span="8" v-for="(cell, index) in reportForm.glandular_cell" :key="index">
              <el-form-item>
                <el-checkbox v-model="cell.checked" @change="cellCheck(cell, $event)"></el-checkbox>
                <span>{{cell.name}}</span>
              </el-form-item>
              <el-form-item
                class="form-color form-child"
                v-for="(item, index) in cell.children"
                :key="index"
              >
                <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                <span>{{item.name}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-form-item style="margin-bottom: 10px">诊断结果：
            <el-select v-model="reportForm.diagnosis_result" clearable>
              <el-option label="阴性" value="阴性"></el-option>
              <el-option label="阳性" value="阳性"></el-option>
              <el-option label="疑似阳性" value="疑似阳性"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="tct_diagnostic">
            <el-input
              type="textarea"
              v-model="reportForm.tct_diagnostic"
              :autosize="{ minRows: 4, maxRows: 4}"
              placeholder="专家诊断意见..."
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex justify-content-center align-items-center" style="height: 50px">
          <el-button type="primary" size="small" @click="saveReport()">保存报告</el-button>
          <el-button type="primary" size="small" @click="generateReport()">生成报告</el-button>
        </div>
      </el-row>
    </el-form>
    <div class="show-icon" :class="iconName" @click="showForm"></div>

    <el-dialog title="选择截图" :visible.sync="screenshotsVisible" :append-to-body="true" width="786px">
      <div  v-if="imgList && imgList.length">
        <div class="img-list" ref="imgList">
          <div>
            <el-button
              icon="el-icon-arrow-left"
              type="primary"
              size="mini"
              @click="imgListPageIndex--"
              circle
              :disabled="imgListPageIndex === 1 ? true : false"
            ></el-button>
          </div>
          <div style="width: 680px;height:120px;overflow: hidden;margin: 0 5px;position: relative">
            <ul
              ref="listUl"
              :style="{width: 170 * imgList.length+'px',left:-((imgListPageIndex - 1 )* 170 * 4) + 'px',transition:'left 0.6s'}"
            >
              <!--<li v-for="(item,index) in labelImage" :key="index"
                  @click="lableClick(index)">
                <img :src="item.imageUrl">
              </li>-->
              <li v-for="(item,index) in imgList" :key="index">
                <img :src="item.path" alt="" class="screenshot">
                <el-checkbox v-model="item.checked"></el-checkbox>
              </li>
            </ul>
          </div>
          <div>
            <el-button
              icon="el-icon-arrow-right"
              type="primary"
              size="mini"
              @click="imgListPageIndex++"
              circle
              :disabled="imgList.length/4 <= imgListPageIndex ? true : false"
            ></el-button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="screenshotsConfirm">确 定</el-button>
        </div>
      </div>
      <div v-else class="text-center">暂无数据</div>
    </el-dialog>
  </div>
</template>

<script>
import { pendingService } from "./pending/pending.service";
import { baseUrl } from "@/config/config";
import Vue from "vue";
export default {
  name: "rightView",
  props: {
    sectionId: String,
    reportFlex: Number,
    reportWidth: Number
  },
  data() {
    return {
      caseInfoForm: {},
      dialogImageUrl: "",
      dialogImage: false,
      imgList: [],
      iconName: "el-icon-arrow-left",
      imgListPageIndex: 1,
      imgCheckedList:[],
      reportForm: {
        specimen_satisfaction: "",
        epithelium_count: "",
        neck_canal_cell_count: "",
        metaplastic_cell_count: "",
        inflammation: "",
        diagnosis_result: "",
        microbial: [
          { name: "放线菌", checked: false },
          { name: "菌群转变", checked: false },
          { name: "滴虫感染", checked: false },
          { name: "霉菌感染", checked: false },
          { name: "HPV感染", checked: false },
          { name: "疱疹病毒感染", checked: false }
        ],
        squamous_cell: [
          {
            name: "未见上皮内病变",
            checked: false,
            children: [
              { name: "正常", checked: false },
              { name: "炎症", checked: false },
              { name: "表皮细胞萎缩", checked: false },
              { name: "宫内节育器反应", checked: false },
              { name: "妊娠反应", checked: false },
              { name: "放疗反应", checked: false },
              { name: "其他", checked: false }
            ]
          },
          {
            name: "非典型鳞状细胞",
            checked: false,
            children: [
              { name: "不能明确意义", checked: false },
              { name: "倾向上皮细胞内高度病变", checked: false }
            ]
          },
          {
            name: "上皮内低度病变",
            checked: false,
            children: []
          },
          {
            name: "上皮内高度病变",
            checked: false,
            children: [
              { name: "CIN-II级", checked: false },
              { name: "CIN-III级", checked: false }
            ]
          },
          {
            name: "鳞状细胞癌",
            checked: false,
            children: []
          }
        ],
        glandular_cell: [
          {
            name: "非典型腺细胞",
            checked: false,
            children: [
              { name: "倾向原位腺癌", checked: false },
              { name: "不能明确意义", checked: false },
              { name: "倾向良性反应性改变", checked: false }
            ]
          },
          {
            name: "腺癌",
            checked: false,
            children: [
              { name: "宫颈管", checked: false },
              { name: "宫内膜", checked: false },
              { name: "其他", checked: false }
            ]
          },
          {
            name: "非典型性腺细胞",
            checked: false,
            children: [
              { name: "宫内膜", checked: false },
              { name: "来源不明", checked: false }
            ]
          },
          {
            name: "可疑腺癌",
            checked: false,
            children: []
          }
        ]
      },
      reportFormRules: {
        tct_diagnostic: [
          { required: true, message: "请输入诊断意见", trigger: "blur" }
        ]
      },
      screenshotsVisible: false,
      showFormList: false
    };
  },
  created() {
    this.reportList();
    this.$root.$on('screen-shot', this.onScreenShot);
  },
  methods: {
    reportList() {
      pendingService
        .casesDetails(this.sectionId)
        .then(({ body }) => {
          if (body.status_code === undefined) {
            this.caseInfoForm = body;
            // console.log("body",body);
            if (body.report) {
              let tctImgList = body.report.tct_imgList || [];
              this.imgCheckedList = tctImgList.map((item)=>({
                path:item,
                checked:true
              }))
              this.reportForm = { ...this.reportForm, ...body.report };
              this.reportForm.microbial = body.report.tct_content[0];
              this.reportForm.squamous_cell = body.report.tct_content[1];
              this.reportForm.glandular_cell = body.report.tct_content[2];
              this.imgList = JSON.parse(JSON.stringify(this.imgCheckedList));
            } else {
              this.reportForm = {
                specimen_satisfaction: "",
                epithelium_count: "",
                neck_canal_cell_count: "",
                metaplastic_cell_count: "",
                inflammation: "",
                diagnosis_result: "",
                microbial: [
                  { name: "放线菌", checked: false },
                  { name: "菌群转变", checked: false },
                  { name: "滴虫感染", checked: false },
                  { name: "霉菌感染", checked: false },
                  { name: "HPV感染", checked: false },
                  { name: "疱疹病毒感染", checked: false }
                ],
                squamous_cell: [
                  {
                    name: "未见上皮内病变",
                    checked: false,
                    children: [
                      { name: "正常", checked: false },
                      { name: "炎症", checked: false },
                      { name: "表皮细胞萎缩", checked: false },
                      { name: "宫内节育器反应", checked: false },
                      { name: "妊娠反应", checked: false },
                      { name: "放疗反应", checked: false },
                      { name: "其他", checked: false }
                    ]
                  },
                  {
                    name: "非典型鳞状细胞",
                    checked: false,
                    children: [
                      { name: "不能明确意义", checked: false },
                      { name: "倾向上皮细胞内高度病变", checked: false }
                    ]
                  },
                  {
                    name: "上皮内低度病变",
                    checked: false,
                    children: []
                  },
                  {
                    name: "上皮内高度病变",
                    checked: false,
                    children: [
                      { name: "CIN-II级", checked: false },
                      { name: "CIN-III级", checked: false }
                    ]
                  },
                  {
                    name: "鳞状细胞癌",
                    checked: false,
                    children: []
                  }
                ],
                glandular_cell: [
                  {
                    name: "非典型腺细胞",
                    checked: false,
                    children: [
                      { name: "倾向原位腺癌", checked: false },
                      { name: "不能明确意义", checked: false },
                      { name: "倾向良性反应性改变", checked: false }
                    ]
                  },
                  {
                    name: "腺癌",
                    checked: false,
                    children: [
                      { name: "宫颈管", checked: false },
                      { name: "宫内膜", checked: false },
                      { name: "其他", checked: false }
                    ]
                  },
                  {
                    name: "非典型性腺细胞",
                    checked: false,
                    children: [
                      { name: "宫内膜", checked: false },
                      { name: "来源不明", checked: false }
                    ]
                  },
                  {
                    name: "可疑腺癌",
                    checked: false,
                    children: []
                  }
                ]
              };
            }
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {});
    },
    cellCheck(cell, value) {
      if (!value) {
        cell.children.forEach(item => (item.checked = value));
      }
    },
    //生成报告
    generateReport() {
      var pathList = [];
      this.imgCheckedList.forEach((item)=> {
        pathList.push(item.path)
      })
      this.$refs.reportForm.validate(valid => {
        if (valid) {
          let params = {
            section_id: this.sectionId,
            specimen_satisfaction: this.reportForm.specimen_satisfaction,
            epithelium_count: this.reportForm.epithelium_count,
            neck_canal_cell_count: this.reportForm.neck_canal_cell_count,
            metaplastic_cell_count: this.reportForm.metaplastic_cell_count,
            inflammation: this.reportForm.inflammation,
            tct_content: [
              this.reportForm.microbial,
              this.reportForm.squamous_cell,
              this.reportForm.glandular_cell
            ],
            diagnosis_result: this.reportForm.diagnosis_result,
            tct_diagnostic: this.reportForm.tct_diagnostic,
            tct_imgList: pathList
          };
          pendingService
            .patchReport(params)
            .then(({ body }) => {
              // console.log("body",body);
              if (body.status_code === undefined) {
                this.$message.success("报告生成成功！");
                this.$router.push(`/diagnostic/pending/analyzed`);
              }
            })
            .catch(() => {
              this.$message.error("生成失败");
            });
        }
      });
      // console.log("this.reportForm",this.reportForm);
    },
    //保存报告
    saveReport() {
      // patchReport
      var pathList = [];
      this.imgCheckedList.forEach((item)=> {
        pathList.push(item.path)
      })
      this.$refs.reportForm.validate(valid => {
        if (valid) {
          let params = {
            section_id: this.sectionId,
            specimen_satisfaction: this.reportForm.specimen_satisfaction,
            epithelium_count: this.reportForm.epithelium_count,
            neck_canal_cell_count: this.reportForm.neck_canal_cell_count,
            metaplastic_cell_count: this.reportForm.metaplastic_cell_count,
            inflammation: this.reportForm.inflammation,
            tct_content: [
              this.reportForm.microbial,
              this.reportForm.squamous_cell,
              this.reportForm.glandular_cell
            ],
            diagnosis_result: this.reportForm.diagnosis_result,
            tct_diagnostic: this.reportForm.tct_diagnostic,
            tct_imgList: pathList
          };
          pendingService
            .saveReport(params)
            .then(({ body }) => {
              // console.log("body",body);
              if (body.status_code === undefined) {
                this.$message.success("保存成功！");
                this.$router.push(`/diagnostic/pending/analyzed`);
              }
            })
            .catch(() => {
              this.$message.error("保存失败");
            });
        }
      });
    },
    //选择截图
    screenshotsBtn() {
      this.screenshotsVisible = true;
      this.imgListPageIndex = 1;
    },
    //选择截图提交
    screenshotsConfirm() {
      let checkedList = this.imgList.filter(item => item.checked === true);
      if (checkedList.length <= 2) {
        this.imgCheckedList = checkedList;
        this.screenshotsVisible = false;
      } else {
        this.$message.warning('最多可选择两张截图')
      }
    },
    showForm() {
      this.showFormList = !this.showFormList;
      if (this.showFormList) {
        this.iconName = "el-icon-arrow-right";
        this.$emit("showReport");
        let reduceWidth = document.getElementsByClassName('reading')[0].getBoundingClientRect().width - 336 - 520;
        this.$root.$emit('size-change', {width:reduceWidth});
      } else {
        this.iconName = "el-icon-arrow-left";
        this.$emit("hiddenReport");
        let addWidth = document.getElementsByClassName('reading')[0].getBoundingClientRect().width - 356;
        this.$root.$emit('size-change', {width:addWidth});
      }
    },
    async onScreenShot(data) {
      try {
        console.log('onScreenShot started');
        const imageBlob = this.convertBase64UrlToBlob(data);
        // console.log('imageBlob', imageBlob);
        var formData = new FormData();
        formData.append("image",imageBlob);
        const response = await Vue.http.post(`${baseUrl}/images`, formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        });
        if (response.body.path) {
          this.imgList.push({path:response.body.path,checked:false});

        }
      } catch (e) {
        console.error('onScreenShot catch error', e);
        this.$message.error('截图失败');
      }
    },
    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      // var bytes = urlData;
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    }
  }
};
</script>

<style lang="scss" scoped>
.report {
  position: relative;
  height: 100%;
  .el-form {
    height: calc(100vh - 90px);
    overflow-y: auto;
    .form-color {
      color: #8993a8;
    }
    .form-child {
      padding-left: 10px;
    }
    .el-form-item--mini {
      margin-bottom: 10px;
    }
    h3 {
      text-align: center;
      line-height: 50px;
      font-size: 18px;
    }
    .tct-content-one {
      padding: 5px 0;
      line-height: 26px;
      border-bottom: 1px solid #eef1f9;
      span {
        color: #8993a8;
      }
    }
    .tct-content-two {
      padding: 15px 0;
      border-bottom: 1px solid #eef1f9;
    }
    .tct-content-three {
      padding-top: 15px;
      .el-form-item--mini {
        margin-bottom: 0;
      }
      .tct-content-three-header {
        text-align: center;
        font-size: 16px;
      }
      .header-child {
        line-height: 26px;
        font-weight: bold;
      }
      .img-checked {
        li {
          width: 140px;
          height: 120px;
          border: 1px solid #bfc5d2;
          margin-bottom: 4px;
          cursor: pointer;
          img {
            width: 140px;
            height: 120px;
          }
        }
      }
      .screenshots {
        background-color: #ffffff;
        border: 1px solid #bfc5d2;
        border-radius: 6px;
        width: 140px;
        height: 120px;
        i {
          font-size: 28px;
          color: #efefef;
        }
        .screenshot {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
  .show-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #4868b9;
    position: absolute;
    top: 50%;
    width: 14px;
    height: 84px;
    margin-top: -42px;
    margin-left: -20px;
    cursor: pointer;
  }
  .el-icon-arrow-left:before,
  .el-icon-arrow-right:before {
    color: #ffffff;
  }
}
.img-list {
  overflow: hidden;
  display: flex;
  align-items: center;
  ul {
    position: absolute;
    height: 120px;
    background: rgba(255, 255, 255, 0.82);
    li {
      position: relative;
      display: inline-block;
      width: 160px;
      height: 120px;
      margin: 0 5px;
      border: 1px solid #e8ecf8;
      box-sizing: border-box;
      img {
        width: 160px;
        height: 120px;
      }
      .el-checkbox {
        position: absolute;
        top: 2px;
        right: 6px;
      }
    }
  }
}
.dialog-footer {
  text-align: right;
  box-sizing: border-box;
  margin-top: 10px;
}
</style>

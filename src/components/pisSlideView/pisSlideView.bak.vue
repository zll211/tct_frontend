<template>
  <div class="pis-slide-view">
    <span v-show="false">{{labelLength}}</span>
    <el-dialog width="500px" :title="title" :visible.sync="labelChangeView"
               :before-close="closeLabelDialog"
               append-to-body>
      <el-form :model="labelForm" ref="labelForm" label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" label-width="40px" prop="name">
              <el-select v-if="labelType === 'edit'" size="small"
                         v-model="labelForm.name"
                         placeholder="请选择名称" style="width: 100%"
                         @change="selectLabelChange">
                <el-option
                  v-for="(name,index) in labelNameList"
                  :key="index"
                  :label="name"
                  :value="name">
                </el-option>
              </el-select>
              <el-input v-if="labelType === 'add'" size="small"
                        v-model="labelForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="labelType === 'edit'">
            <el-form-item label="操作" label-width="40px" prop="name">
              <div class="flex align-items-center" style="height: 40px">
                <hzzt-icon
                  :icon-src="deleteImg"
                  @icon-click="deleteLabel(labelForm.id)"
                  icon-text='删除'></hzzt-icon>
                <hzzt-icon
                  :icon-src="hideImg"
                  @icon-click="hideLabel(labelForm.id, !labelForm.show)">
                  <span
                    slot="iconText">{{labelForm.show===false?'显示': '隐藏'}}</span>
                </hzzt-icon>
                <hzzt-icon
                  :icon-src="hideAllImg"
                  @icon-click="hideAllLabel(!showAllLabel)">
                  <span slot="iconText">{{!showAllLabel?'全部显示': '全部隐藏'}}</span>
                </hzzt-icon>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="线宽" label-width="40px">
              <el-select style="width: 150px" size="small"
                         v-model="labelForm.width"
                         placeholder="请选择线宽"
                         filterable
                         allow-create
                         default-first-option>
                <el-option
                  v-for="(lineWidth,index) in lineWidthList"
                  :key="index"
                  :label="lineWidth"
                  :value="lineWidth">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item class="flex justify-content-between" label="颜色"
                          label-width="40px">
              <div class="flex align-items-center">
                <span style="margin-right: 10px">{{labelForm.color}}</span>
                <el-color-picker v-model="labelForm.color"
                                 size="small"></el-color-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" label-width="40px">
              <el-input size="small" type="textarea" v-model="labelForm.description"
                        :autosize="{ minRows: 3, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="定位图标" label-width="80px">
              <el-radio-group
                class="flex align-items-center justify-content-between"
                v-model="labelForm.pin">
                <el-radio label="1" class="flex align-items-center">
                  <img class="pin-img" src="./slideview/assets/img/pin_1.png">
                </el-radio>
                <el-radio label="2" class="flex align-items-center">
                  <img class="pin-img" src="./slideview/assets/img/pin_2.png">
                </el-radio>
                <el-radio label="3" class="flex align-items-center">
                  <img class="pin-img" src="./slideview/assets/img/pin_3.png">
                </el-radio>
                <el-radio label="4" class="flex align-items-center">
                  <img class="pin-img" src="./slideview/assets/img/pin_4.png">
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="labelType==='edit'">
            <el-form-item label="测量信息" label-width="80px">
              <div v-html="getMeasureInfo(labelForm)"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLabelDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="saveLabelChange()" size="small">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog class="image-info" width="600px" title="图像信息"
               :visible.sync="imageInfoView"
               append-to-body>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="文件名">
          <span class="flex-1">{{imageInfo.fileName}}</span>
        </el-form-item>
        <el-form-item label="文件名">
          <span class="flex-1">{{imageInfo.fileName}}</span>
        </el-form-item>
        <el-form-item label="图像像素">
          <span class="flex-1">{{imageInfo.width}}Pixel - {{imageInfo.height}}Pixel</span>
        </el-form-item>
        <el-form-item label="扫描倍率">
          <span class="flex-1">{{imageInfo.scanScale|| '无'}}</span>
        </el-form-item>
        <el-form-item label="扫描时刻">
          <span class="flex-1">{{imageInfo.fileName}}</span>
        </el-form-item>
        <el-form-item label="扫描时间">
          <span class="flex-1">{{imageInfo.scanDuration||0}}ms</span>
        </el-form-item>
        <el-form-item label="预览图" label-position="top">
        </el-form-item>
        <el-form-item class="flex" label-width="0px">
          <img class="preview-img flex-1" style="width: 180px" alt="预览图图片"
               :src="imageInfo.labelImg">
          <img class="preview-img flex-1" alt="预览图图片"
               :src="imageInfo.previewImg">
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- <div class="file-change flex column" v-if="fileNameList.length>1">
      <el-button type="primary" size="small" class="last-btn" :disabled="fileIndex===0" @click="lastFile">上一例
      </el-button>
      <el-button type="primary" size="small" class="next-btn" :disabled="fileIndex===fileNameList.length-1"
                 @click="nextFile">下一例
      </el-button>
    </div> -->

    <image-label-list ref="imageLabelList" :image-list="labelImage" @switch-picture="switchPicture"></image-label-list>
  </div>
</template>

<script>
  import {pisSlideViewService} from './pisSlideView.service';
  import imageLabelList from './imageLabelList';
  import {baseUrl} from '@/config/config';
  import {mapState} from 'vuex';
  import {formatDateTime, transformArrayBufferToBase64} from '../../config/utils';
  import hzztIcon from '../hzztIcon';

  import deleteImg from './slideview/assets/img/dialog/delete.png';
  import hideImg from './slideview/assets/img/dialog/hide.png';
  import hideAllImg from './slideview/assets/img/dialog/allhide.png';

  const encodeQueryData = (data) => {
    let ret = [];
    for (let d in data) {
      if (Object.prototype.hasOwnProperty.call(data, d)) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }
    }
    return ret.join('&');
  };

  export default {
    name: 'pisSlideView',
    components: {hzztIcon, imageLabelList},
    data() {
      return {
        slideView: {},
        labelChangeView: false,
        labelImage: [],
        innerLabelImage: [],
        imageInfoView: false,
        title: '',
        labelForm: {width: 2, color: '#0000FF', pin: '1', description: ''},
        labelNameList: [],
        lineWidthList: [1, 2, 5, 8, 10],
        labelType: 'add',
        imageInfo: {},
        deleteImg: deleteImg,
        hideImg: hideImg,
        hideAllImg: hideAllImg,
        showAllLabel: true,
        maskType: 0,
        page: 1,
        cateList: [{
          value: 0,
          label: '肾小囊',
          color: '#0000ff7d',
          num: 0,
          list: [],
        }, {
          value: 1,
          label: '肾小球',
          color: '#00ff007d',
          num: 0,
          list: [],
        }, {
          value: 2,
          label: '近曲小管',
          color: '#ff00007d',
          num: 0,
          list: [],
        }, {
          value: 3,
          label: '远曲小管',
          color: '#ffff007d',
          num: 0,
          list: [],
        }, {
          value: 4,
          label: '小动脉',
          color: '#ff00ff7d',
          num: 0,
          list: [],
        }, {
          value: 5,
          label: '新月体',
          color: '#00ffff7d',
          num: 0,
          list: [],
        }, {
          value: 6,
          label: '其他',
          color: '#00ffff',
          num: 0,
          list: [],
        }],
      };
    },
    props: {
      fileName: '',
      fileIndex: {
        type: Number,
        default: 0,
      },
      labelList: {
        type: Array,
        default: () => [],
      }
    },
    watch: {
      fileName() {
        this.reload();
      }
    },
    computed: {
      ...mapState([
        'collapse',
      ]),
      labelLength() {
        if (this.slideView && this.slideView.setLabelList) {
          this.slideView.setLabelList(this.labelList);
        }
         return this.labelList.length;
      }
    },
    created() {

    },
    async mounted() {
      // await import('./slideview/slideview');
      this.init();
    },
    methods: {
      reload() {
        this.viewDestroy();
        setTimeout(() => {
          this.init();
        }, 100);
      },
      lastFile() {
        this.$emit('update:fileIndex', this.fileIndex - 1);
        this.reload();
      },
      nextFile() {
        this.$emit('update:fileIndex', this.fileIndex + 1);
        this.reload();
      },
      changeMaskType(category) {
        this.maskType = category;
        this.slideView.board.Mask.setDrawParams(20, this.cateList[this.maskType].color);
        if (this.cateList[this.maskType].num === this.cateList[this.maskType].list.length && this.cateList[this.maskType].num !== 0) {
          this.slideView.setLabelList(this.cateList[this.maskType].list);
          this.imageLabelList();
          return;
        }
        this.page = 1;
        this.slideView.setLabelList([]);
        this.labelImage = [];
        this.drawLabelList({
          path: this.fileName,
          cate: this.maskType === 6 ? undefined : this.maskType,
          page: this.page,
          page_size: 100,
        });
      },
      async init() {
        // if (!this.fileName) {
        //   return;
        // }
        try {
          // this.fileName = this.fileNameList[this.fileIndex];
          if(!this.fileName) return;
          await this.initSlideView();
          //await this.labelCount();
          this.drawPointList();
          this.pointListChange();
          this.labelChange();
          this.selectPoint();
          this.screenShotImageChange();
          this.showImageInfo();
          this.$root.$on('size-change', this.resize);
        } catch (e) {
          console.error(e);
          this.$message.error('读取图像信息失败');
        }
      },
      viewDestroy() {
        this.$root.$off('size-change', this.resize);
        if (!this.slideView || !this.slideView.destroy) return;
        this.slideView.destroy();
        this.slideView = null;
      },
      resize({width, height} = {}) {
        if (this.slideView?.resizeViewContainer) {
          this.slideView.resizeViewContainer({
            width: width || this.$el.getBoundingClientRect().width,
            height: height|| this.$el.getBoundingClientRect().height,
          });
        }
      },
      async initSlideView() {
        const {body} = await pisSlideViewService.getImageInfo(this.fileName);
        this.imageInfo = body;
        this.imageInfo.scanTime = body.scanTime && formatDateTime(new Date(body.scanTime));
        this.imageInfo.fileName = this.fileName;
        this.imageInfo.previewImg = `${baseUrl}/slice/get_image?file=${this.fileName}&type=preview`;
        this.imageInfo.labelImg = `${baseUrl}/slice/get_image?file=${this.fileName}&type=label`;
        const PisSlideView = slideView.default;
        let params = {};
        params.file = this.fileName;
        this.slideView = new PisSlideView({
          el: this.$el,
          fileName: this.fileName,
          thumbnail: `${baseUrl}/slice/get_image?file=${this.fileName}&type=thumbnail`,
          // width: window.innerWidth - 181,
          height: this.$el.getBoundingClientRect().height,
          scale: body.scanScale,
          imageCapRes: body.imageCapRes,
          control: {
            options: {
              style: 'bottom: 90px; right: 20px',
            },
          },
          // showBoard: false,
          // showMenu: false,
          openSeadragonOptions: {
            id: 'hzzt_viewer',
            // prefixUrl: '/test/js/images/',
            showNavigationControl: false,
            navigatorSizeRatio: 0.25,
            wrapHorizontal: false,
            maxZoomLevel: body.scanScale * 2,
            minScrollDeltaTime: 10,
            zoomPerClick: 1.0,
            gestureSettingsMouse: {
              clickToZoom: false,
            },
            tileSources: {
              height: body.height,
              width: body.width,
              tileSize: 256,
              minLevel: 10,
              getTileUrl(level, x, y) {
                params.x = x;
                params.y = y;
                if (body.fileNum == level) {
                  level = body.scanScale;
                  params.scale = level.toFixed(6);
                } else {
                  level = body.scanScale / Math.pow(2, body.fileNum - level);
                  params.scale = level.toFixed(6);
                  level = body.ratiomap[level.toFixed(6)];
                  if (level === undefined) {
                    level = 0;
                  }
                }
                params.level = level;
                // return 'http://192.168.1.29:8011/api/slide/view?'+ encodeQueryData(params) ;
                return `/image.php?${encodeQueryData(params)}`;
                //${slideViewUrl}
              },
            },
          },
        });

        //this.slideView.board.Mask.setDrawParams(20, this.cateList[this.maskType].color);
        this.slideView.setLabelList(this.labelList);
      },
      labelCount() {
        return pisSlideViewService.labelCount(this.fileName)
          .then(({body}) => {
            if (Array.isArray(body)) {
              this.cateList.forEach((cate) => {
                cate.num = body.find((item) => {
                  if (!item.cate) {
                    return cate.value === 6;
                  } else {
                    return item.cate == cate.value;
                  }
                })?.count / 1 || 0;
              })
            }
          }).finally(() => {
          });
      },
      drawPointList() {
        return pisSlideViewService.navigatorPointList(this.fileName)
          .then((res) => {
            this.slideView.navigator.drawPointList(res.data.data);
          }).finally(() => {
          });
      },
      pointListChange() {
        this.slideView.addHandler('point-list-change', (e) => {
          pisSlideViewService.navigatorPoint(this.slideView.navigator.pointList, this.fileName)
            .then((res) => {
              this.slideView.navigator.drawPointList(res.data.data);
            });
        });
      },
      drawLabelList(params) {
        return pisSlideViewService.labelList(params).then(({body}) => {
          if (params.cate !== this.maskType && (params.cate !== undefined && this.maskType !== 6)) return;
          if (body.meta.has_more_pages && this.slideView) {
            this.drawLabelList({
              path: this.fileName,
              cate: this.maskType === 6 ? undefined : this.maskType,
              page: ++this.page,
              page_size: 100,
            });
          }
          this.initLabelList([...this.cateList[this.maskType]?.list || [], ...body.list.map((item) => JSON.parse(item.annotation))], params);
        });
      },
      imageLabelList(params) {
        /*pisSlideViewService.labelImageList(params)
          .then(({body}) => {
            if (Array.isArray(body)) {
              this.innerLabelImage = [...this.innerLabelImage, ...body];
              // this.setImageLabelList(this.innerLabelImage);
            }
          });*/
        this.labelImage = this.cateList[this.maskType].list.filter((item) => item.imageData).map((item) => {
          const imageData = new ImageData(item.imageData.data, Math.round(item.imageData.width), Math.round(item.imageData.height));
          const canvas = document.createElement('canvas');
          canvas.width = item.imageData.width;
          canvas.height = item.imageData.height;
          const content = canvas.getContext('2d');
          content.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL();
          return {
            id: item.id,
            select: false,
            imageUrl: dataURL,
          }
        })
      },
      setImageLabelList(list) {
        this.labelImage = list.map((item) => ({...item, select: false})).filter((item) => {
          return !!~this.slideView.labelList.findIndex((label) => {
            label.select = false;
            const region1 = item.region;
            const region2 = label.region;
            return region1.width === region2.width && region1.height === region2.height && region1.x === region2.x && region1.y === region2.y;
          })
        });
      },
      switchPicture(id) {
        this.labelImage.forEach((item) => {
          item.select = item.id === id;
        });
        this.slideView.labelList.forEach((item) => item.select = false);
        const label = this.slideView.labelList.find((item) => item.id === id);
        if (!label) return;
        label.select = true;
        this.slideView.area.moveCenterPoint(label);
        this.slideView.change();
      },
      labelChange() {
        this.slideView.$on('label-change', (e) => {
          this.labelType = e.detail.type;
          switch (e.detail.type) {
            case 'edit':
              const label = e.detail.label || this.slideView.labelList[0];
              if (!label) {
                return;
              }
              this.title = '编辑注释';
              this.labelChangeView = true;

              if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
              this.labelForm = Object.assign({}, label);
              break;
            case 'delete': {
              if (!e.detail.label) {
                this.$message.warning('请选择删除的标签');
                return;
              }
              this.deleteLabel(e.detail.label.id);
            }
              break;
            case 'add': {
              const label = e.detail.label;
              this.title = '添加注释';
              this.labelChangeView = true;
              if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
              this.labelForm = Object.assign({}, label, {
                width: 2,
                color: '#0000FF',
                pin: '1',
                name: '图型' + this.slideView.labelList.length,
                description: '',
              });
            }
              break;
            case 'move': {
              const label = e.detail.label;
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                });
            }
              break;
            case 'maskEdit': {
              const label = e.detail.label;
              if (!label) {
                return;
              }
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                  this.$message.success('修改成功');
                  this.slideView.change();
                }).catch(() => {
                this.$message.error('修改失败');
              });
            }
              break;
            case 'maskAdd': {
              const label = e.detail.label;
              pisSlideViewService.saveLabel(this.getShapeParams(label), this.fileName)
                .then(({body}) => {
                  if (body.annotation) {
                    let annotation = JSON.parse(body.annotation);
                    if (!annotation) return;
                    annotation.imageData = annotation.imageData && {
                      data: new Uint8ClampedArray(annotation.imageData.data),
                      width: annotation.imageData.width,
                      height: annotation.imageData.height,
                    };
                    this.cateList[annotation.category].list.push(annotation);
                    this.slideView.setLabelList(this.cateList[annotation.category].list);
                    this.cateList[annotation.category].num++;
                    this.imageLabelList();
                    this.$message.success('新增成功');
                  } else {
                    this.$message.error('新增失败');
                  }
                }).catch((e) => {
                console.log(e);
                this.$message.error('新增失败');
              });
            }
              break;
          }
        });
      },
      selectPoint() {
        this.slideView.$on('select-point', (e) => {
          const label = e.detail;
          if (!label) {
            this.labelImage.forEach((item) => item.select = false);
          } else {
            const index = this.slideView.labelList.findIndex((item) => item === label);
            if (!!~index) {
              this.labelImage.forEach((item) => item.select = false);
              this.labelImage[index] ? this.labelImage[index].select = true : undefined;
              this.$refs.imageLabelList.resetIndexData(index);
            }
          }
        })
      },
      selectLabelChange(name) {
        if (this.$refs.labelForm) this.$refs.labelForm.resetFields();
        const labelList = this.slideView.labelList.map((item) => {
          item.select = false;
          return item;
        });
        const label = labelList.find((item) => item.name === name);
        label.select = true;
        this.labelForm = Object.assign({}, label);
        this.slideView.area.moveCenterPoint(this.labelForm);
      },
      saveLabelChange() {
        if (this.labelType === 'add') {
          if (!this.labelForm.name) {
            this.$message.warning('请输入标签名称');
            return;
          }
          if (this.slideView.labelList.find((label) => label.name === this.labelForm.name)) {
            this.$message.warning('标签名称重复');
            return;
          }

          pisSlideViewService.saveLabel(this.getShapeParams(this.labelForm), this.fileName)
            .then(({body}) => {
              if (body.annotation) {
                this.cateList[6].list.push(JSON.parse(body.annotation));
                this.slideView.setLabelList(this.cateList[6].list);
                this.cateList[6].num++;
                this.imageLabelList();
                this.$message.success('新增成功');
                this.closeLabelDialog();
              } else {
                this.$message.error('新增失败');
              }
            }).catch(() => {
            this.$message.error('新增失败');
          });
        } else {
          this.labelNameList = [...new Set((body || []).filter((item) => item.id).map((item) => item.name || item.id))];
          this.slideView.labelList.forEach((item) => {
            if (item.id == this.labelForm.id) {
              item = Object.assign(item, this.getShapeParams(this.labelForm));
              item.select = true;
            }
          });
          pisSlideViewService.saveLabel(this.getShapeParams(this.labelForm), this.fileName)
            .then(({body}) => {
              this.$message.success('修改成功');
              this.labelChangeView = false;
              this.slideView.change();
            }).catch(() => {
            this.$message.error('修改失败');
          });
        }
      },
      deleteLabel(id) {
        this.cateList[this.maskType].list.splice(this.cateList[this.maskType].list.findIndex((item) => item.id == id), 1);
        this.slideView.setLabelList(this.cateList[this.maskType].list);
        this.cateList[this.maskType].num--;
        pisSlideViewService.deleteLabel(id, this.fileName)
          .then(({body}) => {
            this.imageLabelList();
            this.$refs.imageLabelList.resetIndexData();
            this.labelChangeView = false;
            this.$message.success('删除成功');
          }).catch(() => {
          this.$message.error('删除失败');
        });
      },
      hideLabel(id, state) {
        this.slideView.labelList.forEach((item) => {
          if (item.id === id) {
            this.labelForm.show = state;
            item.show = state;
          }
        });
        this.slideView.change();
      },
      hideAllLabel(state) {
        this.showAllLabel = state;
        this.slideView.labelList.forEach((item) => item.show = state);
        this.slideView.change();
      },
      screenShotImageChange() {
        this.slideView.$on('screen-image-change', (e) => {
          console.log('screenShotImageChange e', e);
          if (e.detail.type === 'done') {
            this.$root.$emit('screen-shot', e.detail.dataUrl);
          }
        });
      },
      getMeasureInfo(draw) {
        draw = this.slideView.convertNoteForm(draw);
        const distX = (draw.startPoint.x - draw.endPoint.x) * this.slideView.imageCapRes;
        const distY = (draw.startPoint.y - draw.endPoint.y) * this.slideView.imageCapRes;
        if (draw.type === 'Line' || draw.type === 'Arrow') {
          return `<p>长度: ${draw.perimeter.toFixed(2)}微米</p>`;
        } else if (draw.type === 'Rectangle' || draw.type === 'Ellipse') {
          return `<p>宽: ${Math.abs(distX).toFixed(2)}
微米</p>
<p>高: ${Math.abs(distY).toFixed(2)}微米</p>
<p>面积: ${draw.acreage.toFixed(2)}平方微米</p>
<p>周长: ${draw.perimeter.toFixed(2)}微米</p>`;
        } else if (draw.type === 'Position' || draw.type === 'Curve') {
          return '暂无';
        }
      },
      getShapeParams(params) {
        const PisSlideView = slideView.default;
        return {
          id: params.id,
          width: params.width,
          description: params.description,
          name: params.name || params.id,
          startPoint: params.startPoint,
          endPoint: params.endPoint,
          color: PisSlideView.convertColorToInt(params.color),
          type: params.type,
          pin: params.pin,
          points: params.points,
          scale: params.scale,
          region: params.region,
          imageData: params.imageData,
          category: params.type === 'Mask' ? this.maskType : undefined,
          extra: params.extra,
        };
      },
      closeLabelDialog() {
        if (this.labelType === 'add') {
          const board = this.slideView.board;
          if (board.canDraw) {
            const {type} = board.drawParams;
            board[type].clearCanvas();
            board.canDraw = false;
          }
        }
        this.labelChangeView = false;
      },
      showImageInfo() {
        this.slideView.$on('image-info', (e) => {
          this.imageInfoView = true;
        });
      },
      initLabelList(data, params) {
        this.labelNameList = [...new Set((data || []).filter((item) => item.id).map((item) => item.name || item.id))];
        let list = [];
        data.forEach((item) => {
          if (list.find((_item) => _item.id === item.id)) {
          } else {
            list.push(item);
          }
        });
        this.cateList[this.maskType].list = (list || []).filter((item) => item.id).map((item) => ({
          ...item,
          imageData: item.imageData && {
            data: new Uint8ClampedArray(item.imageData.data),
            width: item.imageData.width,
            height: item.imageData.height,
          }
        }));
        this.slideView.setLabelList(this.cateList[this.maskType].list);
        this.imageLabelList();
      },
    },
    beforeDestroy() {
      this.viewDestroy();
    },
    destroyed() {
    },
  };


</script>

<style scoped lang="scss">
  .pis-slide-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    .file-change {
      position: absolute;
      right: 20px;
      top: 220px;
      z-index: 999;
      .next-btn {
        margin-left: 0;
        margin-top: 10px;
      }
    }
    .pin-img {
      height: 37px;
      width: 31px;
    }
    .hzzt-icon {
      margin-right: 20px;
    }
    .mask-select {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
    }

  }

  .image-info {
    .preview-img {
      height: 180px;
      max-width: 360px;
      img {
        height: 100%;
      }
    }
    .el-form-item {
      word-break: break-all;
      &.el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>

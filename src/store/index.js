import Vue from 'vue';
import Vuex from 'vuex';
import AnalysisModule, {ANALYSIS_MODULE_NAME} from './analysis.module';
import ConfigModule, {CONFIG_MODULE_NAME} from './config.module';

Vue.use(Vuex);

const state = {
  urlList: [],
  menus: [],
  isLogin: false,
  user: {},
  collapse: false,
  progress: 0,
  fileList: [],
  count: 0,
  delNum: 0,
  fileListTotal: [],
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setURL(state, list) {
    state.urlList = list;
  },
  setMenus(state, menus) {
    state.menus = menus;
  },
  isLogin(state, status) {
    state.isLogin = status;
  },
  setCollapse(state, collapse) {
    state.collapse = collapse;
  },
  setProgress(state, progress) {
    state.progress = progress;
  },
  setFileList(state, fileList){
    state.fileList.push({
      name:fileList.name,
      path:fileList.path,
      origin_path:fileList.origin_path,
      pathology_id: ''
    })
  },
  updateFileList(state, pathologyInfo) {
    state.fileList[pathologyInfo.index].pathology_id = pathologyInfo.pathology_id
  },
  deleteFileList(state, deleteIndex) {
    state.fileList.splice(deleteIndex,1);
    state.count--;
    state.delNum++;
    // console.log("state.delNum",state.delNum);
  },
  saveStatus(state, params) {
    state[params.state] = params.value;
  },
  resetFileList() {
    state.fileList = [];
    state.progress = 0;
    state.count = 0;
    state.delNum = 0;
    state.leaveCount = 0
  }
};

const actions = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    [ANALYSIS_MODULE_NAME]: AnalysisModule,
    [CONFIG_MODULE_NAME]: ConfigModule
  }
});

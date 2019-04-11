import Config from '@/config/config';
import { ProcessingAnalysisStatus } from '@/services/analysis.service';
export const UPDATE_CURRENT = 'UPDATE_CURRENT';
export const ADD_PICTURE = 'ADD_PICTURE';
export const UPDATE_PICTURES = 'UPDATE_PICTURES';
export const SET_PENDING_COUNT = 'SET_PENDING_COUNT';
export const ANALYSIS_MODULE_NAME = 'analysis';
const state = {
  // 分析中的病理
  current: {},
  // 病理识别图
  pictures: [],
  // 等待分析的个数
  pendingCount: 0
};

const mutations = {
  // 更新分析进度
  [UPDATE_CURRENT](state, current) {
    if (current.id !== 0) {
      // 有效信息
      console.log('new current', current);
      if (current.id !== state.current.id && state.current.id !== 0) {
        state.pictures = [];
      }
      state.current = {
        ...state.current,
        ...current
      };
      if (current.status === ProcessingAnalysisStatus.done) {
        // 如果这是最后一个
        if (state.pendingCount === 0) {
          document.title = Config.mainTitle;
          state.current = {};
          return;
        }
        // 如果完成就置为100
        state.current.progress = 100;
      } else {
        state.current.progress = current.progress || 0;
      }
      state.current.status = current.status || ProcessingAnalysisStatus.processing;
      const progress = state.current.progress;
      // 更新title
      let prefix = '';
      switch (progress) {
        case 0:
          prefix = '开始分析';
          break;
        case 100:
          prefix = '分析完成';
          break;
        default:
          prefix = '分析中';
      }
      document.title = `${prefix} ${progress}% ---- 等待分析:${state.pendingCount}`;
    }
  },

  // 更新识别图片
  [UPDATE_PICTURES](state, pictures) {
    // 是当前正在分析的病理
    state.pictures = pictures;
  },

  // 设置待分析数组
  [SET_PENDING_COUNT](state, count) {
    state.pendingCount = count;
  }
};

const getters = {
  // 是否有正在分析
  hasProcessing: state => state.current.hasOwnProperty('id') && state.current.id > 0
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};

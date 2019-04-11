export const UPDATE_ANALYSIS_CONFIG = 'UPDATE_ANALYSIS_CONFIG';
export const UPDATE_RABBITMQ_CONFIG = 'UPDATE_RABBITMQ_CONFIG';
export const CONFIG_MODULE_NAME = 'config';

const state = {
  analysis: {},
  rabbitmq: {}
}

const mutations = {
  [UPDATE_ANALYSIS_CONFIG](state, payload) {
    state.analysis = payload;
  },
  [UPDATE_RABBITMQ_CONFIG](state, payload) {
    state.rabbitmq = payload;
  }
}

export default {
  namespaced: true,
  state,
  mutations
};
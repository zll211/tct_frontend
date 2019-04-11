import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 诊断管理的服务
 * @class
 */
class DiagnosticService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 待诊断列表接口
   * @return {Promise}
   */
  toDiagnoseList(params) {
    // return Vue.http.get(`${baseUrl}/auth_log`, {params: params});
  }

  /**
   * 诊断中列表接口
   * @return {Promise}
   */
  diagnosisOfList(params) {
    // return Vue.http.get(`${baseUrl}/opt_log`, {params: params});
  }

  /**
   * 已诊断列表接口
   * @return {Promise}
   */
  hasBeenDiagnosed(params) {
    // return Vue.http.get(`${baseUrl}/opt_log`, {params: params});
  }

}

const diagnosticService = new DiagnosticService();

export {diagnosticService};

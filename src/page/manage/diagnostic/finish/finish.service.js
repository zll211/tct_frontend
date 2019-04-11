import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 诊断管理模块的服务
 * @class
 */
class FinishService {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * 已诊断列表接口
   * @return {Promise}
   */
  finishList(params) {
    return Vue.http.get(`${baseUrl}/sections`,{params:params});
  }

  /**
   * 删除病例
   * @param {object} body
   * @return {Promise}
   */
  deleteReport(body) {
    return Vue.http.delete(`${baseUrl}/sections`, {body});
  }
}

const finishService = new FinishService();

export {finishService};

import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 诊断管理模块的服务
 * @class
 */
class PendingService {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * 待诊断列表接口
   * @return {Promise}
   */
  pendingList(params) {
    return Vue.http.get(`${baseUrl}/sections`, {params: params});
  }

  /**
   * 获取病例详情接口
   * @return {Promise}
   */
  casesDetails(id) {
    return Vue.http.get(`${baseUrl}/sections/${id}?include=report`);
  }

  /**
   * 保存报告接口
   * @return {Promise}
   */
  saveReport(data) {
    return Vue.http.post(`${baseUrl}/reports`, data);
  }

  /**
   * 生成报告接口
   * @return {Promise}
   */
  patchReport(data) {
    return Vue.http.patch(`${baseUrl}/reports`, data);
  }

  /**
   * 删除病例
   * @param {object} body
   * @return {Promise}
   */
  deleteReport(body) {
    return Vue.http.delete(`${baseUrl}/sections`, {body});
  }

  uploadJson(body) {
    return Vue.http.post(`${baseUrl}/images`, body);
  }

  identificationData(body) {
     return Vue.http.post(`${baseUrl}/sections/importData`, body);
  }

  saveCase(id, body) {
    return Vue.http.patch(`${baseUrl}/sections/${id}`, body);
  }

}

const pendingService = new PendingService();

export {pendingService};

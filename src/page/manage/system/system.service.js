import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 分类模块的服务
 * @class
 */
class SystemService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 获取系统设置
   * @param {Object} params 系统参数
   */
  settings(params) {
    return Vue.http.get(`${baseUrl}/settings`, {params: params});
  }

  /**
   * 获取系统设置
   * @param {Object} data 系统参数
   */
  saveSettings(data) {
    return Vue.http.put(`${baseUrl}/settings`, data);
  }

  /**
   * 分类列表接口
   * @return {Promise}
   */
  cateList() {
    return Vue.http.get(`${baseUrl}/cate`);
  }

  /**
   * 删除分类
   * @param {number} id 分类id
   * @return {Promise}
   */
  delCate(id) {
    return Vue.http.delete(`${baseUrl}/cate/${id}`);
  }

  /**
   * 修改分类
   * @param {number} id 分类id
   * @param {Object} data 分类信息
   * @param {string} data.cate_name 分类名称
   * @param {number=} data.parent_id 分类父id
   * @return {Promise}
   */
  saveCate(id, data) {
    return Vue.http.put(`${baseUrl}/cate/${id}`, data);
  }


}

const systemService = new SystemService();

export {systemService};

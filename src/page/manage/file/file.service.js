import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 文件模块的服务
 * @class
 */
class FileService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 新增病例接口
   * @return {Promise}
   */
  addCase(data) {
    return Vue.http.post(`${baseUrl}/sections`, data);
  }




}

const fileService = new FileService();

export {fileService};

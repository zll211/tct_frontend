import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * @class
 */
class ManageService {

  /**
   * 获取用户菜单
   * @return {Promise}
   */
  user() {
    return Vue.http.get(`${baseUrl}/user`);
  }
}

const manageService = new ManageService();

export {manageService};

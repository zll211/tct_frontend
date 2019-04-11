import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 登录模块的服务
 * @class
 */
class LoginService {
  /**
   * @constructor
   */
  constructor() {}

  /**
   * 登录接口
   * @param {string} username - 登录用户名
   * @param {string} password - 登录密码
   * @return {Promise}
   */
  login({username, password}) {
    return Vue.http.post(`${baseUrl}/login`, {username, password});
  }

  /**
   * 登出
   * @return {Promise}
   */
  logout() {
    return Vue.http.post(`${baseUrl}/logout`);
  }


}

const loginService = new LoginService();

export {loginService};

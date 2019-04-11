import Vue from 'vue';

import {baseUrl} from '@/config/config';

/**
 * 诊断管理模块的服务
 * @class
 */
class OngoingService {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * 诊断中列表接口
   * @return {Promise}
   */
  ongoingList(params) {
    // return Vue.http.get(`${baseUrl}/scanistor`,{params:params});
  }


}

const ongoingService = new OngoingService();

export {ongoingService};

import './polyfill';
import ElementUI from 'element-ui';
import './style/element-variables.scss';
import Vue from 'vue';
import VueLazyload from 'vue-lazyload'

import App from './App';
import {baseRoutes} from '@/config/config';
import {httpHelperProvider} from '@/config/http';
import {router} from './router/';
import store from './store/';
import Config from '@/config/config';

isLogin().finally(() => {
  // 加载路由页面
  baseRoutes.forEach(name => require(`./page/base${name}${name}.route`));
  require(`./page/manage/manage.route`);
  Vue.config.productionTip = false;
  Vue.use(ElementUI);
  Vue.use(VueLazyload);

  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
  });
});

/**
 * 进行http request拦截，在请求之间做一些操作
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.request(function (request) {
  // console.log(request);
});

/**
 * 进行http response拦截，在处理返回之前做通用的操作处理
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.response(function (response) {
  if (response?.body?.status_code === 401) {
    window.sessionStorage.clear();
    document.title = Config.mainTitle;
    router.replace('/login');
    store.commit('isLogin', false);
  }
});

/**
 * 判断是否有权限进入特定的页面
 */
router.beforeEach((to, from, next) => {
  if ((!~to.path.indexOf('/reading/') && !~from.path.indexOf('/reading/'))
    || !~to.path.indexOf('/Details/') && !~from.path.indexOf('/Details/')) {
    window.sessionStorage.removeItem('pageIndex');
  }
  if (store.state.isLogin && (to.path === '/error' || to.path === '/login' || to.path === '/')) {
    if (from.path === '/error' || from.path === '/login' || from.path === '/' || from.path === '/404') {
      next('/diagnostic/finish');
    } else {
      next(false);
    }
    return;
  }
  next(true);
  /* if (store.state.urlList.find((uri) => ~to.path.indexOf(uri))) {
    next(true);
  } else {
    next('/404');
  }*/
});

/**
 * 判断是否登录
 */
async function isLogin() {
  store.commit('setURL', baseRoutes);
  if (window.sessionStorage.getItem('accessToken')) {
    store.commit('setMenus', []);
    store.commit('isLogin', true);
  } else {
    document.title = Config.mainTitle;
    router.push('/login');
    store.commit('isLogin', false);
  }
}


import {rabbitmqRoute} from "./rabbitmq/rabbitmq.route";
import {analysisRoute} from "./analysis/analysis.route";


export const systemRoute = [{
  path: '/system',
  component: () => import(/* webpackChunkName: "system" */ './system'),
  name: '系统管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/system/analysis',
  children: [...analysisRoute, ...rabbitmqRoute],
  icon: 'assets/img/menu/system.png',
}];

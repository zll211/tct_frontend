import {analysisRoute} from "../../system/analysis/analysis.route";
import {rabbitmqRoute} from "../../system/rabbitmq/rabbitmq.route";
import {analyzedRoute} from "./analyzed/analyzed.route";
import {analyzingRoute} from "./analyzing/analyzing.route";
import {notanalyzedRoute} from "./notanalyzed/notanalyzed.route";


export const pendingRoute = [{
  path: 'pending',
  component: () => import(/* webpackChunkName: "pending" */ './pending'),
  name: '待诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/diagnostic/pending/analyzed',
  children: [...analyzedRoute, ...analyzingRoute, ...notanalyzedRoute],
  icon: 'assets/img/menu/pengding.png',
}];

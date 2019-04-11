import {pendingRoute} from "./pending/pending.route";
import {ongoingRoute} from "./ongoing/ongoing.route";
import {finishRoute} from "./finish/finish.route";


export const diagnosticRoute = [{
  path: '/diagnostic',
  component: () => import(/* webpackChunkName: "diagnosis" */ './diagnostic'),
  name: '诊断管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [...finishRoute, /*...ongoingRoute,*/ ...pendingRoute],
  icon: 'assets/img/menu/diagnosis.png',
}];

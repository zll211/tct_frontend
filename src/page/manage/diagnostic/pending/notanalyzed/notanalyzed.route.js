export const notanalyzedRoute = [{
  path: 'notanalyzed',
  component: () => import(/* webpackChunkName: "notanalyzed" */ './notanalyzed'),
  name: '未分析',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  // icon: 'assets/img/menu/set.png',
}];

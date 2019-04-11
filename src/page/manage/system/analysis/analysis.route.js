export const analysisRoute = [{
  path: 'analysis',
  component: () => import(/* webpackChunkName: "analysis" */ './analysis'),
  name: '分析项设置',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/analyze.png',
}];

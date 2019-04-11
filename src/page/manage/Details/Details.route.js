export const DetailsRoute = [{
  path: '/Details/:id',
  props: true,
  component: () => import(/* webpackChunkName: "diagnosis-operate" */ './Details'),
  name: '诊断详情',
  isShow:true,
  beforeEnter: (to, from, next) => {
    next();
  },
}];

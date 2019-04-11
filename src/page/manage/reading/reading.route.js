export const readingRoute = [{
  path: '/reading/:id',
  props: true,
  component: () => import(/* webpackChunkName: "diagnosis-operate" */ './reading'),
  name: '诊断',
  isShow:true,
  beforeEnter: (to, from, next) => {
    next();
  },
}];

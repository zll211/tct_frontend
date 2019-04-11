export const finishRoute = [{
  path: 'finish',
  component: () => import(/* webpackChunkName: "finish" */ './finish'),
  name: '已诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/finish.png',
}];

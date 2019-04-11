export const ongoingRoute = [{
  path: 'ongoing',
  component: () => import(/* webpackChunkName: "ongoing" */ './ongoing'),
  name: '诊断中',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/set.png',
}];

export const rabbitmqRoute = [{
  path: 'rabbitmq',
  component: () => import(/* webpackChunkName: "rabbitmq" */ './rabbitmq'),
  name: 'rabbitmq管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/rab.png',
}];

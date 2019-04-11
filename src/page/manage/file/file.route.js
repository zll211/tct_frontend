export const fileRoute = [{
  path: '/file',
  component: () => import(/* webpackChunkName: "file" */ './file'),
  name: '文件管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/rab.png',
}];

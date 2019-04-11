import {routerHelperProvider} from '../../router';
import {systemRoute} from './system/system.route';
import {diagnosticRoute} from './diagnostic/diagnostic.route';
import {userRoute} from './user/user.route';
import {readingRoute} from './reading/reading.route';
import {DetailsRoute} from './Details/Details.route';
import {fileRoute} from './file/file.route';

export const manageRoute = [{
  path: '/manage',
  component: () => import(/* webpackChunkName: "manage" */ './manage'),
  name: 'manage',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/diagnostic',
  children: [...diagnosticRoute, ...systemRoute, ...userRoute, ...readingRoute, ...DetailsRoute, ...fileRoute],
}];

routerHelperProvider.configureRoutes(manageRoute);

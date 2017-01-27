/**
 * Created by bolorundurowb on 1/11/17.
 */

const auth = require('./../controllers/auth');
const authentication = require('./../middleware/authentication');

const authRoutes = function (router) {
  router.route('/auth/signin')
    .post(auth.signin);

  router.route('/auth/signup')
    .post(auth.signup);

  router.route('/auth/signout')
    .post(authentication, auth.signout);
};

module.exports = authRoutes;

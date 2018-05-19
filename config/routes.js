/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  '/': {
    view: 'pages/homepage'
  },
  'POST /v1.0/account' : 'AccountController.create',
  'POST /v1.0/account/login' : 'AccountController.login',
  'PUT /v1.0/account'        : 'UserController.update',
  'POST /v1.0/media'         : 'MediaController.upload'

};

import EmberRouter from '@ember/routing/router'
import config from './config/environment'

class Router extends EmberRouter {
  location = config.locationType
  rootURL = config.rootURL
}

/* eslint-disable array-callback-return */
Router.map(function () {
  this.route('test')
  this.route('docs')
  this.route('library')
})

export default Router

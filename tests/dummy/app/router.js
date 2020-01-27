import EmberRouterScroll from 'ember-router-scroll'
import config from './config/environment'

class Router extends EmberRouterScroll {
  location = config.locationType
  rootURL = config.rootURL
}

Router.map(function () {
  this.route('test')
  this.route('docs')
  this.route('library')
})

export default Router

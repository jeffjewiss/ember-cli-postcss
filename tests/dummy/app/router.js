import Router from '@ember/routing/router'
import RouterScroll from 'ember-router-scroll'
import config from './config/environment'

const EmberRouter = Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
})

EmberRouter.map(function () {
  this.route('test')
  this.route('docs')
  this.route('library')
})

export default EmberRouter

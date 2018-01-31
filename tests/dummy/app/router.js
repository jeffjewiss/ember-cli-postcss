import Router from 'ember-router'
import RouterScroll from 'ember-router-scroll'
import config from './config/environment'

const MyRouter = Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
})

MyRouter.map(function () {
  this.route('test')
  this.route('docs')
  this.route('library')
})

export default MyRouter

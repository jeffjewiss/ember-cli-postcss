import Router from 'ember-router'
import config from './config/environment'

const MyRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

MyRouter.map(function () {
  this.route('test')
  this.route('docs')
  this.route('library')
})

export default MyRouter

import buildRoutes from 'ember-engines/routes'

export default buildRoutes(function () {
  this.route('file', { path: '/file:slug' })
})

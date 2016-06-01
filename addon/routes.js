import buildRoutes from 'ember-engines/routes'

export default buildRoutes(function () {
  this.route('files')
  this.route('file', { path: 'file/:fileName' })
})

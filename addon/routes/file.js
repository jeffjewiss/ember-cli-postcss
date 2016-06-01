import Ember from 'ember'

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model (params) {
  },

  afterModel (model) {
    debugger
  }
})

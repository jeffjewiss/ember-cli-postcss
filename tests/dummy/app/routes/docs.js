import Route from '@ember/routing/route'
import { scheduleOnce } from '@ember/runloop'
import { inject } from '@ember/service'

export default Route.extend({
  codePrettify: inject(),

  activate () {
    scheduleOnce('afterRender', this, this.setupPrettify)
  },

  setupPrettify () {
    this.codePrettify.prettify()
  }
})

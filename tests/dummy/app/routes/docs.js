import Route from '@ember/routing/route'
import { get } from '@ember/object'
import { scheduleOnce } from '@ember/runloop'
import { inject } from '@ember/service'

export default Route.extend({
  codePrettify: inject(),

  activate () {
    scheduleOnce('afterRender', this, function () {
      get(this, 'codePrettify').prettify()
    })
  }
})

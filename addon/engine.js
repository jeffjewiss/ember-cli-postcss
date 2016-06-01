import Engine from 'ember-engines/engine'
import Resolver from 'ember-engines/resolver'
import loadInitializers from 'ember-load-initializers'

const modulePrefix = 'ember-cli-postcss'
const Eng = Engine.extend({
  modulePrefix,
  Resolver
})

loadInitializers(Eng, modulePrefix)

export default Eng

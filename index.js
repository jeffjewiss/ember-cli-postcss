var postcssCompiler = require('broccoli-postcss')
var defaults = require('lodash/defaults')

module.exports = {
  name: 'ember-cli-postcss',

  included: function included (app, parentAddon) {
    this.app = app

    // Support nesting this addon
    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app
    }

    this._super.included.apply(this. arguments)

    // Initialize options if none were passed
    this.options = defaults(this.app.options.postcssOptions || {}, {
      enabled: true,
      map: {},
      plugins: []
    })

    this.enabled = this.options.enabled
    delete this.options.enabled
  },

  postprocessTree: function (type, tree) {
    if ((type === 'all' || type === 'styles') && this.enabled) {
      tree = postcssCompiler(tree, this.options)
    }

    return tree
  }
}

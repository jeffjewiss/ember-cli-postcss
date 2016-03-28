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

    this._super.included.apply(this, arguments)

    // Initialize options if none were passed
    this.options = defaults(this.app.options.postcssOptions || {}, {
      compile: {
        enabled: true,
        map: {},
        plugins: []
      },
      postcompile: {
        enabled: false,
        map: {},
        plugins: []
      }
    })
  },

  treeForStyles: function (tree) {
    if (this.options.compile.enabled && tree) {
      delete this.options.compile.enabled
      tree = postcssCompiler(tree, this.options.compile)
    }

    return tree
  },

  postprocessTree: function (type, tree) {
    if (this.options.postcompile.enabled && (type === 'all' || type === 'styles')) {
      delete this.options.postcompile.enabled
      tree = postcssCompiler(tree, this.options.postcompile)
    }

    return tree
  }
}

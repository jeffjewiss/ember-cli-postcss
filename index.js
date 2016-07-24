var path = require('path')
var merge = require('merge')
var mergeTrees = require('broccoli-merge-trees')
var checker = require('ember-cli-version-checker')
var postcssFilter = require('broccoli-postcss')
var PostcssCompiler = require('broccoli-postcss-single')

function PostcssPlugin (optionsFn) {
  this.name = 'ember-cli-postcss'
  this.optionsFn = optionsFn
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  var inputTrees = [tree]
  var defaultOptions = {
    enabled: true
  }
  var options = merge.recursive(defaultOptions, this.optionsFn, inputOptions)

  if (!options.enabled) {
    return tree
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths)
  }

  var plugins = options.plugins
  var map = options.map

  var ext = options.extension || 'css'
  var paths = options.outputPaths
  var trees = Object.keys(paths).map(function (file) {
    var input = path.join(inputPath, file + '.' + ext)
    var output = paths[file]
    return new PostcssCompiler(inputTrees, input, output, plugins, map)
  })

  return mergeTrees(trees)
}

module.exports = {
  name: 'ember-cli-postcss',

  shouldSetupRegistryInIncluded: function () {
    return !checker.isAbove(this, '0.2.0')
  },

  included: function included (app, parentAddon) {
    this.app = app

    // Support nesting this addon
    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app
    }

    this._super.included.apply(this, arguments)

    // Initialize options if none were passed
    this.options = merge.recursive({}, {
      compile: {
        enabled: true,
        map: {},
        plugins: [],
        inputFile: 'app.css',
        outputFile: this.project.name() + '.css'
      },
      filter: {
        enabled: false,
        map: {},
        plugins: []
      }
    }, this.app.options.postcssOptions)

    // Add to registry and pass options
    app.registry.add('css', new PostcssPlugin(this.options.compile))

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry)
    }
  },

  postprocessTree: function (type, tree) {
    if (this.options.filter.enabled && (type === 'all' || type === 'styles')) {
      tree = postcssFilter(tree, this.options.filter)
    }

    return tree
  }
}

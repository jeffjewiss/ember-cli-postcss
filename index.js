'use strict'

const path = require('path')
const merge = require('merge')
const mergeTrees = require('broccoli-merge-trees')
const checker = require('ember-cli-version-checker')
const postcssFilter = require('broccoli-postcss')
const PostcssCompiler = require('broccoli-postcss-single')

function PostcssPlugin (optionsFn) {
  this.name = 'ember-cli-postcss'
  this.optionsFn = optionsFn
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  let inputTrees = [tree]
  let defaultOptions = {
    enabled: true
  }
  let options = merge.recursive(defaultOptions, this.optionsFn, inputOptions)

  if (!options.enabled) {
    return tree
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths)
  }

  let { plugins, map } = options
  let ext = options.extension || 'css'
  let paths = options.outputPaths
  let trees = Object.keys(paths).map(function (file) {
    let input = path.join(inputPath, `${file}.${ext}`)
    let output = paths[file]
    return new PostcssCompiler(inputTrees, input, output, plugins, map)
  })

  return mergeTrees(trees)
}

module.exports = {
  name: 'ember-cli-postcss',

  shouldSetupRegistryInIncluded () {
    return !checker.isAbove(this, '0.2.0')
  },

  included: function included (app, parentAddon) {
    let env = process.env.EMBER_ENV
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
        map: env !== 'development' ? false : {},
        plugins: [],
        inputFile: 'app.css',
        outputFile: `${this.project.name()}.css`
      },
      filter: {
        enabled: false,
        map: env !== 'development' ? false : {},
        plugins: []
      }
    }, this.app.options.postcssOptions)

    // Add to registry and pass options
    app.registry.add('css', new PostcssPlugin(this.options.compile))

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry)
    }
  },

  postprocessTree (type, tree) {
    if (this.options.filter.enabled && (type === 'all' || type === 'styles')) {
      tree = postcssFilter(tree, this.options.filter)
    }

    return tree
  }
}

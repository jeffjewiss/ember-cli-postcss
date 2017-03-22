/* eslint-env node */
'use strict';

const path = require('path')
const merge = require('merge')
const mergeTrees = require('broccoli-merge-trees')
const postcssFilter = require('broccoli-postcss')
const PostcssCompiler = require('broccoli-postcss-single')

function PostcssPlugin (addon) {
  this.name = 'ember-cli-postcss';
  this.addon = addon;
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  let inputTrees = [tree]
  let defaultOptions = {
    enabled: true
  }
  let options = merge.recursive(defaultOptions, this.addon.options.compile, inputOptions)

  if (!options.enabled) {
    return tree
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths)
  }

  let plugins = options.plugins // eslint-disable-line
  let map = options.map // eslint-disable-line
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

  included: function included (app) {
    this._super.included.apply(this, arguments)

    let env = process.env.EMBER_ENV

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
    }, this._getAddonOptions(app).postcssOptions)
  },

  _getAddonOptions: function(app) {
    return (this.parent && this.parent.options) || (app && app.options) || {};
  },

  postprocessTree: function(type, tree) {
    if (this.options.filter.enabled && (type === 'all' || type === 'styles')) {
      tree = postcssFilter(tree, this.options.filter)
    }
    return tree
  },

  setupPreprocessorRegistry(type, registry) {
    let addon = this;
    registry.add('css', new PostcssPlugin(addon))
  }
}

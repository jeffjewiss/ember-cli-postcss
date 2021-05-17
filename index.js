/* eslint-env node */
'use strict'

const path = require('path')
const merge = require('merge')
const mergeTrees = require('broccoli-merge-trees')
const PostcssFilter = require('broccoli-postcss')
const PostcssCompiler = require('broccoli-postcss-single')

function PostcssPlugin (addon) {
  this.name = 'ember-cli-postcss'
  this.addon = addon
  this.ext = ['css', 'less', 'styl', 'scss', 'sass']
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  let inputTrees = [tree]
  const defaultOptions = { enabled: true }
  const options = merge.recursive(defaultOptions, this.addon._options.compile, inputOptions)

  if (!options.enabled) {
    return tree
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths)
  }

  const ext = options.extension || 'css'
  const paths = options.outputPaths
  const trees = Object.keys(paths).map((file) => {
    const input = path.join(inputPath, `${file}.${ext}`)
    const output = paths[file]
    return new PostcssCompiler(inputTrees, input, output, options)
  })

  return mergeTrees(trees)
}

module.exports = {
  name: 'ember-cli-postcss',

  included (app) {
    this._super.included.apply(this, arguments)
    this._ensureThisImport()

    const env = process.env.EMBER_ENV
    const overrideBrowserslist = this.project.targets && this.project.targets.browsers

    // Initialize options if none were passed
    this._options = merge.recursive({}, {
      compile: {
        enabled: true,
        overrideBrowserslist,
        map: env !== 'development' ? false : {},
        plugins: [],
        inputFile: 'app.css',
        outputFile: `${this.project.name()}.css`
      },
      filter: {
        enabled: false,
        overrideBrowserslist,
        map: env !== 'development' ? false : {},
        processTrees: ['css'],
        plugins: []
      }
    }, this._getAddonOptions(app).postcssOptions)
  },

  _getAddonOptions (app) {
    return (this.parent && this.parent.options) || (app && app.options) || {}
  },

  _ensureThisImport () {
    if (!this.import) {
      this._findHost = function findHostShim () {
        let current = this
        let app
        do {
          app = current.app || app
        } while (current.parent.parent && (current = current.parent))
        return app
      }
      this.import = function importShim (asset, options) {
        const app = this._findHost()
        app.import(asset, options)
      }
    }
  },

  postprocessTree (type, tree) {
    const { enabled, processTrees } = this._options.filter

    if (enabled && processTrees.includes(type)) {
      tree = mergeTrees([tree, new PostcssFilter(tree, this._options.filter)], { overwrite: true })
    }

    return tree
  },

  setupPreprocessorRegistry (_type, registry) {
    const addon = this
    registry.add('css', new PostcssPlugin(addon))
  }
}

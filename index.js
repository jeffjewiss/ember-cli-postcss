/* eslint-env node */
'use strict'

const path = require('path')
const merge = require('merge')
const version = require('./package.json').version // eslint-disable-line
const writeFile = require('broccoli-file-creator')
const mergeTrees = require('broccoli-merge-trees')
const postcssFilter = require('broccoli-postcss')
const PostcssCompiler = require('broccoli-postcss-single')

function PostcssPlugin (addon) {
  this.name = 'ember-cli-postcss'
  this.addon = addon
  this.ext = ['css', 'less', 'styl', 'scss', 'sass']
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  let inputTrees = [tree]
  let defaultOptions = { enabled: true }
  let options = merge.recursive(defaultOptions, this.addon._options.compile, inputOptions)

  if (!options.enabled) {
    return tree
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths)
  }

  let ext = options.extension || 'css'
  let paths = options.outputPaths
  let trees = Object.keys(paths).map((file) => {
    let input = path.join(inputPath, `${file}.${ext}`)
    let output = paths[file]
    return new PostcssCompiler(inputTrees, input, output, options)
  })

  return mergeTrees(trees)
}

module.exports = {
  name: 'ember-cli-postcss',

  included (app) {
    this._super.included.apply(this, arguments)
    this._ensureThisImport()

    let env = process.env.EMBER_ENV
    let browsers = this.project.targets && this.project.targets.browsers

    // Initialize options if none were passed
    this._options = merge.recursive({}, {
      compile: {
        enabled: true,
        browsers,
        map: env !== 'development' ? false : {},
        plugins: [],
        inputFile: 'app.css',
        outputFile: `${this.project.name()}.css`
      },
      filter: {
        enabled: false,
        browsers,
        map: env !== 'development' ? false : {},
        processTrees: ['all', 'css'],
        plugins: []
      }
    }, this._getAddonOptions(app).postcssOptions)

    let isEmber = !!~app.constructor.name.indexOf('Ember')
    // Omit the register version import for glimmer apps.
    // For some reason this causes a crash in glimmer.
    if (isEmber) {
      this.import('vendor/ember-cli-postcss/register-version.js')
    }
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
        let app = this._findHost()
        app.import(asset, options)
      }
    }
  },

  postprocessTree (type, tree) {
    let { enabled, processTrees } = this._options.filter

    if (enabled && processTrees.includes(type)) {
      tree = mergeTrees([tree, postcssFilter(tree, this._options.filter)], { overwrite: true })
    }

    return tree
  },

  setupPreprocessorRegistry (type, registry) {
    let addon = this
    registry.add('css', new PostcssPlugin(addon))
  },

  treeForVendor () {
    let content = `Ember.libraries.register('Ember Postcss', '${version}');`
    let registerVersionTree = writeFile(
      'ember-cli-postcss/register-version.js',
      content
    )

    return mergeTrees([registerVersionTree])
  }
}

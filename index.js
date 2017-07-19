/* eslint-env node */
'use strict'

const path = require('path')
const merge = require('merge')
const postcssFilter = require('broccoli-postcss')
const MergeTrees = require('broccoli-merge-trees')
const PostcssCompiler = require('broccoli-postcss-single')
const Rollup = require('broccoli-rollup')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')

function PostcssPlugin (addon) {
  this.name = 'ember-cli-postcss'
  this.addon = addon
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  let inputTrees = [tree]
  let defaultOptions = { enabled: true }
  let options = merge.recursive(defaultOptions, this.addon.options.compile, inputOptions)

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

  return MergeTrees(trees)
}

module.exports = {
  name: 'ember-cli-postcss',
  options: {
    nodeAssets: {
      postcss () {
        // TODO: loop through plugins array and include them as well

        return {
          enabled: this._options.shimEnabled,
          vendor: {
            processTree (input) {
              return new Rollup(input, {
                rollup: {
                  entry: 'postcss/lib/postcss.js',
                  dest: 'postcss.js',
                  format: 'amd',
                  moduleName: 'postcss',
                  plugins: [
                    nodeResolve({ jsnext: true }),
                    commonjs(),
                    nodeGlobals(),
                    nodeBuiltins()
                  ]
                }
              })
            }
          }
        }
      }
    }
  },

  included (app) {
    let env = process.env.EMBER_ENV
    let browsers = this.project.targets && this.project.targets.browsers

    // Initialize options if none were passed
    this._options = merge.recursive({}, {
      shimEnabled: false,
      shimPlugins: [],
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
        plugins: []
      }
    }, this._getAddonOptions(app).postcssOptions)

    if (this._options.shimEnabled) {
      this.import('vendor/postcss.js', {
        using: [{ transformation: 'amd', as: 'postcss' }]
      })
    }

    this._super.included.apply(this, arguments)
  },

  _getAddonOptions (app) {
    return (this.parent && this.parent.options) || (app && app.options) || {}
  },

  postprocessTree (type, tree) {
    if (this._options.filter.enabled && (type === 'all' || type === 'styles')) {
      tree = MergeTrees([tree, postcssFilter(tree, this._options.filter)], { overwrite: true })
    }
    return tree
  },

  setupPreprocessorRegistry (type, registry) {
    let addon = this
    // registry.add('css', new PostcssPlugin(addon))
  }
}

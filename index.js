/* eslint-env node */
'use strict'

const fs = require('fs')
const path = require('path')
const merge = require('merge')
const mergeTrees = require('broccoli-merge-trees')
const writeFile = require('broccoli-file-creator')
const postcssFilter = require('broccoli-postcss')
const PostcssCompiler = require('broccoli-postcss-single')
const EngineAddon = require('ember-engines/lib/engine-addon')

function createFile () {
  let fixtures = [
    'github',
    'segment',
    'stripe',
    'twitter'
  ]

  let statsData = fixtures.map((name) => {
    let filename = `${name}.css`

    return {
      filename,
      stats: fs.readFileSync(path.join(__dirname, `fixtures/${name}.css.json`), 'utf8')
    }
  })

  let content = `export default {
    files: [
      ${statsData}
    ]
  }`

  return writeFile('app/cssstats.js', content)
}

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

  return mergeTrees(trees)
}

module.exports = EngineAddon.extend({
  name: 'ember-cli-postcss',
  lazyLoading: false,

  included (app) {
    this._super.included.apply(this, arguments)

    let env = process.env.EMBER_ENV
    let browsers = this.project.targets && this.project.targets.browsers

    // Initialize options if none were passed
    this.options = merge.recursive({}, {
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
  },

  _getAddonOptions (app) {
    return (this.parent && this.parent.options) || (app && app.options) || {}
  },

  postprocessTree (type, tree) {
    if (this.options.filter.enabled && (type === 'all' || type === 'styles')) {
      tree = mergeTrees([tree, postcssFilter(tree, this.options.filter)], { overwrite: true })
    }
    return tree
  },

  setupPreprocessorRegistry (type, registry) {
    let addon = this
    registry.add('css', new PostcssPlugin(addon))
  },

  treeForApp (tree) {
    // merge the new stats file with the app tree
    return mergeTrees([this.app.trees.app, createFile()])
  }
})

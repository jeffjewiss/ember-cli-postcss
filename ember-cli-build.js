'use strict'

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    prember: {
      // GitHub Pages uses this filename to serve 404s
      emptyFile: '404.html',
      urls: [
        '/',
        '/docs',
        '/library'
      ]
    },
    outputPaths: {
      app: {
        css: {
          'app': '/assets/dummy.css',
          'primary': '/assets/primary.css',
          'secondary': '/assets/secondary.css'
        }
      }
    },
    postcssOptions: {
      compile: {
        plugins: [
          { module: require('postcss-import') },
          { module: require('postcss-cssnext') }
        ]
      },
      filter: {
        enabled: true,
        plugins: [
          { module: require('postcss-color-gray') },
          { module: require('postcss-color-function') }
        ]
      }
    }
  })

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree()
}

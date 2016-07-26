/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    outputPaths: {
      app: {
        css: {
          'app': '/assets/dummy.css',
          'secondary': '/assets/secondary.css'
        }
      }
    },
    postcssOptions: {
      compile: {
        plugins: [
          { module: require('postcss-color-gray') }
        ]
      },
      filter: {
        enabled: true,
        plugins: [
          { module: require('postcss-color-rebeccapurple') }
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

  return app.toTree();
};

ember-cli-postcss
=================

[![Build Status](https://travis-ci.org/jeffjewiss/ember-cli-postcss.svg?branch=master)](https://travis-ci.org/jeffjewiss/ember-cli-postcss)
[![npm version](https://badge.fury.io/js/ember-cli-postcss.svg)](http://badge.fury.io/js/ember-cli-postcss)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-postcss.svg)](http://emberobserver.com/addons/ember-cli-postcss)

Use [postcss](http://github.com/postcss/postcss) to process your `css` with a large selection of [plug-ins](http://postcss.parts).

Installation
------------

```shell
ember install ember-cli-postcss
```

Usage
-----

The add-on can be used in two ways:

* on individual files, referred to as “compile”
* on all CSS files, referred to as “filter”

*Note: it’s possible to use both compile and filter.*

#### Compile

This step will look for either `app.css` or `<project-name>.css` in your styles directory. Additional files to be processed can be defined in the output paths configuration object for your application:

```javascript
var app = new EmberApp(defaults, {
  outputPaths: {
    app: {
      html: 'index.html',
      css: {
        'app': '/assets/app.css',
        'print': '/assets/print.css'
      }
    }
  }
}
```

#### Filter

This step will run at the end of the build process on all CSS files, including the merged `vendor.css` file and any CSS imported into the Broccoli tree by add-ons.


### Configuring Plug-ins

There are two steps to setting up [postcss](https://github.com/postcss/postcss) with `ember-cli-postcss`:

1. install and require the node modules for any plug-ins
2. provide the node module and plug-in options as a `postcssOptions` object in `ember-cli-build.js`

The `postcssOptions` object should have a “compile” and/or “filter” property, which will have the properties `enabled` and `plugins`, which is an array of objects that contain a `module` property and an `options` property:

```javascript
postcssOptions: {
  compile: {
    enabled: true, // defaults to true
    plugins: [
      {
        module: <module>,
        options: {
          ...
        }
      }
    ]
  },
  filter: {
    enabled: true, // defaults to false
    plugins: [
      {
        module: <module>,
        options: {
          ...
        }
      }
    ]
  }
}
```

Example
-------

Install the autoprefixer plug-in:

```shell
npm i --save-dev autoprefixer
```

Specify some plug-ins in your `ember-cli-build.js`:

```javascript
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var autoprefixer = require('autoprefixer');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        enabled: false
      },
      filter: {
        enabled: true,
        plugins: [
          {
            module: autoprefixer,
            options: {
              browsers: ['last 2 version']
            }
          }
        ]
      }
    }
  });
  return app.toTree();
};
```

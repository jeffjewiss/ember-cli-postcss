<div align="center">
  <img src="https://jeffjewiss.github.io/ember-cli-postcss/postcss.svg">
</div>

<h1 align="center">Ember CLI Postcss</h1>

<div align="center">
  <a href="https://travis-ci.org/jeffjewiss/ember-cli-postcss"><img src="https://travis-ci.org/jeffjewiss/ember-cli-postcss.svg?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/ember-cli-postcss"><img src="https://img.shields.io/npm/v/ember-cli-postcss.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ember-cli-postcss"><img src="https://img.shields.io/npm/dm/ember-cli-postcss.svg" alt="Monthly Downloads"></a>
  <a href="http://emberobserver.com/addons/ember-cli-postcss"><img src="http://emberobserver.com/badges/ember-cli-postcss.svg" alt="Ember Observer Score"></a>
</div>

<div align="center" style="margin-top: 1rem; margin-bottom: 4rem;">
  <p>Use <a href="http://github.com/postcss/postcss">postcss</a> to process your `css` with a large selection of <a href="http://postcss.parts">plug-ins</a>.</p>
</div>

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
const app = new EmberApp(defaults, {
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

Files can be white-listed and/or black-listed by using the respective include and exclude options. Each accepts an array of file globs, which are then passed on to Broccoli Funnel. An example can be seen in the sample configuration below.

### Configuring Plug-ins

There are two steps to setting up [postcss](https://github.com/postcss/postcss) with `ember-cli-postcss`:

1. install and require the node modules for any plug-ins
2. provide the node module and plug-in options as a `postcssOptions` object in `ember-cli-build.js`

The `postcssOptions` object should have a “compile” and/or “filter” property, which will have the properties `enabled` and `plugins`, which is an array of objects that contain a `module` property and an `options` property:

#### Browser Targets

Some postcss plug-ins, like autoprefixer, allow you to configure which browsers to target for transpilation. When using Ember CLI >= 2.13.0, the browser targets configuration found in the file `config/targets.js` will be added to each plug-in’s options (as `options.browsers`). This browser list can be overwritten on a plug-in by plug-in basis. You can learn more about the targets feature on the [Ember.js blog](https://emberjs.com/blog/2017/04/29/ember-2-13-released.html#toc_targets).

```javascript
postcssOptions: {
  compile: {
    enabled: true, // defaults to true
    browsers: ['last 3 versions'], // this will override config found in config/targets.js
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
    map: false, // defaults to inline, false in production
    browsers: ['last 3 versions'], // this will override config found in config/targets.js
    include: ['styles/*.css'],
    exclude: ['vendor/bootstrap/**/*'],
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
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('autoprefixer');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        enabled: false,
        browsers: ['last 3 versions'], // this will override config found in config/targets.js
      },
      filter: {
        enabled: true,
        plugins: [
          {
            module: autoprefixer,
            options: {
              browsers: ['last 2 versions'] // this will override the config, but just for this plugin
            }
          }
        ]
      }
    }
  });
  return app.toTree();
};
```

Developing Addons
-----------------

If you are a developing an addon and would like to use `ember-cli-postcss` to process the CSS to automatically be included in the `vendor.css` of Ember applications consuming the addon, there are 2 steps to follow.

1. create your styles in `addon/styles/addon.css` (you can import other CSS files if a postcss import plugin is installed)
2. configure your addon’s options to process postcss:

```javascript
// index.js
const CssImport = require('postcss-import')
const CssNext = require('postcss-cssnext')

module.exports = {
  options: {
    postcssOptions: {
      compile: {
        enabled: true,
        plugins: [
          { module: CssImport },
          { module: CssNext }
        ]
      }
    }
  }
  ...
}
```

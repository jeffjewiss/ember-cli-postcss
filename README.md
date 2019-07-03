<div align="center">
  <img src="tests/dummy/public/postcss.svg" alt="Postcss Logo">
</div>

<h1 align="center">Ember CLI Postcss</h1>

<div align="center">
  <a href="https://travis-ci.org/jeffjewiss/ember-cli-postcss"><img src="https://travis-ci.org/jeffjewiss/ember-cli-postcss.svg?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/ember-cli-postcss"><img src="https://img.shields.io/npm/v/ember-cli-postcss.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ember-cli-postcss"><img src="https://img.shields.io/npm/dm/ember-cli-postcss.svg" alt="Monthly Downloads"></a>
  <a href="https://emberobserver.com/addons/ember-cli-postcss"><img src="https://emberobserver.com/badges/ember-cli-postcss.svg" alt="Ember Observer Score"></a>
</div>

<br>

<div align="center">
  <p>Use <a href="http://github.com/postcss/postcss">postcss</a> to process your <strong>css</strong> with a large selection of <a href="http://postcss.parts">plug-ins</a>.</p>
</div>

<br>
<br>
<br>

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

*Additional Note: this app is compatible with Glimmer JS*

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
    processTrees: ['css'],
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

#### Process Trees

When using the filter version of this add-on the default configuration is now to
only run on the `css` tree. This will mean that the add-on is only run when CSS
files are changed. If you need the process to run on other trees or when other
files are changed, you should update the `processTrees` option to include more
trees from the following list: `[template, js, css, test, all,]`

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

If you are developing an addon and would like to use `ember-cli-postcss` to process the CSS to automatically be included in the `vendor.css` of Ember applications consuming the addon, there are 2 steps to follow.

1. create your styles in `addon/styles/addon.css` (you can import other CSS files if a postcss import plugin is installed)
2. configure your addon’s options to process postcss:

```javascript
// index.js
const CssImport = require('postcss-import')
const PresetEnv = require('postcss-preset-env');
const { join } = require('path');
const style_dir = join( __dirname, 'addon', 'styles');

module.exports = {
  options: {
    postcssOptions: {
      compile: {
        enabled: true,
        includePaths: [style_dir],
        plugins: [
          { module: CssImport },
          {
            module: PresetEnv,
            options: { stage: 3 }
          }
        ]
      }
    }
  }
  ...
}
```

Migrating from other Processors
-------------------------------

If you’d like to migrate a project from one of the other processors, such as Less, Sass, or Stylus, you can configure Postcss with an appropriate parser and set of plugins that provides an equivalent set of features.

This then allows you to use additional Postcss plugins at the end of the compilation to continue transforming your styles for more powerful control of authoring styles in your application. This also plays nicely with [ember-component-css](https://github.com/ebryn/ember-component-css).

So far this migration process has been tested when switching from Sass.


### Switching from Sass

One common use case is to transition from using Sass to Postcss or using them both together. As of `ember-cli-postcss@3.7.0` this is possible with the right combination of options and plugins.

There are three key pieces of configuration:

1. Set the parser to `postcss-scss`
2. Configure the extension to match your files (ie. 'scss')
3. Use `@csstools/postcss-sass` as the first plugin

Your configuration options in `ember-cli-build.js` would contain the following options for this addon:

```javascript
  postcssOptions: {
    compile: {
      extension: 'scss',
      enabled: true,
      parser: require('postcss-scss'),
      plugins: [
        {
          module: require('@csstools/postcss-sass'),
          options: {
            includePaths: [
              'node_modules/tachyons-sass',
            ],
          },
        },
        ...
      ],
    },
    ...
  }
```

This allows your to switch your CSS processing pipeline to use postcss without being hugely disruptive as you can keep the Sass features and `.scss` or `.sass` file extension. The importing feature of `@csstools/postcss-sass` will also look for `.css` files, so you can choose to gradually rename your files from Sass partials `_<filename>.scss` to `<filename>.css` without breaking anything.

If your goal is to completely move away from using Sass features you can remove the parser, remove the sass plugin, use an import plugin that fits your needs and ensure that your files have the `.css` extension.

Experimental Features
---------------------

### Custom Properties Service

CSS variables are now supported by many major browsers. The values of these variables can be accessed, set, and removed using JavaScript. This addon now exports a service, which provides methods to work with CSS variables. Each method is a wrapper around the browser API, which includes a check for browser support before executing.

The service provides 3 methods:

1. `getVal ({ element = docEl, variableName })`
2. `setVal ({ element = docEl, variableName, variableValue })`
3. `removeVal ({ element = docEl, variableName })`

A Contrived Example:

```javascript
import { inject } from '@ember/service'

export default <ember object>.extend({
  customProperties: inject(),
  ...

  nightMode() {
    this.get('customProperties').setVal({variableName: '--background', variableValue: 'black'})
    this.get('customProperties').setVal({variableName: '--text', variableValue: 'white'})
  },

  dayMode() {
    this.get('customProperties').setVal({variableName: '--background', variableValue: 'white'})
    this.get('customProperties').setVal({variableName: '--text', variableValue: 'black'})
  },
})
```

*Note: if you are using postcss-custom-properties, ensure you configure the option `{ preserve: true }`*

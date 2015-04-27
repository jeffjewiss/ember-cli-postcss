# ember-cli-postcss

[![npm version](https://badge.fury.io/js/ember-cli-postcss.svg)](http://badge.fury.io/js/ember-cli-postcss) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-postcss.svg)](http://emberobserver.com/addons/ember-cli-postcss) [![Code Climate](https://codeclimate.com/github/jeffjewiss/ember-cli-postcss/badges/gpa.svg)](https://codeclimate.com/github/jeffjewiss/ember-cli-postcss)

Use [postcss](https://github.com/postcss/postcss) to process your `css` with a large selection of JavaScript plug-ins.

## Installation

```shell
npm install --save-dev ember-cli-postcss
```

## Usage

The addon is still a little rough around the edges, but it will look for either `app.css` or `<project-name>.css` in your styles directory. Postcss requires at least one plug-in to actually do any processing, and so `broccoli-postcss` will throw an error if at least one is not provided.

### Configuring Plug-ins

There are two steps to setting up [postcss](https://github.com/postcss/postcss) with `ember-cli-postcss`:

1. install and require the node modules for any plug-ins
2. provide the node module and plug-in options as a `postcssOptions` object in the Brocfile

The `postcssOptions` object should have a property `plugins`, which is an array of objects that contain a `module` property and an `options` property:

```javascript
postcssOptions: {
  plugins: [
    {
      module: <module>,
      options: {
        ...
      }
    }
  ]
}
```

## Example

Install the autoprefixer plugin:

```shell
npm i --save-dev autoprefixer
```

Specify some plugins in your Brocfile.js:

```javascript
var EmberApp = require(‘ember-cli/lib/broccoli/ember-app’);
var autoprefixer = require(‘autoprefixer-core’);

var app = new EmberApp({
  postcssOptions: {
    plugins: [
      {
        module: autoprefixer,
        options: {
          browsers: [‘last 2 version’]
        }
      }
    ]
  }
});

module.exports = app.toTree();
```

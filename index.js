var PostcssCompiler = require('broccoli-postcss');
var checker = require('ember-cli-version-checker');

// PostCSSPlugin constructor
function PostCSSPlugin (options) {
  this.name = 'ember-cli-postcss';
  this.options = options;
  this.plugins = options.plugins;
  this.map = options.map;
}

PostCSSPlugin.prototype.toTree = function (tree, inputPath, outputPath) {
  var trees = [tree];

  if (this.options.includePaths) {
    trees = trees.concat(this.options.includePaths);
  }

  inputPath += '/' + this.options.inputFile;
  outputPath += '/' + this.options.outputFile;

  return new PostcssCompiler(trees, inputPath, outputPath, this.plugins, this.map);
};

module.exports = {
  name: 'Ember CLI Postcss',
  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },
  included: function included (app) {
    this.app = app;
    // Initialize options if none were passed
    var options = app.options.postcssOptions || {};

    // Set defaults if none were passed
    options.map = options.map || {};
    options.plugins = options.plugins || [];
    options.inputFile = options.inputFile || 'app.css';
    options.outputFile = options.outputFile || this.project.name() + '.css';

    // Add to registry and pass options
    app.registry.add('css', new PostCSSPlugin(options));

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};

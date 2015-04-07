var PostcssCompiler = require('broccoli-postcss');
var checker = require('ember-cli-version-checker');

function PostCSSPlugin (plugins, options) {
  this.name = 'ember-cli-postcss';
  options = options || {};
  options.inputFile = options.inputFile || 'app.css';
  options.outputFile = options.outputFile || 'app.css';
  this.options = options;
  this.plugins = plugins;
}

PostCSSPlugin.prototype.toTree = function (tree, inputPath, outputPath) {
  var trees = [tree];

  if (this.options.includePaths) {
    trees = trees.concat(this.options.includePaths);
  }

  inputPath += '/' + this.options.inputFile;
  outputPath += '/' + this.options.outputFile;

  return new PostcssCompiler(trees, inputPath, outputPath, this.plugins);
};

module.exports = {
  name: 'Ember CLI Postcss',
  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },
  included: function included (app) {
    this.app = app;
    var options = app.options.postcssOptions || {};
    var plugins = this.plugins = options.plugins || [];

    options.outputFile = options.outputFile || this.project.name() + '.css';

    app.registry.add('css', new PostCSSPlugin(plugins, options));

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};

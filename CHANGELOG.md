# master

# 5.0.0

* drop support for Node 6
* add documentation note on importing styles from addons
* minor linting updates

# 4.2.1

* dependency updates
* rename option browsers -> overrideBrowserslist
* update the processTrees default to ‘css’ only

# 4.2.0

* adds processTrees option to filter

# 4.1.1

* adds a fix for GlimmerJS support

# 4.1.0

* stop testing against Ember 2
* remove Yarn
* upgrade to Postcss v7

# 4.0.0

* drop Node 4 support
* test against Node 10
* use version ranges for dependencies
* use new testing API
* add a service for using CSS variables in javascript
* add a documentation website using the dummy app

# 3.7.1

* fix `this.options` collision
* fix babel devDependencies deprecation

# 3.7.0

* add support for using a custom postcss parser via the compile options
* add support for other known style extensions (less, styl, sass, scss)

# 3.6.2

* fix Node 4 support
* add a blueprint for using Sass + Postcss

# 3.6.1

* fix Node 9 support

# 3.6.0

* allow plugins to be specified as functions for both compile and filter
* update dependencies

# 3.5.2

* move `bower` to devDependencies
* improve Travis and `ember-try` test setup

# 3.5.1

* moved `ember-cli-dependency-checker` to dev dependencies

# 3.5.0

* upgrade broccoli-postcss for Node 8 support

# 3.4.2

* initial Node 8 support

# 3.4.1

* support `config/targets.js` and overriding `browsers` options

# 3.4.0

* use Postcss 6 via updating broccoli plugins

# 3.3.0

* fix include/exclude from removing files by overwriting with broccoli merge tree
* update ember cli and testing deps

# 3.2.0

* adds include/exclude option for filter

# 3.1.2

* default to only creating sourcemaps in the development environment

# 3.1.1

* update code styles for tests
* add yarn lockfile

# 3.1.0

* switch to using eslint instead of jshint
* update code styles
* fix option reference

# 3.0.0

* splits plugin into two modes: compile and filter
* compile is for the same behaviour as V2, which uses broccoli-postcss-single
* filter is for running postcss on all of your project’s stylesheets at the end of the build process, which uses V3 of broccoli-postcss

# 2.1.1

* updates `broccoli-merge-trees` to version 1.0

# 2.1.0

* adds the ability to process multiple files by adding them to the `outputPaths` in `Brocfile.js` or `ember-cli-build.js`

# 2.0.0

* updates `broccoli-postcss` to version 2.0 (Postcss v5)


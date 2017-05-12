# master

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


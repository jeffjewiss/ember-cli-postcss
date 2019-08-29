module.exports = {
  name: 'postcss-sass',

  normalizeEntityName () {}, // no-op since we're just adding dependencies

  afterInstall () {
    return this.addPackagesToProject([
      {
        name: '@csstools/postcss-sass'
      },
      {
        name: 'cssstats'
      },
      {
        name:
        'postcss-stats-reporter'
      },
      {
        name:
        'postcss-reporter'
      },
      {
        name:
        'autoprefixer'
      }
    ])
  }
}

module.exports = {
  normalizeEntityName () {}, // no-op since we're just adding dependencies

  afterInstall () {
    return this.addPackagesToProject([
      {
        name: 'postcss-scss',
        target: '1.0.1'
      },
      { name: 'precss',
        target: '1.3.0'
      }
    ])
  }
}

/* jshint node:true */
function scenario (ver) {
  return {
    name: `ember-${ver}`,
    bower: {
      dependencies: {
        'ember': `~${ver}.0`
      },
      resolutions: {
        'ember': `~${ver}.0`
      }
    }
  }
}

module.exports = {
  scenarios: [
    scenario('1.13'),
    scenario('2.4'),
    scenario('2.8'),
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        },
        resolutions: {
          'ember': 'release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        },
        resolutions: {
          'ember': 'canary'
        }
      }
    }
  ]
}

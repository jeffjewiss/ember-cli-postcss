import Service from '@ember/service'
import { debug } from '@ember/debug'

const docEl = window && window.document ? window.document.documentElement : null

export default Service.extend({
  getVal ({ element = docEl, variableName }) {
    if (!element) {
      debug('No element provided')
      return false
    }

    if (cssVariablesSupported()) {
      if (variableName) {
        return getComputedStyle(element).getPropertyValue(variableName).trim()
      } else {
        debug('No variable name provided')
      }
    } else {
      debug('CSS variables are not supported')
      debug(`Tried to get custom property on <${element}> with name ${variableName}`)
    }
  },

  setVal ({ element = docEl, variableName, variableValue }) {
    if (!element) {
      debug('No element provided')
      return false
    }

    if (cssVariablesSupported()) {
      if (!!variableName && !!variableValue) {
        return element.style.setProperty(variableName, variableValue)
      } else {
        debug('Needs variable name and value to perform setVal')
      }
    } else {
      debug('CSS variables are not supported')
      debug(`Tried to set custom property on <${element}> with name ${variableName} and value ${variableValue}`)
    }
  },

  removeVal ({ element = docEl, variableName }) {
    if (!element) {
      debug('No element provided')
      return false
    }

    if (cssVariablesSupported()) {
      if (variableName) {
        return element.style.removeProperty(variableName)
      } else {
        debug('No variable name provided')
      }
    } else {
      debug('CSS variables are not supported')
      debug(`Tried to remove custom property on <${element}> with name ${variableName}`)
    }
  },

  supported () {
    return cssVariablesSupported()
  }
})

function cssVariablesSupported () {
  // Relies on the CSS suports API in the browser
  return window &&
    window.CSS &&
    window.CSS.supports &&
    window.CSS.supports('color', 'var(--fake-var)')
}

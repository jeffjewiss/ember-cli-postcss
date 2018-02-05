import Service from '@ember/service'
const docEl = document ? document.documentElement : null

export default Service.extend({
  getVal ({ element = docEl, variableName }) {
    if (cssVariablesSupported()) {
      if (variableName) {
        return getComputedStyle(element).getPropertyValue(variableName).trim()
      } else {
        console.debug('No variable name provided')
      }
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to get custom property on <${element}> with name ${variableName}`)
    }
  },

  setVal ({ element = docEl, variableName, variableValue }) {
    if (cssVariablesSupported()) {
      if (!!variableName && !!variableValue) {
        return element.style.setProperty(variableName, variableValue)
      } else {
        console.debug('Needs variable name and value to perform setVal')
      }
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to set custom property on <${element}> with name ${variableName} and value ${variableValue}`)
    }
  },

  removeVal ({ element = docEl, variableName }) {
    if (cssVariablesSupported()) {
      if (variableName) {
        return element.style.removeProperty(variableName)
      } else {
        console.debug('No variable name provided')
      }
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to remove custom property on <${element}> with name ${variableName}`)
    }
  }
})

function cssVariablesSupported () {
  // Relies on the CSS suports API in the browser
  return window &&
    window.CSS &&
    window.CSS.supports &&
    window.CSS.supports('--test-var', 0)
}

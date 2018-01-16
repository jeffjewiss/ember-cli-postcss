import Service from '@ember/service'

const docEl = document ? document.documentElement : null

const cssVariablesSupported = function () {
  // Relies on the CSS suports API in the browser
  return window &&
    window.CSS &&
    window.CSS.supports &&
    window.CSS.supports('--test-var', 0)
}

export default Service.extend({

  getVariableValue ({ element = docEl, variableName }) {
    if (cssVariablesSupported()) {
      element.style.getPropertyValue(variableName)
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to get custom property on <${element}> with name ${variableName}`)
    }
  },

  setVariableValue ({ element = docEl, variableName, variableValue }) {
    if (cssVariablesSupported()) {
      element.style.setProperty(variableName, variableValue)
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to set custom property on <${element}> with name ${variableName} and value ${variableValue}`)
    }
  },

  removeVariable ({ element = docEl, variableName }) {
    if (cssVariablesSupported()) {
      element.style.removeProperty(variableName)
    } else {
      console.debug('CSS variables are not supported')
      console.debug(`Tried to remove custom property on <${element}> with name ${variableName}`)
    }
  }
})

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
const replaceReg = (value) => {
  return value.replace(/^\D*([0-9]\d*\.?\d{0,4})?.*$/, '$1')
}
const directives = {
  test: {
    bind: function () { },
    inserted: function () { },
    update: function () { },
    componentUpdated: function () { },
    unbind: function () { }
  },
  number: {
    bind: function (el) {
      const input = el.children[0]
      if (!input && input !== 0) return
      const inputFn = function (e) {
        input.value = replaceReg(input.value)
        if (input.value.length > 7) {
          input.value = input.value.slice(0, 7)
        }
        if (input.value === 'undefined') input.value = ''
        trigger(input, 'input')
      }
      input.onkeyup = inputFn
      input.onblur = inputFn
    }
  }
}

export default function install(Vue) {
  Object.keys(directives).forEach(function (key) {
    Vue.directive(key, directives[key])
  })
}

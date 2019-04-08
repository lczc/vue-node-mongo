import commonDemo from './src/main'

/* istanbul ignore next */
commonDemo.install = function (Vue) {
  Vue.component(commonDemo.name, commonDemo)
}

export default commonDemo

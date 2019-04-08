import commonDemo from './commonDemo/index'
const components = [
  commonDemo
]
export default function install(Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}


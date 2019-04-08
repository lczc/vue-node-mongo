const filters = {
  date(value) {
    let date = new Date(value * 1000)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + date.getSeconds()
  },
  costDay(value) {
    return Math.floor(value / 86400)
  }
}
export default function install(Vue) {
  Object.keys(filters).forEach(function (key) {
    Vue.filter(key, filters[key])
  })
}

const eslintrc = require('gt-eslintrc')();

// 配置全局变量
eslintrc.globals = {
  $: true
}

module.exports = eslintrc

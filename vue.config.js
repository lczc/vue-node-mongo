let path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
let isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath: `/static/pc/`,
  outputDir: `./dist/`,
  productionSourceMap: !isProduction,
  chainWebpack: config => {
    config
      .plugin('html').tap(args => {
        let template = isProduction ? 'pro' : 'dev'
        args[0].template = resolve(`/public/template/${template}.tpl`)
        return args
      })
      .end()
      .resolve.alias
      .set('@', resolve('src'))
      .set('@utils', resolve('src/utils/index.js'))
      .end()
  },
  configureWebpack: config => {
    if (isProduction) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
    }
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://127.0.0.1:7001',
        ws: false,
        changeOrigin: true
      }
    }
  }
}

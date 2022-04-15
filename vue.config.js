const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true, // 接口跨域
        ws: true,
        pathRewrite: {
          '^/api': 'http://127.0.0.1:8081'
        }
      }
    }
  }
})

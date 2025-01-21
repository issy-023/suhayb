const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true, // Transpileer afhankelijkheden indien nodig
  devServer: {
    port: 8080, // Pas de poort aan indien nodig
    open: true, // Open automatisch in browser
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy voor API-aanroepen
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src'), // Alias naar 'src'
      },
    },
  },
  lintOnSave: false, // Schakel ESLint uit tijdens het saven, indien gewenst
});

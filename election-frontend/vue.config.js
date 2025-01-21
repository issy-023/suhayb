const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true, // Transpileer afhankelijkheden indien nodig
  devServer: {
    port: 8080, // Pas de poort aan indien nodig
    open: true, // Open automatisch in browser
    proxy: {
      "/api": {
        target: "http://167.71.15.21:8084", // HTTP backend
        changeOrigin: true,
        pathRewrite: { "^/api": "/api/v1/User" },
        secure: false, // Bypass SSL for development
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": require("path").resolve(__dirname, "src"), // Alias naar 'src'
      },
    },
  },
  lintOnSave: false, // Schakel ESLint uit tijdens het saven, indien gewenst
});

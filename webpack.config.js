const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: "development",
  entry: [
    path.resolve(__dirname, "src/js/index.js"),
    path.resolve(__dirname, "src/scss/app.scss")
  ],
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "app.js",
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      bootstrap: 'bootstrap/scss'
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: '../css',
              name: "[name].min.css"
            },
          },
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};

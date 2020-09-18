const webpack = require("webpack")
const path = require("path")

module.exports = {
  mode: "development",
  context: __dirname,

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "../"), "node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },

      { test: /\.js$/, enforce: "pre", use: "source-map-loader" },

      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  }
}

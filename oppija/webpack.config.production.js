var config = require("./webpack.config")

module.exports = Object.assign({}, config, {
  mode: "production",
  devtool: "source-map",
  plugins: []
})

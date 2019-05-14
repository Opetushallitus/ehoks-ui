var webpack = require("webpack")
var path = require("path")
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
var TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
  mode: "development",
  context: __dirname,
  entry: ["./src/index.tsx"],
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/dist/",
    path: path.resolve(__dirname, "public/dist")
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "public"),
    disableHostCheck: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 4000,
    hot: true,
    inline: true,
    proxy: {
      "/auth-dev": "http://localhost:3000",
      "/ehoks-oppija-backend": "http://localhost:3000",
      "/virkailija-raamit": {
        target: "https://virkailija.testiopintopolku.fi",
        secure: false,
        changeOrigin: true
      }
    }
  },
  devtool: "inline-source-map",
  optimization: {},
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    plugins: [new TsconfigPathsPlugin({})]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },
      { test: /\.js$/, enforce: "pre", use: "source-map-loader" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 10000
        }
      },
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

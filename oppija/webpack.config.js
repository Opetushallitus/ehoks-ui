var webpack = require("webpack")
var path = require("path")
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
var TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
var createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
var styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = {
  mode: "development",
  context: __dirname,
  entry: ["./src/index.tsx"],
  output: {
    // `filename` provides a template for naming your bundles (remember to use `[name]`)
    filename: "[name].bundle.js",
    // `chunkFilename` provides a template for naming code-split bundles (optional)
    chunkFilename: "[name].bundle.js",
    publicPath: "/ehoks/dist/",
    path: path.resolve(__dirname, "public/ehoks/dist")
  },

  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "public", "ehoks"),
    disableHostCheck: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    hot: true,
    inline: true,
    proxy: {
      "/auth-dev": "http://localhost:3000",
      "/ehoks-oppija-backend": "http://localhost:3000"
    }
  },

  devtool: "inline-source-map",

  optimization: {},

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    plugins: [new TsconfigPathsPlugin({})]
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({ useTypescriptIncrementalApi: false }),
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        enforce: "pre",
        use: "source-map-loader",
        // these packages have problems with their sourcemaps
        exclude: [
          /node_modules\/react-responsive/]
      },
      // Load images with 'file-loader'.
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

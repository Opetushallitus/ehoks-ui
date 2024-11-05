const webpack = require("webpack")
const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
  .default
const styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = {
  mode: "development",
  context: __dirname,
  entry: ["./src/index.tsx"],
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/ehoks-virkailija-ui/dist/",
    path: path.resolve(__dirname, "public/ehoks-virkailija-ui/dist")
  },
  devServer: {
    compress: true,
    static: path.join(__dirname, "public"),
    allowedHosts: "all",
    historyApiFallback: {
      disableDotRule: true
    },
    host: "0.0.0.0",
    port: 4000,
    proxy: [
      {
        context: ["/auth-dev"],
        target: "http://localhost:3000",
      },
      {
        context: ["/cas-oppija"],
        target: "http://localhost:3000"
      },
      {
        context: ["/ehoks-backend"],
        target: "http://localhost:3000"
      },
      {
        context: ["/ehoks-virkailija-backend"],
        target: "http://localhost:3000",
      },
      {
        context: ["/virkailija-raamit"],
        target: "https://virkailija.testiopintopolku.fi",
        secure: false,
        changeOrigin: true
      }
    ]
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
              experimentalWatchApi: true,
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer]
              })
            }
          }
        ]
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: "source-map-loader",
        // these packages have problems with their sourcemaps
        exclude: [/node_modules\/react-responsive/, /node_modules\/react-axe/]
      },
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
  },
  ignoreWarnings: [/Failed to parse source map/]
}

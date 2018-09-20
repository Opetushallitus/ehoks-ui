const path = require("path")
const glob = require("glob")

module.exports = {
  ignore: [
    "**/src/components/App.tsx",
    "**/src/components/AppFooter.tsx",
    "**/src/components/AppHeader.tsx",
    "**/src/components/Header.tsx"
  ],
  title: "eHoks styleguide",
  components: function() {
    return glob
      .sync(path.resolve(__dirname, "src/components/**/*.tsx"))
      .filter(function(module) {
        return /\/[A-Z]\w*\.tsx$/.test(module)
      })
  },
  resolver: require("react-docgen").resolver.findAllComponentDefinitions,
  propsParser: require("react-docgen-typescript").withCustomConfig(
    "./tsconfig.json",
    {
      propFilter: prop => {
        if (prop.parent == null) {
          return true
        }

        return prop.parent.fileName.indexOf("node_modules/@types/react") < 0
      }
    }
  ).parse,
  webpackConfig: require("./webpack.config")
}

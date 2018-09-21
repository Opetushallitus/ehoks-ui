const path = require("path")
const glob = require("glob")

module.exports = {
  ignore: [
    "**/src/components/App.tsx",
    "**/src/components/AppFooter.tsx",
    "**/src/components/AppHeader.tsx",
    "**/src/components/Header.tsx"
  ],
  title: "eHOKS styleguide",
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
  webpackConfig: require("./webpack.config"),
  template: {
    head: {
      links: [
        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700"
        }
      ]
    }
  },
  usageMode: "expand",
  exampleMode: "expand",
  pagePerSection: true,
  theme: {
    fontFamily: {
      base: '"Source Sans Pro", sans-serif'
    }
  },
  styles: {
    StyleGuide: {
      "@global html": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0
      },
      "@global body": {
        fontFamily: '"Source Sans Pro", sans-serif',
        margin: 0,
        padding: 0
      },
      "@global *, *:before, *:after": {
        boxSizing: "inherit"
      },
      "@global": {
        ".CircularProgressbar .CircularProgressbar-path": {
          stroke: "#027FA9",
          strokeLinecap: "square"
        },
        ".CircularProgressbar .CircularProgressbar-trail": {
          stroke: "#d6d6d6"
        },
        ".CircularProgressbar .CircularProgressbar-text": {
          fill: "#027FA9",
          fontSize: "48px",
          dominantBaseline: "middle",
          textAnchor: "middle"
        }
      }
    }
  }
}

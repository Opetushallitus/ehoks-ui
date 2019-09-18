const path = require("path")
const glob = require("glob")

module.exports = {
  ignore: [
    "**/shared/components/APIConfigContext.tsx",
    "**/shared/components/AppContext.tsx",
    "**/shared/components/ChartArrow.tsx",
    "**/shared/components/ChartContainer.tsx",
    "**/shared/components/ChartContent.tsx",
    "**/shared/components/ChartRow.tsx",
    "**/shared/components/CompetenceRequirement.tsx",
    "**/shared/components/Container.tsx",
    "**/shared/components/ContentArea.tsx",
    "**/shared/components/EmptyItem.tsx",
    "**/shared/components/Header.tsx",
    "**/shared/components/Heading.tsx",
    "**/shared/components/HelpPopup.tsx",
    "**/shared/components/HOKSEidContext.tsx",
    "**/shared/components/HoksInfo.tsx",
    "**/shared/components/HomeLink.tsx",
    "**/shared/components/HomeOrb.tsx",
    "**/shared/components/icons/*.tsx",
    "**/shared/components/LabeledColumn.tsx",
    "**/shared/components/LinkPanelContainer.tsx",
    "**/shared/components/ListColumnHeaders.tsx",
    "**/shared/components/ListContainer.tsx",
    "**/shared/components/ListHeading.tsx",
    "**/shared/components/ListItem.tsx",
    "**/shared/components/NavigationContainer.tsx",
    "**/shared/components/Page.tsx",
    "**/shared/components/Paging.tsx",
    "**/shared/components/ProgressPies.tsx",
    "**/shared/components/SectionContainer.tsx",
    "**/shared/components/StudiesContainer.tsx",
    "**/shared/components/StudyInfo/*.tsx",
    "**/shared/components/StyleguidistWrapper.tsx",
    "**/shared/components/SubHeader.tsx",
    "**/shared/components/Table.tsx",
    "**/shared/components/Table/*.tsx",
    "**/shared/components/ThemeWrapper.tsx",
    "**/shared/components/TitleContainer.tsx",
    "**/shared/components/Opiskelija/*.tsx",
    "**/shared/components/react-jsonschema-form/Label.tsx",
    "**/shared/components/react-jsonschema-form/TypeaheadField.tsx"
  ],
  title: "eHOKS styleguide",
  components: function() {
    return glob
      .sync(path.resolve(__dirname, "../components/**/*.tsx"))
      .filter(function(module) {
        return /\/[A-Z]\w*\.tsx$/.test(module)
      })
  },
  resolver: require("react-docgen").resolver.findAllComponentDefinitions,
  propsParser: require("react-docgen-typescript").withCustomConfig(
    path.resolve(__dirname, "tsconfig.json"),
    {
      propFilter: prop => {
        if (prop.parent == null) {
          return true
        }

        return prop.parent.fileName.indexOf("node_modules/@types/react") < 0
      }
    }
  ).parse,
  require: [path.resolve(__dirname, "./setup")],
  styleguideComponents: {
    Wrapper: path.join(__dirname, "./StyleguidistWrapper")
  },
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
  mountPointId: "app",
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

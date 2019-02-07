var fs = require("fs")
var glob = require("glob")
var parser = require("typescript-react-intl").default
var messages = require("../shared/stores/TranslationStore/defaultMessages.json")

var defaultMessages = messages.reduce((result, message) => {
  return [
    ...result,
    {
      id: message.key,
      defaultMessage: message.value
    }
  ]
}, [])

function runner(pattern, cb) {
  var results = []
  pattern = pattern || "{src/**/*.@(tsx|ts),../shared/**/*.@(tsx|ts)}"
  glob(pattern, function(err, files) {
    if (err) {
      throw new Error(err)
    }
    files.forEach(f => {
      var contents = fs.readFileSync(f).toString()
      var res = parser(contents)
      results = results.concat(res)
    })

    cb && cb(results)
  })
}

// adapted from https://github.com/bang88/typescript-react-intl usage example
runner(null, function(res) {
  var locale = {}

  defaultMessages.concat(res).forEach(r => {
    locale[r.id] = r.defaultMessage
  })

  const sortedKeys = Object.keys(locale).sort()

  var locales = {
    fi: sortedKeys.reduce(function(result, key) {
      return {
        ...result,
        [key]: locale[key].replace(/\s+/g, " ").replace("\n", "")
      }
    }, {})
  }

  fs.writeFileSync(`translations.json`, `${JSON.stringify(locales, null, 2)}\n`)
})

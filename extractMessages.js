var fs = require("fs")
var glob = require("glob")
var parser = require("typescript-react-intl").default

function runner(pattern, cb) {
  var results = []
  pattern = pattern || "src/**/*.@(tsx|ts)"
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

  res.forEach(r => {
    locale[r.id] = r.defaultMessage
  })

  var locales = {
    fi: locale
  }

  fs.writeFileSync(`translations.json`, `${JSON.stringify(locales, null, 2)}\r`)
})

function piwik(siteId) {
  var _paq = window._paq || []
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["trackPageView"])
  _paq.push(["enableLinkTracking"])
  ;(function() {
    var u = "//analytiikka.opintopolku.fi/matomo/"
    _paq.push(["setTrackerUrl", u + "matomo.php"])
    _paq.push(["setSiteId", siteId])
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0]
    g.type = "text/javascript"
    g.async = true
    g.defer = true
    g.src = u + "matomo.js"
    s.parentNode.insertBefore(g, s)
  })()
}

if (document.URL.indexOf("testiopintopolku.fi") != -1) {
  piwik("23")
} else if (document.URL.indexOf("opintopolku.fi") != -1) {
  piwik("22")
} else {
  console.log("No siteId for Matomo, hence no data collection")
}

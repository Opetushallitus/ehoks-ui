var siteDomain = document.domain
var piwikSiteId
var pathArray = window.location.pathname.split("/")[4]

if ("https://" + document.domain + "/ehoks/" == document.URL) {
  var ehoksTitle = "Ehoks etusivu"
} else if (document.URL.includes("suunnittelu")) {
  var ehoksTitle = pathArray ? pathArray : "tavoitteeni"
} else {
  var ehoksTitle = "Ehoks " + window.location.pathname.split("/")[2]
}

switch (siteDomain) {
  case "opintopolku.fi":
    piwikSiteId = 22
    break
  case "studieinfo.fi":
    piwikSiteId = 22
    break
  case "studyinfo.fi":
    piwikSiteId = 22
    break
  case "testiopintopolku.fi":
    piwikSiteId = 23
    break
  default:
    piwikSiteId = "" // Kehitys
}

var _paq = window._paq || []
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["setDocumentTitle", ehoksTitle])
_paq.push(["trackPageView"])
_paq.push(["enableLinkTracking"])
;(function() {
  var u = "//analytiikka.opintopolku.fi/piwik/"
  _paq.push(["setTrackerUrl", u + "matomo.php"])
  _paq.push(["setSiteId", piwikSiteId])
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0]
  g.type = "text/javascript"
  g.async = true
  g.defer = true
  g.src = u + "matomo.js"
  s.parentNode.insertBefore(g, s)
})()

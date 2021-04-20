import queryString from "query-string"
import { Locale } from "stores/TranslationStore"
import { fetch, appendCommonHeaders } from "fetchUtils"

export function parseLocaleParam(search: string) {
  const lang = queryString.parse(search).lang
  if (lang === "fi") {
    saveLocaleToSessionStorage(Locale.FI)
    return Locale.FI
  } else if (lang === "sv") {
    saveLocaleToSessionStorage(Locale.SV)
    return Locale.SV
  } else {
    return ""
  }
}

export function updateLocaleSessionStorage(locale: Locale | string): Locale {
  if (locale) {
    saveLocaleToSessionStorage(locale)
    return locale === "fi" ? Locale.FI : Locale.SV
  } else {
    return readLocaleFromSessionStorage()
  }
}

export function saveLocaleToSessionStorage(locale: string) {
  if (window.sessionStorage) {
    sessionStorage.setItem("ehoks-locale", locale)
  }
}

export function isLocaleStored() {
  if (window.sessionStorage) {
    return sessionStorage.getItem("ehoks-locale") ? true : false
  } else {
    return false
  }
}

export function readLocaleFromSessionStorage() {
  if (window.sessionStorage) {
    const storedLocale = sessionStorage.getItem("ehoks-locale")
    return storedLocale === "sv" ? Locale.SV : Locale.FI
  } else {
    return Locale.FI
  }
}

export function cleanLocaleParam() {
  const uri = window.location.toString()
  if (uri.indexOf("?") > 0) {
    const cleanUri = uri.substring(0, uri.indexOf("?lang"))
    window.history.replaceState({}, document.title, cleanUri)
  }
}

export function readLocaleFromDomain() {
  const uri = window.location.toString()
  return uri.includes("studieinfo") ? Locale.SV : Locale.FI
}

export function getActiveDomain() {
  const uri = window.location.toString()
  let prefix = ""
  if (uri.includes("hahtuva")) {
    prefix = "hahtuva"
  } else if (uri.includes("untuva")) {
    prefix = "untuva"
  } else if (uri.includes("testi")) {
    prefix = "testi"
  }
  const postfix = uri.includes("studieinfo")
    ? "studieinfo.fi"
    : "opintopolku.fi"
  return prefix + postfix
}

export function setDocumentLocale(locale: Locale | string) {
  if (locale === "sv") {
    document.documentElement.lang = "sv"
  } else {
    document.documentElement.lang = "fi"
  }
}

export async function getCasMeLocale() {
  const response = await fetch(
    `${location.protocol}//${location.host}/cas/me`,
    {
      headers: appendCommonHeaders()
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const data = await response.json()
  return data.lang
}

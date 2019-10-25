import queryString from "query-string"
import {Locale} from "stores/TranslationStore"

export function parseLocaleParam(search: string) {
    const lang = queryString.parse(search).lang
    if (lang === 'fi') {
        saveLocaleToLocalStorage(Locale.FI)
        return Locale.FI
    } else if (lang === 'sv') {
        saveLocaleToLocalStorage(Locale.SV)
        return Locale.SV
    } else {
        return ''
    }
}

export function updateLocaleLocalStorage(locale: Locale | string): Locale {
    if (locale) {
        saveLocaleToLocalStorage(locale)
        return locale === 'fi' ? Locale.FI : Locale.SV
    } else {
        return readLocaleFromLocalStorage()
    }
}

export function saveLocaleToLocalStorage(locale: string) {
    if (window.localStorage) {
        localStorage.setItem('ehoks-locale', locale)
    }
}

export function isLocaleStored() {
    if (window.localStorage) {
        return localStorage.getItem('ehoks-locale') ? true : false
    } else {
        return false
    }
}

export function readLocaleFromLocalStorage() {
    if (window.localStorage) {
        const storedLocale = localStorage.getItem('ehoks-locale')
        return storedLocale === 'sv' ? Locale.SV : Locale.FI
    } else {
        return Locale.FI
    }
}

export function cleanLocaleParam() {
    const uri = window.location.toString()
    if (uri.indexOf("?") > 0) {
        const cleanUri = uri.substring(0, uri.indexOf("?lang"));
        window.history.replaceState({}, document.title, cleanUri);
    }
}

export function readLocaleFromDomain() {
    const uri = window.location.toString()
    return uri.includes("studieinfo") ? Locale.SV : Locale.FI
}

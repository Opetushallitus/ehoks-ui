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

export function updateLocaleLocalStorage(locale: Locale | string) {
    if (locale) {
        saveLocaleToLocalStorage(locale)
        return locale
    } else {
        return readLocaleFromLocalStorage()
    }
}

export function saveLocaleToLocalStorage(locale: string) {
    if (window.localStorage) {
        localStorage.setItem('ehoks-locale', locale)
    }
}

export function readLocaleFromLocalStorage() {
    if (window.localStorage) {
        return localStorage.getItem('ehoks-locale') === null ? '' : localStorage.getItem('ehoks-locale')
    } else {
        return ''
    }
}

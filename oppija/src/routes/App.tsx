import { Routes, Route } from "react-router"
import { ThemeWrapper } from "components/ThemeWrapper"
import {
  cleanLocaleParam,
  isLocaleStored,
  parseLocaleParam,
  readLocaleFromDomain,
  readLocaleFromSessionStorage,
  setDocumentLocale
} from "localeUtils"
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { AppFooter } from "routes/App/AppFooter"
import { AppHeader } from "routes/App/AppHeader"
import AppNotifications from "routes/App/AppNotifications"
import { GlobalStyles } from "routes/App/globalStyles"
import { Etusivu } from "routes/Etusivu"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { Suunnittelu } from "routes/Suunnittelu"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"
import { Redirect } from "components/Redirect"

const Container = styled("div")`
  margin: 0;
  ${(props) =>
    props.theme.typography
      .body}/* Needed for fixing apply-raamit.css injection */
`

const Main = styled("main")``

const ModalContainer = styled("div")``

const MainApp = () => (
  <Container>
    <AppHeader />
    <AppNotifications />
    <Main id="main" role="main">
      <Routes>
        <Route index element={<Etusivu />} />
        <Route path="suunnittelu/*" element={<Suunnittelu />} />
        <Route
          path="henkilokohtaistaminen"
          element={<Henkilokohtaistaminen />}
        />
        <Route path="ammatillinentutkinto" element={<Ammatillinentutkinto />} />
      </Routes>
    </Main>
    <AppFooter />
    <GlobalStyles />
    <ModalContainer id="modal-root" />
  </Container>
)

export interface AppProps {
  store?: IRootStore
}

export const App = inject("store")(
  observer((props: AppProps) => {
    const { session, translations } = props.store!
    useEffect(() => {
      const localeParam = parseLocaleParam(window.location.search)
      if (localeParam) {
        translations.setActiveLocale(localeParam)
        cleanLocaleParam()
      } else {
        const locale = isLocaleStored()
          ? readLocaleFromSessionStorage()
          : readLocaleFromDomain()
        translations.setActiveLocale(locale)
      }

      // load user session info from backend
      session.checkSession()
    }, [session, translations])

    const activeLocale = translations.activeLocale
    setDocumentLocale(activeLocale)
    const localisedMessages = translations.messages[activeLocale]
    const messages =
      activeLocale === Locale.FI
        ? localisedMessages
        : // use finnish translations as fallback, merge provided translations
          { ...translations.messages.fi, ...localisedMessages }
    return (
      <ThemeWrapper>
        <IntlProvider
          defaultLocale={Locale.FI}
          locale={activeLocale}
          messages={messages}
          textComponent={React.Fragment}
        >
          <Routes>
            <Route path="/ehoks/*" element={<MainApp />} />
            <Route path="/" element={<Redirect to="/ehoks/" />} />
          </Routes>
        </IntlProvider>
      </ThemeWrapper>
    )
  })
)

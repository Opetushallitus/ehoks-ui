import { BrowserRouter, Routes } from "react-router-dom"
import { ThemeWrapper } from "components/ThemeWrapper"
import {
  parseLocaleParam,
  setDocumentLocale,
  cleanLocaleParam,
  isLocaleStored,
  readLocaleFromSessionStorage,
  getCasMeLocale
} from "localeUtils"
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { IntlProvider } from "react-intl"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"
import { GlobalStyles } from "./App/globalStyles"
import { Header } from "./Header"
import { KoulutuksenJarjestaja } from "./KoulutuksenJarjestaja"
import { Opiskelija } from "./KoulutuksenJarjestaja/Opiskelija"
import { LuoHOKS } from "./LuoHOKS"
import { MuokkaaHOKS } from "./MuokkaaHOKS"
import { VirkailijaRaamit } from "./VirkailijaRaamit"
import { Yllapito } from "./Yllapito"
import { Raportit } from "./Raportit"
import AppNotifications from "./App/AppNotifications"
import { Route } from "react-router"
import { Redirect } from "components/Redirect"

const Container = styled("div")`
  margin: 0;
  height: 100%;
  ${(props) =>
    props.theme.typography
      .body}/* Needed for fixing apply-raamit.css injection */
`

const StyledRoutes = styled(Routes)`
  height: 100%;
`

export interface AppProps {
  store?: IRootStore
}

export const App = inject("store")(
  observer(({ store }: AppProps) => {
    useEffect(() => {
      // automatically login user with CAS login
      store!.environment
        .getEnvironment()
        .then(() => store!.session.checkSession())
        .then(() => {
          if (!store!.session.isLoggedIn) {
            window.location.href = store!.environment.virkailijaLoginUrl
          }
          const localeParam = parseLocaleParam(window.location.search)
          if (localeParam) {
            store!.translations.setActiveLocale(localeParam)
            cleanLocaleParam()
          } else if (isLocaleStored()) {
            store!.translations.setActiveLocale(readLocaleFromSessionStorage())
          } else {
            return getCasMeLocale()
              .then((casMeLocale) => {
                store!.translations.setActiveLocale(casMeLocale)
              })
              .catch(() => {
                store!.translations.setActiveLocale(Locale.FI)
              })
          }
        })
    }, [store])

    const activeLocale = store!.translations.activeLocale
    setDocumentLocale(activeLocale)
    const translations = store!.translations.messages[activeLocale]
    const messages =
      activeLocale === Locale.FI
        ? translations
        : // use finnish translations as fallback, merge provided translations
          { ...store!.translations.messages.fi, ...translations }
    const selectedOrganisationOid = store!.session.selectedOrganisationOid
    const defaultPath = `/ehoks-virkailija-ui/koulutuksenjarjestaja/${selectedOrganisationOid}`

    return (
      <BrowserRouter>
        <ThemeWrapper>
          <IntlProvider
            defaultLocale={Locale.FI}
            locale={activeLocale}
            key={activeLocale}
            messages={messages}
            textComponent={React.Fragment}
          >
            <Container>
              <VirkailijaRaamit />
              <Header />
              <AppNotifications />
              <StyledRoutes>
                <Route
                  path="/ehoks-virkailija-ui/"
                  element={<Redirect to={defaultPath} />}
                />
                <Route
                  path="/ehoks-virkailija-ui/luohoks"
                  element={<LuoHOKS />}
                />
                <Route
                  path="/ehoks-virkailija-ui/hoks/:oppijaOid/:hoksId"
                  element={<MuokkaaHOKS />}
                />
                <Route
                  path="/ehoks-virkailija-ui/koulutuksenjarjestaja"
                  element={<Redirect to={defaultPath} />}
                />
                <Route
                  path="/ehoks-virkailija-ui/koulutuksenjarjestaja/:orgId"
                  element={<KoulutuksenJarjestaja />}
                />
                <Route
                  path="/ehoks-virkailija-ui/koulutuksenjarjestaja/:orgId/oppija/:studentId/*"
                  element={<Opiskelija />}
                />
                <Route
                  path="/ehoks-virkailija-ui/yllapito"
                  element={<Yllapito />}
                />
                <Route
                  path="/ehoks-virkailija-ui/raportit"
                  element={<Raportit />}
                />
              </StyledRoutes>
              <GlobalStyles />
            </Container>
          </IntlProvider>
        </ThemeWrapper>
      </BrowserRouter>
    )
  })
)

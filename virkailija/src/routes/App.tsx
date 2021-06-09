import { Redirect, Router } from "@reach/router"
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
import React from "react"
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
import { LoadingSpinner } from "components/LoadingSpinner"
import AppNotifications from "./App/AppNotifications"

const Container = styled("div")`
  margin: 0;
  height: 100%;
  ${props =>
    props.theme.typography
      .body} /* Needed for fixing apply-raamit.css injection */
`

const StyledRouter = styled(Router)`
  height: 100%;
`

export interface AppProps {
  store?: IRootStore
}

@inject("store")
@observer
export class App extends React.Component<AppProps> {
  async componentDidMount() {
    // automatically login user with CAS login
    await this.props.store!.environment.getEnvironment()
    try {
      await this.props.store!.session.checkSession()
    } finally {
      if (!this.props.store!.session.isLoggedIn) {
        window.location.href = this.props.store!.environment.virkailijaLoginUrl
      }
    }
    const { store } = this.props
    const localeParam = parseLocaleParam(window.location.search)
    if (localeParam) {
      store!.translations.setActiveLocale(localeParam)
      cleanLocaleParam()
    } else if (isLocaleStored()) {
      store!.translations.setActiveLocale(readLocaleFromSessionStorage())
    } else {
      try {
        const casMeLocale = await getCasMeLocale()
        store!.translations.setActiveLocale(casMeLocale)
      } catch {
        store!.translations.setActiveLocale(Locale.FI)
      }
    }
    store!.translations.setIsInitialRenderLoading(false)
  }

  render() {
    const { store } = this.props

    if (store!.translations.isInitialRenderLoading) {
      return (
        <ThemeWrapper>
          <Container>
            <VirkailijaRaamit />
            <br />
            <LoadingSpinner />
            <GlobalStyles />
          </Container>
        </ThemeWrapper>
      )
    }

    const activeLocale = store!.translations.activeLocale
    setDocumentLocale(activeLocale)
    const translations = store!.translations.messages[activeLocale]
    const messages =
      activeLocale === Locale.FI
        ? translations
        : // use finnish translations as fallback, merge provided translations
          { ...store!.translations.messages.fi, ...translations }

    return (
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
            <StyledRouter basepath="/ehoks-virkailija-ui">
              <Redirect
                from="/"
                to="/ehoks-virkailija-ui/koulutuksenjarjestaja"
                noThrow={true}
              />
              <LuoHOKS path="luohoks" />
              <MuokkaaHOKS path="hoks/:oppijaOid/:hoksId" />
              <KoulutuksenJarjestaja path="koulutuksenjarjestaja" />
              <Yllapito path="yllapito" />
              <Opiskelija path="koulutuksenjarjestaja/:studentId/*" />
            </StyledRouter>
            <GlobalStyles />
          </Container>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}

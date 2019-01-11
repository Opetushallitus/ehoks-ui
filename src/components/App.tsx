import { Router } from "@reach/router"
import { GlobalStyles } from "components/App/globalStyles"
import { AppFooter } from "components/AppFooter"
import { AppHeader } from "components/AppHeader"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { Etusivu } from "routes/Etusivu"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { KoulutuksenJarjestaja } from "routes/KoulutuksenJarjestaja"
import { Opiskelija } from "routes/KoulutuksenJarjestaja/Opiskelija"
import { OmienOpintojenSuunnittelu } from "routes/OmienOpintojenSuunnittelu"
import { TyopaikanToimija } from "routes/TyopaikanToimija"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { AppErrors } from "./AppErrors"
import { ThemeWrapper } from "./ThemeWrapper"

const Container = styled("div")`
  margin: 0;
`

export interface AppProps {
  store?: IRootStore
}

@inject("store")
@observer
export class App extends React.Component<AppProps> {
  componentDidMount() {
    // load user session info from backend
    this.props.store!.session.checkSession()
  }

  render() {
    const { store } = this.props
    const activeLocale = store!.translations.activeLocale
    const translations = store!.translations.messages[activeLocale]
    const messages =
      activeLocale === "fi"
        ? translations
        : // use finnish translations as fallback, merge provided translations
          { ...store!.translations.messages.fi, ...translations }
    return (
      <ThemeWrapper>
        <IntlProvider
          defaultLocale="fi"
          locale={activeLocale}
          messages={messages}
          textComponent={React.Fragment}
        >
          <Container>
            <AppHeader />
            <AppErrors />
            <Router basepath="/ehoks">
              <Etusivu path="/" />
              <OmienOpintojenSuunnittelu path="suunnittelu/*" />
              <TyopaikanToimija path="tyopaikantoimija" />
              <Henkilokohtaistaminen path="henkilokohtaistaminen" />
              <Ammatillinentutkinto path="ammatillinentutkinto" />
              <KoulutuksenJarjestaja path="koulutuksenjarjestaja" />
              <Opiskelija path="koulutuksenjarjestaja/:id/*" />
            </Router>
            <AppFooter />
            <GlobalStyles />
          </Container>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}

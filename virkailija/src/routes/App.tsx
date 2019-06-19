import { Redirect, Router } from "@reach/router"
import { ThemeWrapper } from "components/ThemeWrapper"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { GlobalStyles } from "./App/globalStyles"
import { Header } from "./Header"
import { KoulutuksenJarjestaja } from "./KoulutuksenJarjestaja"
import { Opiskelija } from "./KoulutuksenJarjestaja/Opiskelija"
import { LuoHOKS } from "./LuoHOKS"

const Container = styled("div")`
  margin: 0;
  height: 100%;
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
        await this.props.store!.session.login(
          this.props.store!.environment.virkailijaLoginUrl
        )

        this.props.store!.session.checkSession()
      }
    }
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
            <Header />
            <StyledRouter basepath="/ehoks-virkailija-ui">
              <Redirect
                from="/"
                to="/ehoks-virkailija-ui/koulutuksenjarjestaja"
                noThrow={true}
              />
              <LuoHOKS path="luohoks" />
              <KoulutuksenJarjestaja path="koulutuksenjarjestaja" />
              <Opiskelija path="koulutuksenjarjestaja/:studentId/*" />
            </StyledRouter>
            <GlobalStyles />
          </Container>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}

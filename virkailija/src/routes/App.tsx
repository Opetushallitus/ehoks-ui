import { Router } from "@reach/router"
import { ThemeWrapper } from "components/ThemeWrapper"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { GlobalStyles } from "./App/globalStyles"
import { Etusivu } from "./Etusivu"
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
            <StyledRouter basepath="/ehoks-ui">
              <Etusivu path="/" />
              <LuoHOKS path="hoks/uusi" />
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

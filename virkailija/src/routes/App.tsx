import { Router } from "@reach/router"
import { ThemeWrapper } from "components/ThemeWrapper"
import React from "react"
import { IntlProvider } from "react-intl"
import styled from "styled"
import { GlobalStyles } from "./App/globalStyles"
import { Etusivu } from "./Etusivu"

const Container = styled("div")`
  margin: 0;
`

export interface AppProps {}

export class App extends React.Component<AppProps> {
  render() {
    return (
      <ThemeWrapper>
        <IntlProvider
          defaultLocale="fi"
          locale={"fi"}
          messages={{}}
          textComponent={React.Fragment}
        >
          <Container>
            <Router>
              <Etusivu path="/" />
            </Router>
            <GlobalStyles />
          </Container>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}

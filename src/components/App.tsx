import { Router } from "@reach/router"
import "components/App/globalStyles"
import { AppFooter } from "components/AppFooter"
import { AppHeader } from "components/AppHeader"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { IntlProvider } from "react-intl"
import Loadable from "react-loadable"
import { RootStore } from "stores/RootStore"
import { Home } from "../routes/Home"

const LoadingComponent = () => <div>Loading...</div>

const Goals = Loadable({
  loader: async () => (await import("../routes/Goals")).Goals,
  loading: LoadingComponent
})

const StudyInformation = Loadable({
  loader: async () =>
    (await import("../routes/StudyInformation")).StudyInformation,
  loading: LoadingComponent
})

const Container = styled("div")`
  margin: 0;
`

export interface AppProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class App extends React.Component<AppProps> {
  componentDidMount() {
    // load user session info from backend
    this.props.store.session.checkSession()
  }

  render() {
    const { store } = this.props
    return (
      <IntlProvider
        locale={store.translations.activeLocale}
        messages={store.translations.messages[store.translations.activeLocale]}
      >
        <Container>
          <AppHeader />
          <Router>
            <Home path="/*" />
            <Goals path="goals" />
            <StudyInformation path="studies" />
          </Router>
          <AppFooter />
        </Container>
      </IntlProvider>
    )
  }
}

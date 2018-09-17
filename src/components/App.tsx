import { Router } from "@reach/router"
import "components/App/globalStyles"
import { AppFooter } from "components/AppFooter"
import { AppHeader } from "components/AppHeader"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import Loadable from "react-loadable"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"
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
  session?: Instance<typeof SessionStore>
}

@inject(injectSession)
@observer
export class App extends React.Component<AppProps> {
  componentDidMount() {
    // load user session info from backend
    this.props.session.checkSession()
  }

  render() {
    return (
      <Container>
        <AppHeader />
        <Router>
          <Home path="/*" />
          <Goals path="goals" />
          <StudyInformation path="studies" />
        </Router>
        <AppFooter />
      </Container>
    )
  }
}

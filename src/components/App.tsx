import { Router } from "@reach/router"
import { Header } from "components/Header"
import { injectGlobal } from "emotion"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import Loadable from "react-loadable"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"
import { Home } from "../routes/Home"

const LoadingComponent = () => <div>Loading...</div>

const LearningPeriods = Loadable({
  loader: async () =>
    (await import("../routes/LearningPeriods")).LearningPeriods,
  loading: LoadingComponent
})

const Goals = Loadable({
  loader: async () => (await import("../routes/Goals")).Goals,
  loading: LoadingComponent
})

const StudyInformation = Loadable({
  loader: async () =>
    (await import("../routes/StudyInformation")).StudyInformation,
  loading: LoadingComponent
})

const Profile = Loadable({
  loader: async () => (await import("../routes/Profile")).Profile,
  loading: LoadingComponent
})

injectGlobal`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body  {
    font-family: 'Source Sans Pro', sans-serif;
  }
`

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
        <Header>Polkuni osaamiseen</Header>
        <Router>
          <Home path="/" />
          <LearningPeriods path="learnings" />
          <Goals path="goals" />
          <StudyInformation path="studies" />
          <Profile path="profile" />
        </Router>
      </Container>
    )
  }
}

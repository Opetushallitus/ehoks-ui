import { Router } from "@reach/router"
import { injectGlobal } from "emotion"
import * as React from "react"
import styled from "react-emotion"
import Loadable from "react-loadable"
import { Home } from "./Home"

const LoadingComponent = () => <div>Loading...</div>

const LearningPeriods = Loadable({
  loader: async () => (await import("./LearningPeriods")).LearningPeriods,
  loading: LoadingComponent
})

const Goals = Loadable({
  loader: async () => (await import("./Goals")).Goals,
  loading: LoadingComponent
})

const StudyInformation = Loadable({
  loader: async () => (await import("./StudyInformation")).StudyInformation,
  loading: LoadingComponent
})

const Profile = Loadable({
  loader: async () => (await import("./Profile")).Profile,
  loading: LoadingComponent
})

injectGlobal`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }
`

const Container = styled("div")`
  margin: 20px;
`

export class App extends React.Component {
  render() {
    return (
      <Container>
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

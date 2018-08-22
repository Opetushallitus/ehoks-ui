import { Router } from "@reach/router"
import { injectGlobal } from "emotion"
import * as React from "react"
import styled from "react-emotion"
import Loadable from "react-loadable"
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
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #2b2b50;
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

import { Router } from "@reach/router"
import { injectGlobal } from "emotion"
import * as React from "react"
import styled from "react-emotion"
import { Goals } from "./Goals"
import { Home } from "./Home"
import { LearningPeriods } from "./LearningPeriods"
import { Profile } from "./Profile"
import { StudyInformation } from "./StudyInformation"

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

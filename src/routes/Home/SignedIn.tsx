import { Location, navigate, Router } from "@reach/router"
import { ProgressPie } from "components/ProgressPie"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { Goal } from "routes/Home/Goal"
import { Heading } from "routes/Home/Heading"
import { PreviousCompetence } from "routes/Home/PreviousCompetence"
import { RecognizingPriorLearning } from "routes/Home/RecognizingPriorLearning"
import { StudyPlan } from "routes/Home/StudyPlan"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

const ProgressContainer = styled("div")`
  background: #ecf3fc;
  padding: 20px;
  border-bottom: 1px solid #027fa9;
`

const ProgressPies = styled("div")`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`

export interface SignedInProps {
  session?: Instance<typeof SessionStore>
}

@inject(injectSession)
@observer
export class SignedIn extends React.Component<SignedInProps> {
  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.session.loginUrl
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    return (
      <Location>
        {({ location }) => {
          return (
            <React.Fragment>
              <ProgressContainer>
                <Heading>Omien opintojen suunnittelu</Heading>

                <ProgressPies>
                  <ProgressPie
                    step={"1"}
                    percentage={100}
                    selected={location.pathname === "/"}
                    onClick={this.setActiveTab("/")}
                    title="Tavoitteeni ja perustietoni"
                  />
                  <ProgressPie
                    step={"2"}
                    percentage={75}
                    selected={location.pathname === "/osaamiseni"}
                    onClick={this.setActiveTab("/osaamiseni")}
                    title="Aiempi osaamiseni"
                  />
                  <ProgressPie
                    step={"3"}
                    percentage={50}
                    selected={location.pathname === "/tunnustaminen"}
                    onClick={this.setActiveTab("/tunnustaminen")}
                    title="Osaamisen tunnus&shy;taminen"
                  />
                  <ProgressPie
                    step={"4"}
                    percentage={25}
                    selected={location.pathname === "/opiskelusuunnitelmani"}
                    onClick={this.setActiveTab("/opiskelusuunnitelmani")}
                    title="Opiskelu&shy;suunni&shy;telmani"
                  />
                </ProgressPies>
              </ProgressContainer>

              <Router>
                <Goal path="/" />
                <PreviousCompetence path="osaamiseni" />
                <RecognizingPriorLearning path="tunnustaminen" />
                <StudyPlan path="opiskelusuunnitelmani" />
              </Router>
            </React.Fragment>
          )
        }}
      </Location>
    )
  }
}

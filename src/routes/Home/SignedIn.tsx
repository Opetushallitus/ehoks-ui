import { Location, navigate, Router } from "@reach/router"
import { ProgressPie } from "components/ProgressPie"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { FormattedMessage } from "react-intl"
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
                <Heading>
                  <FormattedMessage
                    id="signedIn.title"
                    defaultMessage="Omien opintojen suunnittelu"
                  />
                </Heading>

                <ProgressPies>
                  <ProgressPie
                    step={"1"}
                    percentage={100}
                    selected={location.pathname === "/ehoks/"}
                    onClick={this.setActiveTab("/ehoks/")}
                    title={
                      <FormattedMessage
                        id="signedIn.myGoalsAndBasicInfo"
                        defaultMessage="Tavoitteeni ja perustietoni"
                      />
                    }
                  />
                  <ProgressPie
                    step={"2"}
                    percentage={100}
                    selected={location.pathname === "/ehoks/osaamiseni"}
                    onClick={this.setActiveTab("/ehoks/osaamiseni")}
                    title={
                      <FormattedMessage
                        id="signedIn.myPreviousCompetence"
                        defaultMessage="Aiempi osaamiseni"
                      />
                    }
                  />
                  <ProgressPie
                    step={"3"}
                    percentage={100}
                    selected={location.pathname === "/ehoks/tunnustaminen"}
                    onClick={this.setActiveTab("/ehoks/tunnustaminen")}
                    title={
                      <FormattedMessage
                        id="signedIn.recognizingPriorLearning"
                        defaultMessage="Osaamisen tunnus&shy;taminen"
                      />
                    }
                  />
                  <ProgressPie
                    step={"4"}
                    percentage={100}
                    selected={
                      location.pathname === "/ehoks/opiskelusuunnitelmani"
                    }
                    onClick={this.setActiveTab("/ehoks/opiskelusuunnitelmani")}
                    title={
                      <FormattedMessage
                        id="signedIn.myStudyPlan"
                        defaultMessage="Opiskelu&shy;suunni&shy;telmani"
                      />
                    }
                  />
                </ProgressPies>
              </ProgressContainer>

              <Router basepath="/ehoks">
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

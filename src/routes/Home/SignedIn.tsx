import { Location, navigate, Router } from "@reach/router"
import Flag from "components/icons/Flag"
import { SectionItem } from "components/SectionNavigation"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AiempiOsaaminen } from "routes/Home/AiempiOsaaminen"
import { Heading } from "routes/Home/Heading"
import { Opintosuunnitelma } from "routes/Home/Opintosuunnitelma"
import { Tavoitteet } from "routes/Home/Tavoitteet"
import { ISessionStore } from "stores/SessionStore"
import styled from "styled"
import { injectSession } from "utils"

const ProgressContainer = styled("div")`
  background: #ecf3fc;
  padding: 20px;
  border-bottom: 1px solid #027fa9;
`

const ProgressPies = styled("div")`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 0;
  }
`

const MainHeading = styled(Heading)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export interface SignedInProps {
  session?: ISessionStore
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
                <MainHeading>
                  <FormattedMessage
                    id="kirjautunut.title"
                    defaultMessage="Omien opintojen suunnittelu"
                  />
                </MainHeading>

                <ProgressPies>
                  <SectionItem
                    selected={location.pathname === "/ehoks"}
                    onClick={this.setActiveTab("/ehoks")}
                    title={
                      <FormattedMessage
                        id="kirjautunut.myGoalsAndBasicInfo"
                        defaultMessage="Oma tavoitteeni"
                      />
                    }
                  >
                    <Flag />
                  </SectionItem>
                  <SectionItem
                    selected={location.pathname === "/ehoks/osaamiseni"}
                    onClick={this.setActiveTab("/ehoks/osaamiseni")}
                    title={
                      <FormattedMessage
                        id="kirjautunut.myPreviousCompetence"
                        defaultMessage="Aiempi osaamiseni"
                      />
                    }
                  >
                    <MdExtension />
                  </SectionItem>
                  <SectionItem
                    selected={
                      location.pathname === "/ehoks/opiskelusuunnitelmani"
                    }
                    onClick={this.setActiveTab("/ehoks/opiskelusuunnitelmani")}
                    title={
                      <FormattedMessage
                        id="kirjautunut.myStudyPlan"
                        defaultMessage="Opiskelu&shy;suunnitelmani"
                      />
                    }
                  >
                    <MdEventNote />
                  </SectionItem>
                </ProgressPies>
              </ProgressContainer>

              <Router basepath="/ehoks">
                <Tavoitteet path="/" />
                <AiempiOsaaminen path="osaamiseni" />
                <Opintosuunnitelma path="opiskelusuunnitelmani" />
              </Router>
            </React.Fragment>
          )
        }}
      </Location>
    )
  }
}

import { Location, navigate, Router } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { SectionItem } from "components/SectionItem"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AiempiOsaaminen } from "routes/Etusivu/AiempiOsaaminen"
import { MainHeading } from "routes/Etusivu/Heading"
import { Opiskelusuunnitelma } from "routes/Etusivu/Opiskelusuunnitelma"
import { Tavoitteet } from "routes/Etusivu/Tavoitteet"
import { ISessionStore } from "stores/SessionStore"
import styled from "styled"
import { injectSession } from "utils"
import { BackgroundContainer } from "./SectionContainer"

const ProgressPies = styled("div")`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 0;
    justify-content: space-around;
  }
`

export interface OmienOpintojenSuunnitteluProps {
  session?: ISessionStore
}

@inject(injectSession)
@observer
export class OmienOpintojenSuunnittelu extends React.Component<
  OmienOpintojenSuunnitteluProps
> {
  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    return (
      <Location>
        {({ location }) => {
          return (
            <React.Fragment>
              <NavigationContainer>
                <Container>
                  <PaddedContent>
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
                            id="kirjautunut.omaTavoitteeniTitle"
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
                            id="kirjautunut.aiempiOsaamiseniTitle"
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
                        onClick={this.setActiveTab(
                          "/ehoks/opiskelusuunnitelmani"
                        )}
                        title={
                          <FormattedMessage
                            id="kirjautunut.opiskelusuunnitelmaniTitle"
                            defaultMessage="Opiskelu&shy;suunnitelmani"
                          />
                        }
                      >
                        <MdEventNote />
                      </SectionItem>
                    </ProgressPies>
                  </PaddedContent>
                </Container>
              </NavigationContainer>

              <BackgroundContainer>
                <Container>
                  <PaddedContent>
                    <Router basepath="/ehoks">
                      <Tavoitteet path="/" />
                      <AiempiOsaaminen path="osaamiseni" />
                      <Opiskelusuunnitelma path="opiskelusuunnitelmani" />
                    </Router>
                  </PaddedContent>
                </Container>
              </BackgroundContainer>
            </React.Fragment>
          )
        }}
      </Location>
    )
  }
}

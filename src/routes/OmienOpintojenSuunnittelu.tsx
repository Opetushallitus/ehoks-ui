import { Location, navigate, Router } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { MainHeading } from "components/Heading"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AiempiOsaaminen } from "routes/OmienOpintojenSuunnittelu/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "routes/OmienOpintojenSuunnittelu/Opiskelusuunnitelma"
import { Tavoitteet } from "routes/OmienOpintojenSuunnittelu/Tavoitteet"
import { IRootStore } from "stores/RootStore"

export interface OmienOpintojenSuunnitteluProps {
  store?: IRootStore
  path?: string
}

@inject("store")
@observer
export class OmienOpintojenSuunnittelu extends React.Component<
  OmienOpintojenSuunnitteluProps
> {
  componentDidMount() {
    const { store } = this.props
    reaction(
      () => store!.session.isLoggedIn,
      isLoggedIn => {
        // navigate to Opintopolku logout url after logging out
        if (!isLoggedIn) {
          window.location.href = this.props.store!.environment.opintopolkuLogoutUrl
        }
      }
    )
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
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
                        selected={location.pathname === "/ehoks/suunnittelu"}
                        onClick={this.setActiveTab("/ehoks/suunnittelu")}
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
                        selected={
                          location.pathname === "/ehoks/suunnittelu/osaamiseni"
                        }
                        onClick={this.setActiveTab(
                          "/ehoks/suunnittelu/osaamiseni"
                        )}
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
                          location.pathname ===
                          "/ehoks/suunnittelu/opiskelusuunnitelmani"
                        }
                        onClick={this.setActiveTab(
                          "/ehoks/suunnittelu/opiskelusuunnitelmani"
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
                    <Router basepath="/ehoks/suunnittelu">
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

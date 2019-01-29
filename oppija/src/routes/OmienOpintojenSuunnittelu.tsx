import { Location, navigate, Router } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { MainHeading } from "components/Heading"
import { HOKSButton } from "components/HOKSButton"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AiempiOsaaminen } from "routes/OmienOpintojenSuunnittelu/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "routes/OmienOpintojenSuunnittelu/Opiskelusuunnitelma"
import { Tavoitteet } from "routes/OmienOpintojenSuunnittelu/Tavoitteet"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const Section = styled("div")`
  display: flex;
  flex-direction: row;
  flex: 1;
`

const SectionContainer = styled("div")`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 20px;
`

const SectionItems = styled(ProgressPies)`
  flex: 2;
`

export interface OmienOpintojenSuunnitteluProps {
  store?: IRootStore
  path?: string
  id?: string
}

@inject("store")
@observer
export class OmienOpintojenSuunnittelu extends React.Component<
  OmienOpintojenSuunnitteluProps
> {
  disposeLoginReaction: IReactionDisposer

  componentDidMount() {
    const { store } = this.props
    this.disposeLoginReaction = reaction(
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

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { id } = this.props
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
                    <Section>
                      <SectionContainer />
                      <SectionItems>
                        <SectionItem
                          selected={
                            location.pathname === `/ehoks/suunnittelu/${id}`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/suunnittelu/${id}`
                          )}
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
                            location.pathname ===
                            `/ehoks/suunnittelu/${id}/osaamiseni`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/suunnittelu/${id}/osaamiseni`
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
                            `/ehoks/suunnittelu/${id}/opiskelusuunnitelmani`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/suunnittelu/${id}/opiskelusuunnitelmani`
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
                      </SectionItems>
                      <SectionContainer>
                        <HOKSButton to="/ehoks/valitse">
                          <FormattedMessage
                            id="kirjautunut.suljeHOKSLink"
                            defaultMessage="Sulje HOKS"
                          />
                        </HOKSButton>
                      </SectionContainer>
                    </Section>
                  </PaddedContent>
                </Container>
              </NavigationContainer>

              <BackgroundContainer>
                <Container>
                  <PaddedContent>
                    <Router basepath={`/ehoks/suunnittelu/${id}`}>
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

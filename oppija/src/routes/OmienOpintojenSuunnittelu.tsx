import { Location, navigate, Router } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { MainHeading } from "components/Heading"
import { HOKSButton } from "components/HOKSButton"
import { HOKSEidContext } from "components/HOKSEidContext"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { AiempiOsaaminen } from "components/Opiskelija/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "components/Opiskelija/Opiskelusuunnitelma"
import { Tavoitteet } from "components/Opiskelija/Tavoitteet"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import find from "lodash.find"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { SessionUser } from "models/SessionUser"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
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
  student: Instance<typeof SessionUser> | null
  suunnitelmat: Array<Instance<typeof HOKS>>
  path?: string
  id?: string
}

@observer
export class OmienOpintojenSuunnittelu extends React.Component<
  OmienOpintojenSuunnitteluProps
> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { id, student, suunnitelmat } = this.props
    const suunnitelma = find(suunnitelmat, s => s.eid === id)

    if (!suunnitelma) {
      return null
    }

    return (
      <HOKSEidContext.Provider value={id}>
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
                          <HOKSButton to="/ehoks/suunnittelu">
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
                        <Tavoitteet
                          path="/"
                          student={student}
                          hoks={suunnitelma}
                        />
                        <AiempiOsaaminen
                          path="osaamiseni"
                          studies={
                            suunnitelma
                              ? suunnitelma.aiemminHankitutTutkinnonOsat
                              : []
                          }
                        />
                        <Opiskelusuunnitelma
                          path="opiskelusuunnitelmani"
                          plan={suunnitelma}
                        />
                      </Router>
                    </PaddedContent>
                  </Container>
                </BackgroundContainer>
              </React.Fragment>
            )
          }}
        </Location>
      </HOKSEidContext.Provider>
    )
  }
}

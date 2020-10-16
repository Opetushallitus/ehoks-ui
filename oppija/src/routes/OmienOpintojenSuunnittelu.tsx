import { Location, navigate, RouteComponentProps, Router } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { MainHeading } from "components/Heading"
import { HOKSButton } from "components/HOKSButton"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { AiempiOsaaminen } from "components/Opiskelija/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "components/Opiskelija/StudyPlan/Opiskelusuunnitelma"
import { Tavoitteet } from "components/Opiskelija/Tavoitteet"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import find from "lodash.find"
import { observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import { ISessionUser } from "models/SessionUser"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { HMediaQuery } from "responsive"
import styled from "styled"
import { HelpPopup } from "components/HelpPopup"
import { IReactionDisposer, reaction } from "mobx"

const Section = styled("div")`
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
`

const SectionContainer = styled("div")`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
  margin-left: ${props => props.theme.spacing.l};
  margin-bottom: ${props => props.theme.spacing.l};

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin-top: ${props => props.theme.spacing.xl};
    margin-left: 0;
    justify-content: center;
  }
`

const SubHeading = styled("h2")`
  ${props => props.theme.typography.subHeading}
  margin-top: 0px;
`

const SectionItems = styled(ProgressPies)`
  flex: 2;
`

const EssentialFactorContainer = styled("div")`
  margin: 10px 20px 20px 20px;
`

const HelpButton = styled(HelpPopup)`
  margin: 0 0 0 20px;
`

export interface OmienOpintojenSuunnitteluProps extends RouteComponentProps {
  student?: ISessionUser
  suunnitelmat?: IHOKS[]
  /* From router path */
  id?: string
}

@observer
export class OmienOpintojenSuunnittelu extends React.Component<
  OmienOpintojenSuunnitteluProps
> {
  disposeReaction: IReactionDisposer

  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    this.disposeReaction = reaction(
      () => this.props.suunnitelmat && this.props.suunnitelmat.length > 0,
      async (hasSuunnitelmat: boolean) => {
        if (hasSuunnitelmat) {
          const suunnitelma = find(
            this.props.suunnitelmat,
            h => h.eid === this.props.id
          )
          if (suunnitelma) {
            await suunnitelma.fetchOsaamispisteet()
          }
        }
      },
      { fireImmediately: true }
    )
  }

  componentWillUnmount() {
    this.disposeReaction()
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { id, student, suunnitelmat } = this.props
    const suunnitelma = find(suunnitelmat, s => s.eid === id)

    if (!student || !suunnitelma) {
      return null
    }

    return (
      <Location>
        {({ location }) => (
          <React.Fragment>
            <NavigationContainer>
              <Container>
                <PaddedContent>
                  <MainHeading>
                    <FormattedMessage
                      id="kirjautunut.title"
                      defaultMessage="Osaamisen kehittämissuunnitelmani"
                    />
                  </MainHeading>
                  <SubHeading>
                    {suunnitelma.tutkinnonNimi},{" "}
                    {suunnitelma.opiskeluOikeus.oppilaitosNimi}
                  </SubHeading>
                  <Section>
                    <SectionItems>
                      <SectionItem
                        selected={
                          location.pathname === `/ehoks/suunnittelu/${id}`
                        }
                        onClick={this.setActiveTab(`/ehoks/suunnittelu/${id}`)}
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
                            defaultMessage="Osaamisen hankkiminen"
                          />
                        }
                      >
                        <MdEventNote />
                      </SectionItem>
                    </SectionItems>
                    <HMediaQuery.MinWidth breakpoint="Tablet">
                      <SectionContainer>
                        <HOKSButton to="/ehoks/suunnittelu">
                          <FormattedMessage
                            id="kirjautunut.suljeHOKSLink"
                            defaultMessage="Sulje HOKS"
                          />
                        </HOKSButton>
                      </SectionContainer>
                    </HMediaQuery.MinWidth>
                  </Section>
                </PaddedContent>
              </Container>
            </NavigationContainer>

            <BackgroundContainer>
              <Container>
                <PaddedContent>
                  <Router basepath={`/ehoks/suunnittelu/${id}`}>
                    <Tavoitteet path="/" student={student} hoks={suunnitelma} />
                    <AiempiOsaaminen
                      path="osaamiseni"
                      aiemminHankitutTutkinnonOsat={
                        suunnitelma
                          ? suunnitelma.aiemminHankitutTutkinnonOsat
                          : []
                      }
                      essentialFactor={
                        <EssentialFactorContainer>
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelusuunnitelma.aiemminHankittuOlennainenSeikkaOppijaDescription"
                            defaultMessage="Tämän tutkinnon osan osaamisen tunnistamiseen ja tunnustamiseen liittyy olennaista tietoa, jonka sisällön voit tarkistaa oppilaitoksestasi."
                          />
                          <HelpButton
                            helpContent={
                              <FormattedMessage
                                id="koulutuksenJarjestaja.opiskelusuunnitelma.aiemminHankittuOlennainenSeikkaOppijaHelpLabel"
                                defaultMessage="Olennainen seikka aputeksti oppija"
                              />
                            }
                          />
                        </EssentialFactorContainer>
                      }
                    />
                    <Opiskelusuunnitelma
                      path="opiskelusuunnitelmani"
                      plan={suunnitelma}
                    />
                  </Router>
                  <HMediaQuery.MinWidth breakpoint="Tablet" notMatch={true}>
                    <SectionContainer>
                      <HOKSButton to="/ehoks/suunnittelu">
                        <FormattedMessage
                          id="kirjautunut.suljeHOKSLink"
                          defaultMessage="Sulje HOKS"
                        />
                      </HOKSButton>
                    </SectionContainer>
                  </HMediaQuery.MinWidth>
                </PaddedContent>
              </Container>
            </BackgroundContainer>
          </React.Fragment>
        )}
      </Location>
    )
  }
}

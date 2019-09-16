import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { NavigationContainer } from "components/NavigationContainer"
import { BackgroundContainer } from "components/SectionContainer"
import { StudyInfo } from "components/StudyInfo"
import { inject, observer } from "mobx-react"
import { TutkinnonOsa } from "models/helpers/TutkinnonOsa"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const HeaderContainer = styled(NavigationContainer)`
  border: none;
`

const ContentContainer = styled("div")`
  margin: 20px 30px 0 30px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 10px 0;
  }
`

const GoalsTable = styled(InfoTable)`
  margin: 20px 10px 20px 10px;
`

export interface TyopaikanToimijaProps {
  store?: IRootStore
  path?: string
}

@inject("store")
@observer
export class TyopaikanToimija extends React.Component<TyopaikanToimijaProps> {
  static contextTypes = {
    intl: intlShape
  }
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
    this.props.store!.tyopaikanToimija.haeOppijat()
  }

  render() {
    const { oppijat } = this.props.store!.tyopaikanToimija
    const { intl } = this.context
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })
    return (
      <React.Fragment>
        <HeaderContainer>
          <Container>
            <PaddedContent>
              <Heading>
                <FormattedMessage
                  id="tyopaikanToimija.title"
                  defaultMessage="Ammatillisten opintojen henkilökohtaistaminen"
                />
              </Heading>
            </PaddedContent>
          </Container>
        </HeaderContainer>

        <BackgroundContainer>
          <Container>
            <PaddedContent>
              <Heading>
                <FormattedMessage
                  id="tyopaikanToimija.tyopaikallaOppijatTitle"
                  defaultMessage="Työpaikalla oppijat"
                />
              </Heading>

              {oppijat.map((oppija, i) => {
                return (
                  <Accordion
                    key={`oppija_${i}`}
                    id={`oppija_${i}`}
                    title={oppija.oppijanOtsikko}
                    inline={true}
                    childContainer={false}
                  >
                    {oppija.hoks.hankittavatTutkinnonOsat.map(
                      (tutkinnonOsa: TutkinnonOsa, toi: number) => {
                        return (
                          <ContentContainer key={toi}>
                            <StudyInfo
                              accentColor="#EB6F02"
                              fadedColor="#FDF1E6"
                              title={tutkinnonOsa.opintoOtsikko(
                                competencePointsTitle
                              )}
                              learningPeriods={tutkinnonOsa.harjoittelujaksot}
                              competenceRequirements={
                                tutkinnonOsa.osaamisvaatimukset
                              }
                              demonstrations={tutkinnonOsa.naytot}
                            />
                            <Accordion
                              id={`oppija_${i}_tavoitteet`}
                              title={
                                <AccordionTitle>
                                  <FormattedMessage
                                    id="tyopaikanToimija.opiskelijanTavoitteetTitle"
                                    defaultMessage="Opiskelijan tavoitteet"
                                  />
                                </AccordionTitle>
                              }
                              childContainer={false}
                              helpIcon={true}
                            >
                              <GoalsTable>
                                <tbody>
                                  <tr>
                                    <th>
                                      <FormattedMessage
                                        id="tyopaikanToimija.tutkinnonNimiTitle"
                                        defaultMessage="Tutkinnon nimi"
                                      />
                                    </th>
                                    <th>
                                      <FormattedMessage
                                        id="tyopaikanToimija.laajuusTitle"
                                        defaultMessage="Laajuus"
                                      />
                                    </th>
                                    <th />
                                  </tr>
                                  <tr>
                                    <td
                                      data-label={intl.formatMessage({
                                        id:
                                          "tyopaikanToimija.tutkinnonNimiTitle"
                                      })}
                                    >
                                      {oppija.hoks.tutkinnonNimi}
                                    </td>
                                    <td
                                      data-label={intl.formatMessage({
                                        id: "tyopaikanToimija.laajuusTitle"
                                      })}
                                    >
                                      {oppija.hoks.osaamispisteet}{" "}
                                      <FormattedMessage
                                        id="tyopaikanToimija.osaamispistetta"
                                        defaultMessage="osaamispistettä"
                                      />
                                    </td>
                                    <td />
                                  </tr>
                                  <tr>
                                    <th>
                                      <FormattedMessage
                                        id="tyopaikanToimija.suunnitelmaJatkoOpintoihinTitle"
                                        defaultMessage="Suunnitelma jatko-opintoihin siirtymisestä"
                                      />
                                    </th>
                                    <th />
                                    <th />
                                  </tr>
                                  <tr>
                                    <td
                                      data-label={intl.formatMessage({
                                        id:
                                          "tyopaikanToimija.suunnitelmaJatkoOpintoihinTitle"
                                      })}
                                    >
                                      {oppija.hoks.urasuunnitelma.nimi}
                                    </td>
                                    <td />
                                    <td />
                                  </tr>
                                </tbody>
                              </GoalsTable>
                            </Accordion>
                          </ContentContainer>
                        )
                      }
                    )}
                  </Accordion>
                )
              })}
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}

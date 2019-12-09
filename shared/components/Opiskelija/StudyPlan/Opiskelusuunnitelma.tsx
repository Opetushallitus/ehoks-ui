import { RouteComponentProps, navigate } from "@reach/router"
import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { EmptyItem } from "components/EmptyItem"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes } from "components/StatBox"
import { StudiesContainer } from "components/StudiesContainer"
import { StudyInfo } from "components/StudyInfo"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import styled from "styled"
import { theme } from "theme"
import { HelpPopup } from "components/HelpPopup"
import find from "lodash.find"
import { ShareType } from "stores/NotificationStore"
import { parseShareParams } from "utils/shareParams"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { StudyPoints } from "../../StudyPoints"
import {
  ActiveAccordions,
  OpiskelusuunnitelmaState,
  StudyPartSubAccordions,
  StudyPartType
} from "./StudyPlanHelpers"
import { PlannedStudies } from "./PlannedStudies"
const { colors } = theme

const ProgressTitle = styled("h2")`
  font-weight: 600;
  font-size: 20px;
  margin-left: 4px;
`

const EssentialFactorContainer = styled("div")`
  margin: 10px 20px 20px 20px;
`

const HelpButton = styled(HelpPopup)`
  margin: 0 0 0 20px;
`

export type OpiskelusuunnitelmaProps = {
  children?: React.ReactChildren
  plan: Instance<typeof HOKS>
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
} & RouteComponentProps

@observer
export class Opiskelusuunnitelma extends React.Component<
  OpiskelusuunnitelmaProps,
  OpiskelusuunnitelmaState
> {
  static contextTypes = {
    intl: intlShape
  }
  state: OpiskelusuunnitelmaState = {
    activeAccordions: {
      suunnitelma: false,
      suunnitelmat: {
        aikataulutetut: false,
        suunnitellut: false,
        valmiit: false
      },
      tavoitteet: false,
      tukevatOpinnot: false
    },
    share: {
      koodiUri: "",
      type: ""
    }
  }

  async componentDidMount() {
    const { location } = this.props
    const { share, type } = parseShareParams(location)
    await this.showShareDialog(share, type)
    this.setInitialExpanded(share, type)
  }

  componentDidUpdate(prevProps: OpiskelusuunnitelmaProps) {
    if (this.props.location !== prevProps.location) {
      // TODO: set proper share state when opening another dialog
      // previous dialog should close and new dialog should open
      const { share, type } = parseShareParams(this.props.location)
      this.showShareDialog(share, type)
    }
  }

  isShareActive = () => {
    const { share } = this.state
    return share.koodiUri !== "" && share.type !== ""
  }

  hasActiveShare = (type: StudyPartType) => {
    const {
      aikataulutetutOpinnot,
      suunnitellutOpinnot,
      valmiitOpinnot
    } = this.props.plan
    const { share } = this.state
    const studies = {
      aikataulutetut: aikataulutetutOpinnot,
      suunnitellut: suunnitellutOpinnot,
      valmiit: valmiitOpinnot
    }
    return !!find(studies[type], s =>
      s.hasNayttoOrHarjoittelujakso(share.koodiUri, share.type)
    )
  }

  showShareDialog = (share: string, type: ShareType | "") => {
    return new Promise(resolve => {
      this.setState(
        state => ({
          ...state,
          share: { koodiUri: share, type }
        }),
        () => {
          resolve()
        }
      )
    })
  }

  setInitialExpanded = (share: string, type: ShareType | "") => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        suunnitelma: Boolean(share && type),
        suunnitelmat: {
          aikataulutetut: this.hasActiveShare("aikataulutetut"),
          suunnitellut: this.hasActiveShare("suunnitellut"),
          valmiit: this.hasActiveShare("valmiit")
        }
      }
    }))
  }

  hideShareDialog = () => {
    if (this.props.location) {
      navigate(this.props.location.pathname)
    }
  }

  showPlanSubAccordion = (subAccordion: StudyPartSubAccordions) => () => {
    this.setState(
      state => ({
        ...state,
        activeAccordions: {
          ...state.activeAccordions,
          suunnitelma: true,
          suunnitelmat: {
            ...state.activeAccordions.suunnitelmat,
            [subAccordion]: true
          }
        }
      }),
      () => {
        window.location.hash = `suunnitelma.${subAccordion}`
      }
    )
  }

  toggleAccordion = (
    accordion: ActiveAccordions,
    subAccordion?: StudyPartSubAccordions
  ) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]: !subAccordion
          ? !state.activeAccordions[accordion]
          : this.toggleSubAccordion(
              state.activeAccordions[accordion],
              subAccordion
            )
      }
    }))
  }

  toggleSubAccordion = (
    accordionState: boolean | { [subAccordionName: string]: boolean },
    subAccordion: string
  ) => {
    // no-op if accordion with sub-accordion has been accidentally initalized as boolean
    if (typeof accordionState === "boolean") {
      return accordionState
    } else {
      return {
        ...accordionState,
        [subAccordion]: !accordionState[subAccordion]
      }
    }
  }

  render() {
    const { intl } = this.context
    const { activeAccordions, share } = this.state
    const { plan, elements: customElements = {} } = this.props
    const { suunnitellutOpinnot, aikataulutetutOpinnot, valmiitOpinnot } = plan
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })
    const isShareActive = this.isShareActive()
    const hasActiveShare = this.hasActiveShare
    const elements = {
      heading: customElements.heading || (
        <FormattedMessage
          id="opiskelusuunnitelma.title"
          defaultMessage="Opiskelusuunnitelmani"
        />
      ),
      goals: (
        <AccordionTitle>
          {customElements.goals || (
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetTitle"
              defaultMessage="Tavoitteeni ja opintojen eteneminen"
            />
          )}
        </AccordionTitle>
      ),
      essentialFactor: customElements.essentialFactor || (
        <EssentialFactorContainer>
          <FormattedMessage
            id="opiskelusuunnitelma.olennainenSeikkaDescription"
            defaultMessage="Tämän tutkinnon osan toteutukseen liittyy olennaista tietoa, jonka sisällön voit tarkistaa oppilaitoksestasi."
          />
          <HelpButton
            helpContent={
              <FormattedMessage
                id="opiskelusuunnitelma.olennainenSeikkaHelpLabel"
                defaultMessage="Tietoa olennaisesta seikasta"
              />
            }
          />
        </EssentialFactorContainer>
      )
    }

    const totalStudiesLength =
      suunnitellutOpinnot.length +
      aikataulutetutOpinnot.length +
      valmiitOpinnot.length

    return (
      <React.Fragment>
        <Heading>{elements.heading}</Heading>

        <Accordion
          id="tavoitteet"
          open={activeAccordions.tavoitteet}
          title={elements.goals}
          onToggle={this.toggleAccordion("tavoitteet")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetHelpLabel"
              defaultMessage="Tietoa tavoitteista ja opintojen etenemisestä"
            />
          }
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tutkinnonNimiTitle"
                    defaultMessage="Tutkinnon nimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.laajuusTitle"
                    defaultMessage="Laajuus"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <LabeledColumn id="opiskelusuunnitelma.tutkinnonNimiTitle">
                  {plan.tutkinnonNimi}
                </LabeledColumn>
                <StudyPoints
                  osaamispisteet={plan.osaamispisteet}
                  titleTranslationId={"opiskelusuunnitelma.laajuusTitle"}
                  pointsTranslationId={"opiskelusuunnitelma.osaamispistettaPostfix"}/>
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.osaamisalaTitle"
                    defaultMessage="Osaamisala"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tutkintonimikeTitle"
                    defaultMessage="Tutkintonimike"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <LabeledColumn id="opiskelusuunnitelma.osaamisalaTitle">
                  {plan.osaamisala}
                </LabeledColumn>
                <LabeledColumn id="opiskelusuunnitelma.tutkintonimikeTitle">
                  {plan.tutkintonimike}
                </LabeledColumn>
                <td />
              </tr>
            </tbody>
          </InfoTable>

          <ProgressTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.opintosiTitle"
              defaultMessage="Opintojen eteneminen"
            />
          </ProgressTitle>

          <StatBoxes>
            <ProgressPie
              value={totalStudiesLength != 0 ? Math.round(
                (suunnitellutOpinnot.length / totalStudiesLength) * 100) : 0
              }
              stroke={colors.planned}
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.suunniteltunaTitle"
                  defaultMessage="Suunniteltuna"
                />
              }
              onClick={this.showPlanSubAccordion("suunnitellut")}
            />
            <ProgressPie
              value={totalStudiesLength != 0 ? Math.round(
                (aikataulutetutOpinnot.length / totalStudiesLength) * 100
              ) : 0}
              stroke={colors.scheduled}
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.aikataulutettunaTitle"
                  defaultMessage="Aikataulutettuna"
                />
              }
              onClick={this.showPlanSubAccordion("aikataulutetut")}
            />
            <ProgressPie
              value={totalStudiesLength != 0 ? Math.round(
                (valmiitOpinnot.length / totalStudiesLength) * 100
              ) : 0}
              stroke={colors.ready}
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.valmiinaTitle"
                  defaultMessage="Valmiina"
                />
              }
              onClick={this.showPlanSubAccordion("valmiit")}
            />
          </StatBoxes>
        </Accordion>

        <Accordion
          id="suunnitelma"
          open={activeAccordions.suunnitelma || isShareActive}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.suunnitelmaTutkinnonosittainTitle"
                defaultMessage="Suunnitelma tutkinnonosittain"
              />
            </AccordionTitle>
          }
          onToggle={this.toggleAccordion("suunnitelma")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.suunnitelmaHelpLabel"
              defaultMessage="Tietoa tutkinnonosista"
            />
          }
          childContainer={false}
        >
          <PlannedStudies
            accordionIsOpen={activeAccordions.suunnitelmat.suunnitellut}
            competencePointsTitle={competencePointsTitle}
            hasActiveShare={hasActiveShare("suunnitellut")}
            share={share}
            suunnitellutOpinnot={suunnitellutOpinnot}
            toggleAccordion={this.toggleAccordion}
          />

          <Accordion
            id="suunnitelma.aikataulutetut"
            open={
              activeAccordions.suunnitelmat.aikataulutetut ||
              hasActiveShare("aikataulutetut")
            }
            onToggle={this.toggleAccordion("suunnitelmat", "aikataulutetut")}
            title={
              <AccordionTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.aikataulutetutOpintoniTitle"
                  defaultMessage="Aikataulutetut opintoni ({amount})"
                  values={{ amount: aikataulutetutOpinnot.length }}
                />
              </AccordionTitle>
            }
            inline={true}
            childContainer={false}
          >
            <StudiesContainer>
              {aikataulutetutOpinnot.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={`${study.id}_${i}`}>
                    <StudyInfo
                      accentColor={colors.scheduled}
                      competenceRequirements={study.osaamisvaatimukset}
                      competenceAcquiringMethods={study.osaamisenHankkimistavat}
                      demonstrations={study.naytot}
                      extraContent={
                        study.olennainenSeikka ? elements.essentialFactor : null
                      }
                      fadedColor="#FDF6E9"
                      koodiUri={study.tutkinnonOsaKoodiUri}
                      learningPeriods={study.harjoittelujaksot}
                      share={share}
                      title={study.opintoOtsikko(competencePointsTitle)}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!aikataulutetutOpinnot.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiAikataulutettujaOpintojaTitle"
                    defaultMessage="Ei aikataulutettuja opintoja"
                  />
                  .
                </div>
              )}
            </StudiesContainer>
          </Accordion>

          <Accordion
            id="suunnitelma.valmiit"
            open={
              activeAccordions.suunnitelmat.valmiit || hasActiveShare("valmiit")
            }
            onToggle={this.toggleAccordion("suunnitelmat", "valmiit")}
            title={
              <AccordionTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.valmiitOpintoniTitle"
                  defaultMessage="Valmiit opintoni ({amount})"
                  values={{ amount: valmiitOpinnot.length }}
                />
              </AccordionTitle>
            }
            inline={true}
            childContainer={false}
          >
            <StudiesContainer>
              {valmiitOpinnot.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={`${study.id}_${i}`}>
                    <StudyInfo
                      accentColor={colors.ready}
                      competenceRequirements={study.osaamisvaatimukset}
                      competenceAcquiringMethods={study.osaamisenHankkimistavat}
                      demonstrations={study.naytot}
                      extraContent={
                        study.olennainenSeikka ? elements.essentialFactor : null
                      }
                      fadedColor="#ECF6ED"
                      koodiUri={study.tutkinnonOsaKoodiUri}
                      learningPeriods={study.harjoittelujaksot}
                      share={share}
                      title={study.opintoOtsikko(competencePointsTitle)}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!valmiitOpinnot.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiValmiitaOpintojaTitle"
                    defaultMessage="Ei valmiita opintoja"
                  />
                  .
                </div>
              )}
            </StudiesContainer>
          </Accordion>
        </Accordion>

        <Accordion
          id="tukevatOpinnot"
          open={activeAccordions.tukevatOpinnot}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.opiskeluvalmiuksiaTukevatOpinnotTitle"
                defaultMessage="Opiskeluvalmiuksia tukevat opinnot"
              />
            </AccordionTitle>
          }
          onToggle={this.toggleAccordion("tukevatOpinnot")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.tukevatOpinnotHelpLabel"
              defaultMessage="Tietoa opiskeluvalmiuksia tukevista opinnoista"
            />
          }
        >
          <InfoTable>
            <tbody>
            <tr>
              <th>
                <FormattedMessage
                  id="opiskelusuunnitelma.opintoTitle"
                  defaultMessage="Opinto"
                />
              </th>
              <th>
                <FormattedMessage
                  id="opiskelusuunnitelma.kuvausTitle"
                  defaultMessage="Kuvaus"
                />
              </th>
              <th>
                <FormattedMessage
                  id="opiskelusuunnitelma.aloituspaivaTitle"
                  defaultMessage="Aloituspäivä"
                />
              </th>
              <th>
                <FormattedMessage
                  id="opiskelusuunnitelma.lopetuspaivaTitle"
                  defaultMessage="Lopetuspäivä"
                />
              </th>
            </tr>
            {plan.opiskeluvalmiuksiaTukevatOpinnot.map((study, i) => {
              return <tr key={`study_${i}`}>
                <td>{study.nimi}</td>
                <td>{study.kuvaus}</td>
                <td>
                  {study.alku
                    ? format(parseISO(study.alku), "d.M.yyyy")
                    : "-"}
                </td>
                <td>
                  {study.loppu
                    ? format(parseISO(study.loppu), "d.M.yyyy")
                    : "-"}
                </td>
              </tr>
            })}
            </tbody>
          </InfoTable>
        </Accordion>
      </React.Fragment>
    )
  }
}

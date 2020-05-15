import { RouteComponentProps, navigate } from "@reach/router"
import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes } from "components/StatBox"
import { observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import styled from "styled"
import { HelpPopup } from "components/HelpPopup"
import find from "lodash.find"
import { ShareType } from "stores/NotificationStore"
import { parseShareParams } from "utils/shareParams"
import { FormattedDate } from "components/FormattedDate"
import {
  ActiveAccordions,
  OpiskelusuunnitelmaState,
  StudyPartSubAccordions,
  StudyPartType
} from "./StudyPlanHelpers"
import { PlannedStudies } from "./PlannedStudies"
import { ScheduledStudies } from "./ScheduledStudies"
import { CompletedStudies } from "./CompletedStudies"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { TutkinnonOsaType } from "models/helpers/TutkinnonOsa"

const EssentialFactorContainer = styled("div")`
  margin: 10px 20px 20px 20px;
`

const HelpButton = styled(HelpPopup)`
  margin: 0 0 0 20px;
`

export interface OpiskelusuunnitelmaProps extends RouteComponentProps {
  children?: React.ReactChildren
  plan: IHOKS
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
}

const DegreeProgress = ({
  totalStudiesLength,
  suunnitellutOpinnot,
  aikataulutetutOpinnot,
  valmiitOpinnot,
  showSuunnitellut,
  showAikataulutetut,
  showValmiit
}: {
  totalStudiesLength: number
  suunnitellutOpinnot: IHankittavaTutkinnonOsa[]
  aikataulutetutOpinnot: IHankittavaTutkinnonOsa[]
  valmiitOpinnot: IHankittavaTutkinnonOsa[]
  showSuunnitellut: () => void
  showAikataulutetut: () => void
  showValmiit: () => void
}) => (
  <StatBoxes>
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round((suunnitellutOpinnot.length / totalStudiesLength) * 100)
          : 0
      }
      stroke="planned"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.suunniteltunaTitle"
          defaultMessage="Suunniteltuna"
        />
      }
      onClick={showSuunnitellut}
    />
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round(
              (aikataulutetutOpinnot.length / totalStudiesLength) * 100
            )
          : 0
      }
      stroke="scheduled"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.aikataulutettunaTitle"
          defaultMessage="Aikataulutettuna"
        />
      }
      onClick={showAikataulutetut}
    />
    <ProgressPie
      value={
        totalStudiesLength !== 0
          ? Math.round((valmiitOpinnot.length / totalStudiesLength) * 100)
          : 0
      }
      stroke="ready"
      title={
        <FormattedMessage
          id="opiskelusuunnitelma.valmiinaTitle"
          defaultMessage="Valmiina"
        />
      }
      onClick={showValmiit}
    />
  </StatBoxes>
)

const OpiskeluvalmiuksiaTukevatOpinnot = ({ plan }: { plan: IHOKS }) => (
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
      {plan.opiskeluvalmiuksiaTukevatOpinnot.map((study, i) => (
        <tr key={`study_${i}`}>
          <td>{study.nimi}</td>
          <td>{study.kuvaus}</td>
          <td>
            <FormattedDate date={study.alku} />
          </td>
          <td>
            <FormattedDate date={study.loppu} />
          </td>
        </tr>
      ))}
    </tbody>
  </InfoTable>
)

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
      type: undefined,
      moduleId: undefined,
      tutkinnonOsaTyyppi: undefined,
      tutkinnonOsaId: undefined
    }
  }

  async componentDidMount() {
    const { location } = this.props
    const { share } = parseShareParams(location)
    if (share.type && share.tutkinnonOsaTyyppi) {
      await this.showShareDialog(
        share.moduleId,
        share.type,
        share.tutkinnonOsaTyyppi,
        share.tutkinnonOsaId
      )
      this.setInitialExpanded(share)
    }
  }

  componentDidUpdate(prevProps: OpiskelusuunnitelmaProps) {
    if (this.props.location !== prevProps.location) {
      // TODO: set proper share state when opening another dialog
      // previous dialog should close and new dialog should open
      const { share } = parseShareParams(this.props.location)
      if (share.type && share.tutkinnonOsaTyyppi) {
        this.showShareDialog(
          share.moduleId,
          share.type,
          share.tutkinnonOsaTyyppi,
          share.tutkinnonOsaId
        )
      }
    }
  }

  isShareActive = () => {
    const { share } = this.state
    return !!share.type && !!share.moduleId
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
      s.hasNayttoOrHarjoittelujakso(share.type, share.moduleId)
    )
  }

  showShareDialog = (
    moduleId: string,
    type: ShareType,
    tutkinnonOsaTyyppi: TutkinnonOsaType,
    tutkinnonOsaId: string
  ) =>
    // Is this promise because when state.share is used component needs to have DOM generated?
    new Promise(resolve => {
      this.setState(
        state => ({
          ...state,
          share: { type, moduleId, tutkinnonOsaTyyppi, tutkinnonOsaId }
        }),
        () => {
          resolve()
        }
      )
    })

  setInitialExpanded = (share: { type?: ShareType; moduleId: string | "" }) => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        suunnitelma: Boolean(share),
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
          defaultMessage="Osaamisen hankkiminen"
        />
      ),
      goals: (
        <AccordionTitle>
          {customElements.goals || (
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetTitle"
              defaultMessage="Opintojen eteneminen"
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
          <DegreeProgress
            totalStudiesLength={totalStudiesLength}
            suunnitellutOpinnot={suunnitellutOpinnot}
            aikataulutetutOpinnot={aikataulutetutOpinnot}
            valmiitOpinnot={valmiitOpinnot}
            showSuunnitellut={this.showPlanSubAccordion("suunnitellut")}
            showAikataulutetut={this.showPlanSubAccordion("aikataulutetut")}
            showValmiit={this.showPlanSubAccordion("valmiit")}
          />
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
            elements={elements}
            toggleAccordion={this.toggleAccordion}
          />
          <ScheduledStudies
            accordionIsOpen={activeAccordions.suunnitelmat.aikataulutetut}
            share={share}
            hasActiveShare={hasActiveShare("aikataulutetut")}
            toggleAccordion={this.toggleAccordion}
            aikataulutetutOpinnot={aikataulutetutOpinnot}
            elements={elements}
            competencePointsTitle={competencePointsTitle}
          />
          <CompletedStudies
            accordionIsOpen={activeAccordions.suunnitelmat.valmiit}
            share={share}
            hasActiveShare={hasActiveShare("valmiit")}
            toggleAccordion={this.toggleAccordion}
            valmiitOpinnot={valmiitOpinnot}
            elements={elements}
            competencePointsTitle={competencePointsTitle}
          />
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
          <OpiskeluvalmiuksiaTukevatOpinnot plan={plan} />
        </Accordion>
      </React.Fragment>
    )
  }
}

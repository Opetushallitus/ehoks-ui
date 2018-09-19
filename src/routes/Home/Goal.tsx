import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

export interface GoalProps {
  children?: React.ReactChildren
  session?: Instance<typeof SessionStore>
}

export interface GoalState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

@inject(injectSession)
@observer
export class Goal extends React.Component<
  GoalProps & RouteComponentProps,
  GoalState
> {
  state = {
    activeAccordions: {
      currentEducation: false,
      custodianDetails: false,
      degreeOrEducation: false,
      personalDetails: false,
      personalGoal: false
    }
  }

  toggleAccordion = (accordion: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]: !state.activeAccordions[accordion]
      }
    }))
  }

  render() {
    return (
      <SectionContainer>
        <Heading>
          <FormattedMessage
            id="goal.title"
            defaultMessage="Tavoitteeni ja perustietoni"
          />
        </Heading>

        <Accordion
          open={this.state.activeAccordions.personalGoal}
          title={
            <FormattedMessage
              id="goal.personalGoal"
              defaultMessage="Oma tavoitteeni"
            />
          }
          onToggle={this.toggleAccordion("personalGoal")}
          helpIcon={true}
        >
          oma tavoite
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.degreeOrEducation}
          title={
            <FormattedMessage
              id="goal.degreeOrEducation"
              defaultMessage="Tutkinto tai koulutus"
            />
          }
          onToggle={this.toggleAccordion("degreeOrEducation")}
        >
          tutkinto tai koulutus
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.personalDetails}
          title={
            <FormattedMessage
              id="goal.personalDetails"
              defaultMessage="Omat henkilötiedot"
            />
          }
          onToggle={this.toggleAccordion("personalDetails")}
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>Etunimi Sukunimi</th>
                <th>Kutsumanimi</th>
                <th>Oppijanumero</th>
              </tr>
              <tr>
                <td data-label="Etunimi Sukunimi">Maija Meikäläinen</td>
                <td data-label="Kutsumanimi">Maija</td>
                <td data-label="Oppijanumero">1234344</td>
              </tr>
              <tr>
                <th>Osoite</th>
                <th>Postiosoite</th>
                <th>Kotikunta</th>
              </tr>
              <tr>
                <td data-label="Osoite">Mäntsälänviertotie 478 B</td>
                <td data-label="Postiosoite">123123 Mäntsälä</td>
                <td data-label="Kotikunta">Mäntsälä</td>
              </tr>
              <tr>
                <th>Sähköposti</th>
                <th />
                <th>Puhelinnumero</th>
              </tr>
              <tr>
                <td data-label="Sähköposti">
                  maija.meikalainen@kotipostilokero.fi
                </td>
                <td />
                <td data-label="Puhelinnumero">+35850505050505</td>
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.custodianDetails}
          title={
            <FormattedMessage
              id="goal.custodianDetails"
              defaultMessage="Huoltajatiedot"
            />
          }
          onToggle={this.toggleAccordion("custodianDetails")}
        >
          huoltajan tiedot
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.currentEducation}
          title={
            <FormattedMessage
              id="goal.currentEducation"
              defaultMessage="Nykyinen koulutus"
            />
          }
          onToggle={this.toggleAccordion("currentEducation")}
        >
          nykyinen koulutus
        </Accordion>
      </SectionContainer>
    )
  }
}

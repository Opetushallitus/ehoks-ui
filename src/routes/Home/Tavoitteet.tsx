import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"
import { ISessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

export interface TavoitteetProps {
  children?: React.ReactChildren
  session?: ISessionStore
}

export interface TavoitteetState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

@inject(injectSession)
@observer
export class Tavoitteet extends React.Component<
  TavoitteetProps & RouteComponentProps,
  TavoitteetState
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
    const { user } = this.props.session
    return (
      <SectionContainer>
        <Heading>
          <FormattedMessage
            id="tavoitteet.title"
            defaultMessage="Tavoitteeni ja perustietoni"
          />
        </Heading>

        <Accordion
          open={this.state.activeAccordions.personalGoal}
          title={
            <FormattedMessage
              id="tavoitteet.personalGoal"
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
              id="tavoitteet.degreeOrEducation"
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
              id="tavoitteet.personalDetails"
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
                <td data-label="Etunimi Sukunimi">
                  {user.firstName} {user.surname}
                </td>
                <td data-label="Kutsumanimi">{user.commonName}</td>
                <td data-label="Oppijanumero">{user.oid}</td>
              </tr>
              <tr>
                <th>Osoite</th>
                <th>Postiosoite</th>
                <th>Kotikunta</th>
              </tr>
              <tr>
                <td data-label="Osoite">{user.yhteystiedot.katuosoite}</td>
                <td data-label="Postiosoite">
                  {user.yhteystiedot.postinumero} {user.yhteystiedot.kunta}
                </td>
                <td data-label="Kotikunta">{user.yhteystiedot.kunta}</td>
              </tr>
              <tr>
                <th>Sähköposti</th>
                <th />
                <th>Puhelinnumero</th>
              </tr>
              <tr>
                <td data-label="Sähköposti">{user.yhteystiedot.sahkoposti}</td>
                <td />
                <td data-label="Puhelinnumero">
                  {user.yhteystiedot.puhelinnumero}
                </td>
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.custodianDetails}
          title={
            <FormattedMessage
              id="tavoitteet.custodianDetails"
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
              id="tavoitteet.currentEducation"
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

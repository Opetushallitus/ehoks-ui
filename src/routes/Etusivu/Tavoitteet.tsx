import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Etusivu/Heading"
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
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activeAccordions: {
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
    const { user } = this.props.session!
    if (!user) {
      return null
    }
    const { intl } = this.context

    return (
      <React.Fragment>
        <Heading>
          <FormattedMessage
            id="tavoitteet.title"
            defaultMessage="Tavoitteeni ja perustietoni"
          />
        </Heading>

        <Accordion
          id="omaTavoitteeni"
          open={this.state.activeAccordions.personalGoal}
          title={
            <FormattedMessage
              id="tavoitteet.omaTavoitteeniTitle"
              defaultMessage="Oma tavoitteeni"
            />
          }
          onToggle={this.toggleAccordion("personalGoal")}
          helpIcon={true}
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.suunnitelmaJatkoOpintoihinTitle"
                    defaultMessage="Suunnitelma jatko-opintoihin siirtymisestä"
                  />
                </th>
                <th />
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.suunnitelmaJatkoOpintoihinTitle"
                  })}
                >
                  Tähän tekstiä
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.osoiteTitle"
                    defaultMessage="Osoite"
                  />
                </th>
                <th />
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.osoiteTitle"
                  })}
                >
                  {user.yhteystiedot.katuosoite}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.sahkopostiTitle"
                    defaultMessage="Sähköposti"
                  />
                </th>
                <th />
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.sahkopostiTitle"
                  })}
                >
                  {user.yhteystiedot.sahkoposti}
                </td>
                <td />
                <td />
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>

        <Accordion
          id="tutkintoTaiKoulutus"
          open={this.state.activeAccordions.degreeOrEducation}
          title={
            <FormattedMessage
              id="tavoitteet.tutkintoTaiKoulutusTitle"
              defaultMessage="Tutkinto tai koulutus"
            />
          }
          onToggle={this.toggleAccordion("degreeOrEducation")}
          helpIcon={true}
        >
          tutkinto tai koulutus
        </Accordion>

        <Accordion
          id="henkilotiedot"
          open={this.state.activeAccordions.personalDetails}
          title={
            <FormattedMessage
              id="tavoitteet.henkilotiedotTitle"
              defaultMessage="Omat henkilötiedot"
            />
          }
          onToggle={this.toggleAccordion("personalDetails")}
          helpIcon={true}
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.etunimiSukunimiTitle"
                    defaultMessage="Etunimi Sukunimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="tavoitteet.kutsumanimiTitle"
                    defaultMessage="Kutsumanimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="tavoitteet.oppijanumeroTitle"
                    defaultMessage="Oppijanumero"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.etunimiSukunimiTitle"
                  })}
                >
                  {user.firstName} {user.surname}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.kutsumanimiTitle"
                  })}
                >
                  {user.commonName}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.oppijanumeroTitle"
                  })}
                >
                  {user.oid}
                </td>
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.osoiteTitle"
                    defaultMessage="Osoite"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="tavoitteet.postiosoiteTitle"
                    defaultMessage="Postiosoite"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="tavoitteet.kotikuntaTitle"
                    defaultMessage="Kotikunta"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.osoiteTitle"
                  })}
                >
                  {user.yhteystiedot.katuosoite}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.postiosoiteTitle"
                  })}
                >
                  {user.yhteystiedot.postinumero} {user.yhteystiedot.kunta}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.kotikuntaTitle"
                  })}
                >
                  {user.yhteystiedot.kunta}
                </td>
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="tavoitteet.sahkopostiTitle"
                    defaultMessage="Sähköposti"
                  />
                </th>
                <th />
                <th>
                  <FormattedMessage
                    id="tavoitteet.puhelinnumeroTitle"
                    defaultMessage="Puhelinnumero"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.sahkopostiTitle"
                  })}
                >
                  {user.yhteystiedot.sahkoposti}
                </td>
                <td />
                <td
                  data-label={intl.formatMessage({
                    id: "tavoitteet.puhelinnumeroTitle"
                  })}
                >
                  {user.yhteystiedot.puhelinnumero}
                </td>
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>
      </React.Fragment>
    )
  }
}

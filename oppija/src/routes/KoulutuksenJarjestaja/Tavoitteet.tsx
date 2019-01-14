import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { ISessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

interface MockUser {
  firstName: string
  surname: string
  commonName: string
  oid: string
  yhteystiedot: {
    sahkoposti: string
    katuosoite: string
    postinumero: string
    kunta: string
    puhelinnumero: string
  }
}

export interface TavoitteetProps {
  children?: React.ReactChildren
  session?: ISessionStore
  student: MockUser
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
      studentGoals: false
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
    const { intl } = this.context
    const { student } = this.props
    return (
      <React.Fragment>
        <Heading>
          <FormattedMessage
            id="koulutuksenJarjestaja.tavoite.title"
            defaultMessage="Opiskelijan tavoite ja perustiedot"
          />
        </Heading>

        <Accordion
          id="omaTavoitteeni"
          open={this.state.activeAccordions.studentGoals}
          title={
            <FormattedMessage
              id="koulutuksenJarjestaja.tavoite.opiskelijanTavoitteetTitle"
              defaultMessage="Opiskelijan tavoitteet"
            />
          }
          onToggle={this.toggleAccordion("studentGoals")}
          helpIcon={true}
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.suunnitelmaJatkoOpintoihinTitle"
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
                      "koulutuksenJarjestaja.tavoite.suunnitelmaJatkoOpintoihinTitle"
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
                    id="koulutuksenJarjestaja.tavoite.osoiteTitle"
                    defaultMessage="Osoite"
                  />
                </th>
                <th />
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.osoiteTitle"
                  })}
                >
                  {student.yhteystiedot.katuosoite}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.sahkopostiTitle"
                    defaultMessage="Sähköposti"
                  />
                </th>
                <th />
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.sahkopostiTitle"
                  })}
                >
                  {student.yhteystiedot.sahkoposti}
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
              id="koulutuksenJarjestaja.tavoite.tutkintoTaiKoulutusTitle"
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
              id="koulutuksenJarjestaja.tavoite.henkilotiedotTitle"
              defaultMessage="Henkilötiedot"
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
                    id="koulutuksenJarjestaja.tavoite.etunimiSukunimiTitle"
                    defaultMessage="Etunimi Sukunimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.kutsumanimiTitle"
                    defaultMessage="Kutsumanimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.oppijanumeroTitle"
                    defaultMessage="Oppijanumero"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.etunimiSukunimiTitle"
                  })}
                >
                  {student.firstName} {student.surname}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.kutsumanimiTitle"
                  })}
                >
                  {student.commonName}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.oppijanumeroTitle"
                  })}
                >
                  {student.oid}
                </td>
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.osoiteTitle"
                    defaultMessage="Osoite"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.postiosoiteTitle"
                    defaultMessage="Postiosoite"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.kotikuntaTitle"
                    defaultMessage="Kotikunta"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.osoiteTitle"
                  })}
                >
                  {student.yhteystiedot.katuosoite}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.postiosoiteTitle"
                  })}
                >
                  {student.yhteystiedot.postinumero}{" "}
                  {student.yhteystiedot.kunta}
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.kotikuntaTitle"
                  })}
                >
                  {student.yhteystiedot.kunta}
                </td>
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.sahkopostiTitle"
                    defaultMessage="Sähköposti"
                  />
                </th>
                <th />
                <th>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.tavoite.puhelinnumeroTitle"
                    defaultMessage="Puhelinnumero"
                  />
                </th>
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.sahkopostiTitle"
                  })}
                >
                  {student.yhteystiedot.sahkoposti}
                </td>
                <td />
                <td
                  data-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.tavoite.puhelinnumeroTitle"
                  })}
                >
                  {student.yhteystiedot.puhelinnumero}
                </td>
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>
      </React.Fragment>
    )
  }
}

import { RouteComponentProps } from "@reach/router"
import { Accordion, AccordionTitle } from "components/Accordion"
import { HeadingContainer, HelpHeading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import React from "react"
import { FormattedMessage } from "react-intl"

export interface TavoitteetProps {
  children?: React.ReactChildren
  student: Instance<typeof SessionUser> | null
  titles?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    degreeOrEducation?: React.ReactNode
    personalDetails?: React.ReactNode
  }
}

export interface TavoitteetState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

@observer
export class Tavoitteet extends React.Component<
  TavoitteetProps & RouteComponentProps,
  TavoitteetState
> {
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
    const { student, titles: customTitles = {} } = this.props
    if (!student) {
      return null
    }

    const titles = {
      heading: customTitles.heading || (
        <FormattedMessage
          id="tavoitteet.title"
          defaultMessage="Tavoitteeni ja perustietoni"
        />
      ),
      goals: (
        <AccordionTitle>
          {customTitles.goals || (
            <FormattedMessage
              id="tavoitteet.omaTavoitteeniTitle"
              defaultMessage="Oma tavoitteeni"
            />
          )}
        </AccordionTitle>
      ),
      degreeOrEducation: (
        <AccordionTitle>
          {customTitles.degreeOrEducation || (
            <FormattedMessage
              id="tavoitteet.tutkintoTaiKoulutusTitle"
              defaultMessage="Tutkinto tai koulutus"
            />
          )}
        </AccordionTitle>
      ),
      personalDetails: (
        <AccordionTitle>
          {customTitles.personalDetails || (
            <FormattedMessage
              id="tavoitteet.henkilotiedotTitle"
              defaultMessage="Omat henkilötiedot"
            />
          )}
        </AccordionTitle>
      )
    }

    return (
      <React.Fragment>
        <HeadingContainer>
          <HelpHeading>{titles.heading}</HelpHeading>
          <HelpPopup helpContent={"Test"} />
        </HeadingContainer>

        <Accordion
          id="omaTavoitteeni"
          open={this.state.activeAccordions.personalGoal}
          title={titles.goals}
          onToggle={this.toggleAccordion("personalGoal")}
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
                <LabeledColumn id="tavoitteet.suunnitelmaJatkoOpintoihinTitle">
                  Työelämään siirtyminen
                </LabeledColumn>
                <td />
                <td />
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>

        <Accordion
          id="tutkintoTaiKoulutus"
          open={this.state.activeAccordions.degreeOrEducation}
          title={titles.degreeOrEducation}
          onToggle={this.toggleAccordion("degreeOrEducation")}
        >
          tutkinto tai koulutus
        </Accordion>

        <Accordion
          id="henkilotiedot"
          open={this.state.activeAccordions.personalDetails}
          title={titles.personalDetails}
          onToggle={this.toggleAccordion("personalDetails")}
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
                <LabeledColumn id="tavoitteet.etunimiSukunimiTitle">
                  {student.firstName} {student.surname}
                </LabeledColumn>
                <LabeledColumn id="tavoitteet.kutsumanimiTitle">
                  {student.commonName}
                </LabeledColumn>
                <LabeledColumn id="tavoitteet.oppijanumeroTitle">
                  {student.oid}
                </LabeledColumn>
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
                <LabeledColumn id="tavoitteet.osoiteTitle">
                  {student.yhteystiedot.katuosoite}
                </LabeledColumn>
                <LabeledColumn id="tavoitteet.postiosoiteTitle">
                  {student.yhteystiedot.postinumero}{" "}
                  {student.yhteystiedot.kunta}
                </LabeledColumn>
                <LabeledColumn id="tavoitteet.kotikuntaTitle">
                  {student.yhteystiedot.kunta}
                </LabeledColumn>
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
                <LabeledColumn id="tavoitteet.sahkopostiTitle">
                  {student.yhteystiedot.sahkoposti}
                </LabeledColumn>
                <td />
                <LabeledColumn id="tavoitteet.puhelinnumeroTitle">
                  {student.yhteystiedot.puhelinnumero}
                </LabeledColumn>
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>
      </React.Fragment>
    )
  }
}

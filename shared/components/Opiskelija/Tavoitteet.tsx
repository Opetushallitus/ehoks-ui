import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { HeadingContainer, HelpHeading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import React from "react"
import { FormattedMessage } from "react-intl"
import { HOKS } from "models/HOKS"
import { AppContext } from "components/AppContext"
import { FormattedDate } from "components/FormattedDate"

interface OsaamisenHankkimisenTarveProps {
  osaamisenHankkimisenTarve: boolean | null
}

const OsaamisenHankkimisenTarveMessage = ({
  osaamisenHankkimisenTarve
}: OsaamisenHankkimisenTarveProps) => {
  if (osaamisenHankkimisenTarve == null)
    return (
      <FormattedMessage
        id="tavoitteet.osaamisenHankkimisenTarveNullTitle"
        defaultMessage="Opiskelijan osaamisen hankkimisen tarve ei tiedossa"
      />
    )

  return osaamisenHankkimisenTarve ? (
    <FormattedMessage
      id="tavoitteet.osaamisenHankkimisenTarveTrueTitle"
      defaultMessage="Opiskelijalla on osaamisen hankkimisen tarve"
    />
  ) : (
    <FormattedMessage
      id="tavoitteet.osaamisenHankkimisenTarveFalseTitle"
      defaultMessage="Opiskelijalla ei ole osaamisen hankkimisen tarvetta"
    />
  )
}

export interface TavoitteetProps {
  children?: React.ReactChildren
  student: Instance<typeof SessionUser> | null
  hoks: Instance<typeof HOKS>
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
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>
  state = {
    activeAccordions: {
      hoksDates: false,
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
    const { student, hoks, titles: customTitles = {} } = this.props
    const { app } = this.context
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
          <HelpPopup
            helpContent={
              <FormattedMessage
                id="tavoitteet.titleHelpLabel"
                defaultMessage="Tietoa tavoitteista ja perustiedoista"
              />
            }
          />
        </HeadingContainer>

        {app === "oppija" && (
          <Accordion
            id="hoksDates"
            open={this.state.activeAccordions.hoksDates}
            title={
              <AccordionTitle>
                <FormattedMessage
                  id="tavoitteet.hoksPaivamaaratTitle"
                  defaultMessage="HOKS päivämäärät"
                />
              </AccordionTitle>
            }
            onToggle={this.toggleAccordion("hoksDates")}
          >
            <InfoTable>
              <tbody>
                <tr>
                  <th>
                    <FormattedMessage
                      id="tavoitteet.ensikertainenHyvaksyminenTitle"
                      defaultMessage="Ensikertainen hyväksyminen"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="tavoitteet.paivitettyTitle"
                      defaultMessage="Päivitetty"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="tavoitteet.osaamisenHankkimisenTarveTitle"
                      defaultMessage="Osaamisen hankkimisen tarve"
                    />
                  </th>
                </tr>
                <tr>
                  <LabeledColumn id="tavoitteet.ensikertainenHyvaksyminenTitle">
                    <FormattedDate
                      date={hoks.ensikertainenHyvaksyminen}
                      dateNotSet={
                        <FormattedMessage
                          id="tavoitteet.eiVielaHyvaksyttyTitle"
                          defaultMessage="Ei vielä hyväksytty"
                        />
                      }
                    />
                  </LabeledColumn>
                  <LabeledColumn id="tavoitteet.paivitettyTitle">
                    <FormattedDate
                      date={hoks.paivitetty}
                      dateNotSet={
                        <FormattedMessage
                          id="tavoitteet.eiVielaPaivityksiaTitle"
                          defaultMessage="Ei vielä päivityksiä"
                        />
                      }
                    />
                  </LabeledColumn>
                  <LabeledColumn id="tavoitteet.osaamisenHankkimisenTarveTitle">
                    <OsaamisenHankkimisenTarveMessage
                      osaamisenHankkimisenTarve={hoks.osaamisenHankkimisenTarve}
                    />
                  </LabeledColumn>
                </tr>
              </tbody>
            </InfoTable>
          </Accordion>
        )}

        <Accordion
          id="omaTavoitteeni"
          open={this.state.activeAccordions.personalGoal}
          title={titles.goals}
          onToggle={this.toggleAccordion("personalGoal")}
        >
          {hoks.urasuunnitelma && hoks.urasuunnitelma.nimi && (
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
                    {hoks.urasuunnitelma && hoks.urasuunnitelma.nimi}
                  </LabeledColumn>
                  <td />
                  <td />
                </tr>
              </tbody>
            </InfoTable>
          )}
        </Accordion>

        <Accordion
          id="tutkintoTaiKoulutus"
          open={this.state.activeAccordions.degreeOrEducation}
          title={titles.degreeOrEducation}
          onToggle={this.toggleAccordion("degreeOrEducation")}
        >
          {hoks.tutkinnonNimi}
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
                  {student.commonName && (
                    <FormattedMessage
                      id="tavoitteet.kutsumanimiTitle"
                      defaultMessage="Kutsumanimi"
                    />
                  )}
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
                  {student.firstName && student.surname
                    ? `${student.firstName} ${student.surname}`
                    : student.fullName}
                </LabeledColumn>

                <LabeledColumn id="tavoitteet.kutsumanimiTitle">
                  {student.commonName}
                </LabeledColumn>

                <LabeledColumn id="tavoitteet.oppijanumeroTitle">
                  {student.oid}
                </LabeledColumn>
              </tr>
              <tr>
                {student.yhteystiedot.katuosoite && (
                  <th>
                    <FormattedMessage
                      id="tavoitteet.osoiteTitle"
                      defaultMessage="Osoite"
                    />
                  </th>
                )}
                {(student.yhteystiedot.postinumero ||
                  student.yhteystiedot.kunta) && (
                  <th>
                    <FormattedMessage
                      id="tavoitteet.postiosoiteTitle"
                      defaultMessage="Postiosoite"
                    />
                  </th>
                )}
                {student.yhteystiedot.kunta && (
                  <th>
                    <FormattedMessage
                      id="tavoitteet.kotikuntaTitle"
                      defaultMessage="Kotikunta"
                    />
                  </th>
                )}
              </tr>
              <tr>
                {student.yhteystiedot.katuosoite && (
                  <LabeledColumn id="tavoitteet.osoiteTitle">
                    {student.yhteystiedot.katuosoite}
                  </LabeledColumn>
                )}
                {(student.yhteystiedot.postinumero ||
                  student.yhteystiedot.kunta) && (
                  <LabeledColumn id="tavoitteet.postiosoiteTitle">
                    {student.yhteystiedot.postinumero}{" "}
                    {student.yhteystiedot.kunta}
                  </LabeledColumn>
                )}
                {student.yhteystiedot.kunta && (
                  <LabeledColumn id="tavoitteet.kotikuntaTitle">
                    {student.yhteystiedot.kunta}
                  </LabeledColumn>
                )}
              </tr>
              <tr>
                {(student.yhteystiedot.sahkoposti || hoks.sahkoposti) && (
                  <th>
                    <FormattedMessage
                      id="tavoitteet.sahkopostiTitle"
                      defaultMessage="Sähköposti"
                    />
                  </th>
                )}
                <th />
                {student.yhteystiedot.puhelinnumero && (
                  <th>
                    <FormattedMessage
                      id="tavoitteet.puhelinnumeroTitle"
                      defaultMessage="Puhelinnumero"
                    />
                  </th>
                )}
              </tr>
              <tr>
                {(student.yhteystiedot.sahkoposti || hoks.sahkoposti) && (
                  <LabeledColumn id="tavoitteet.sahkopostiTitle">
                    {student.yhteystiedot.sahkoposti
                      ? student.yhteystiedot.sahkoposti
                      : hoks.sahkoposti}
                  </LabeledColumn>
                )}
                <td />
                {student.yhteystiedot.puhelinnumero && (
                  <LabeledColumn id="tavoitteet.puhelinnumeroTitle">
                    {student.yhteystiedot.puhelinnumero}
                  </LabeledColumn>
                )}
              </tr>
            </tbody>
          </InfoTable>
        </Accordion>
      </React.Fragment>
    )
  }
}

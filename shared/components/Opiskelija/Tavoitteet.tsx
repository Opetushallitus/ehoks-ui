import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { AppContext } from "components/AppContext"
import { FormattedDate } from "components/FormattedDate"
import { HeadingContainer, HelpHeading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { inject, observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import { ISessionUser } from "models/SessionUser"
import React, { useState, useContext } from "react"
import { FormattedMessage } from "react-intl"
import { Opiskelijapalaute } from "../../../virkailija/src/routes/KoulutuksenJarjestaja/Opiskelijapalaute"
import { IKoodistoVastaus } from "../../models/KoodistoVastaus"
import { StudyPoints } from "../StudyPoints"
import { IRootStore } from "../../../virkailija/src/stores/RootStore"
import { HoksPoisto } from "./HoksPoisto"

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

const StudentPersonalInfo = ({ student }: { student: ISessionUser }) => (
  <>
    <tr>
      <th>
        <FormattedMessage
          id="tavoitteet.etunimiSukunimiTitle"
          defaultMessage="Etunimi Sukunimi"
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
        {student.firstName && student.surname
          ? `${student.firstName} ${student.surname}`
          : student.fullName}
      </LabeledColumn>

      <LabeledColumn id="tavoitteet.oppijanumeroTitle">
        {student.oid}
      </LabeledColumn>
    </tr>
  </>
)

const StudentAddressInfo = ({ student }: { student: ISessionUser }) => (
  <>
    <tr>
      {student.yhteystiedot.katuosoite && (
        <th>
          <FormattedMessage
            id="tavoitteet.osoiteTitle"
            defaultMessage="Osoite"
          />
        </th>
      )}
      {(student.yhteystiedot.postinumero || student.yhteystiedot.kunta) && (
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
      {(student.yhteystiedot.postinumero || student.yhteystiedot.kunta) && (
        <LabeledColumn id="tavoitteet.postiosoiteTitle">
          {student.yhteystiedot.postinumero} {student.yhteystiedot.kunta}
        </LabeledColumn>
      )}
      {student.yhteystiedot.kunta && (
        <LabeledColumn id="tavoitteet.kotikuntaTitle">
          {student.yhteystiedot.kunta}
        </LabeledColumn>
      )}
    </tr>
  </>
)

const StudentContactInfo = ({
  student,
  hoks
}: {
  student: ISessionUser
  hoks: IHOKS
}) => (
  <>
    <tr>
      {!!hoks.sahkoposti && (
        <th>
          <FormattedMessage
            id="tavoitteet.sahkopostiTitle"
            defaultMessage="Sähköposti"
          />
        </th>
      )}
      {(!!hoks.puhelinnumero || student.yhteystiedot.puhelinnumero) && (
        <th>
          <FormattedMessage
            id="tavoitteet.puhelinnumeroTitle"
            defaultMessage="Puhelinnumero"
          />
        </th>
      )}
    </tr>
    <tr>
      {!!hoks.sahkoposti && (
        <LabeledColumn id="tavoitteet.sahkopostiTitle">
          {hoks.sahkoposti}
        </LabeledColumn>
      )}
      {(!!hoks.puhelinnumero || student.yhteystiedot.puhelinnumero) && (
        <LabeledColumn id="tavoitteet.puhelinnumeroTitle">
          {hoks.puhelinnumero || student.yhteystiedot.puhelinnumero}
        </LabeledColumn>
      )}
    </tr>
  </>
)

const StudentIdentifierInfo = ({ hoks }: { hoks: IHOKS }) => (
  <>
    <tr>
      {hoks.opiskeluoikeusOid && (
        <th>
          <FormattedMessage
            id="tavoitteet.opiskeluoikeudOidTitle"
            defaultMessage="Opiskeluoikeuden OID"
          />
        </th>
      )}
      {hoks.id && (
        <th>
          <FormattedMessage id="tavoitteet.idTitle" defaultMessage="eHOKS ID" />
        </th>
      )}
    </tr>
    <tr>
      {hoks.opiskeluoikeusOid && (
        <LabeledColumn id="tavoitteet.opiskeluoikeudOidTitle">
          {hoks.opiskeluoikeusOid}
        </LabeledColumn>
      )}
      {hoks.id && (
        <LabeledColumn id="tavoitteet.idTitle">{hoks.id}</LabeledColumn>
      )}
    </tr>
    {hoks.tuvaOpiskeluoikeusOid && (
      <>
        <tr>
          <th>
            <FormattedMessage
              id="tavoitteet.tuvaOpiskeluoikeusOidTitle"
              defaultMessage="TUVA-opiskeluoikeuden OID"
            />
          </th>
        </tr>
        <tr>
          <LabeledColumn id="tavoitteet.tuvaOpiskeluoikeusOidTitle">
            {hoks.tuvaOpiskeluoikeusOid}
          </LabeledColumn>
        </tr>
      </>
    )}
  </>
)

const Urasuunnitelma = ({
  title,
  urasuunnitelmaOpen,
  toggleUrasuunnitelma,
  urasuunnitelma
}: {
  title: React.ReactNode
  urasuunnitelmaOpen: boolean
  toggleUrasuunnitelma: () => void
  urasuunnitelma?: IKoodistoVastaus
}) => (
  <Accordion
    id="omaTavoitteeni"
    open={urasuunnitelmaOpen}
    title={title}
    onToggle={toggleUrasuunnitelma}
  >
    {urasuunnitelma && urasuunnitelma.nimi ? (
      <span>{urasuunnitelma.nimi}</span>
    ) : (
      <FormattedMessage
        id="tavoitteet.urasuunnitelmaTietoaEiOleTallennettu"
        defaultMessage="Tietoa ei ole tallennettu."
      />
    )}
  </Accordion>
)
const TutkintoTaiKoulutus = ({
  title,
  tutkintoTaiKoulutusOpen,
  toggleTutkintoTaiKoulutus,
  plan
}: {
  title: React.ReactNode
  tutkintoTaiKoulutusOpen: boolean
  toggleTutkintoTaiKoulutus: () => void
  plan: IHOKS
}) => (
  <Accordion
    id="tutkintoTaiKoulutus"
    open={tutkintoTaiKoulutusOpen}
    title={title}
    onToggle={toggleTutkintoTaiKoulutus}
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
            pointsTranslationId={"opiskelusuunnitelma.osaamispistettaPostfix"}
          />
          <td />
        </tr>
        {!plan.isTuvaHoks && (
          <>
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
          </>
        )}
      </tbody>
    </InfoTable>
  </Accordion>
)

const Henkilotiedot = ({
  title,
  henkilotiedotOpen,
  toggleHenkilotiedot,
  hoks,
  student,
  app
}: {
  title: React.ReactNode
  henkilotiedotOpen: boolean
  toggleHenkilotiedot: () => void
  hoks: IHOKS
  student: ISessionUser
  app: string
}) => (
  <Accordion
    id="henkilotiedot"
    open={henkilotiedotOpen}
    title={title}
    onToggle={toggleHenkilotiedot}
  >
    <InfoTable>
      <tbody>
        <StudentPersonalInfo student={student} />
        <StudentAddressInfo student={student} />
        <StudentContactInfo student={student} hoks={hoks} />
        {app === "virkailija" && <StudentIdentifierInfo hoks={hoks} />}
      </tbody>
    </InfoTable>
  </Accordion>
)

const HoksPaivamaarat = ({
  hoksPaivamaaratOpen,
  toggleHoksPaivamaarat,
  hoks
}: {
  hoksPaivamaaratOpen: boolean
  toggleHoksPaivamaarat: () => void
  hoks: IHOKS
}) => (
  <Accordion
    id="hoksDates"
    open={hoksPaivamaaratOpen}
    title={
      <AccordionTitle>
        <FormattedMessage
          id="tavoitteet.hoksPaivamaaratTitle"
          defaultMessage="HOKS päivämäärät"
        />
      </AccordionTitle>
    }
    onToggle={toggleHoksPaivamaarat}
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
              id="tavoitteet.osaaminenSaavutettuTitle"
              defaultMessage="Sovittu osaaminen saavutettu"
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
          <LabeledColumn id="tavoitteet.osaaminenSaavutettuTitle">
            <FormattedDate
              date={hoks.osaamisenSaavuttamisenPvm}
              dateNotSet={
                <FormattedMessage
                  id="tavoitteet.osaaminenEiVielaSaavutettuTitle"
                  defaultMessage="Sovittua osaamista ei vielä saavutettu"
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
)

export interface TavoitteetProps {
  store?: IRootStore
  children?: React.ReactChildren
  student: ISessionUser
  hoks: IHOKS
  showOpiskelijapalaute?: boolean
  titles?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    degreeOrEducation?: React.ReactNode
    personalDetails?: React.ReactNode
    opiskelijapalaute?: React.ReactNode
    hokspoisto?: React.ReactNode
  }
}

export interface TavoitteetState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
  hoksPoistoModalOpen: boolean
}

export const Tavoitteet = inject("store")(
  observer((props: TavoitteetProps) => {
    const [state, setState] = useState<TavoitteetState>({
      activeAccordions: {
        hoksDates: false,
        degreeOrEducation: false,
        personalDetails: false,
        personalGoal: false,
        opiskelijapalaute: false,
        hoksPoisto: false
      },
      hoksPoistoModalOpen: false
    })

    const toggleAccordion = (accordion: string) => () => {
      setState({
        ...state,
        activeAccordions: {
          ...state.activeAccordions,
          [accordion]: !state.activeAccordions[accordion]
        }
      })
    }

    const { student, hoks, titles: customTitles = {} } = props
    const session = props.store!.session
    const { app } = useContext(AppContext)

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
      ),
      opiskelijapalaute: (
        <AccordionTitle>
          <FormattedMessage
            id="tavoitteet.OpiskelijapalauteTitle"
            defaultMessage="Opiskelijapalaute"
          />
        </AccordionTitle>
      ),
      hoksPoisto: (
        <AccordionTitle>
          <FormattedMessage
            id="tavoitteet.PoistaHoks"
            defaultMessage="Poista HOKS"
          />
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
          <HoksPaivamaarat
            hoksPaivamaaratOpen={state.activeAccordions.hoksDates}
            toggleHoksPaivamaarat={toggleAccordion("hoksDates")}
            hoks={hoks}
          />
        )}

        <Urasuunnitelma
          title={titles.goals}
          urasuunnitelmaOpen={state.activeAccordions.personalGoal}
          toggleUrasuunnitelma={toggleAccordion("personalGoal")}
          urasuunnitelma={hoks.urasuunnitelma}
        />

        <TutkintoTaiKoulutus
          title={titles.degreeOrEducation}
          tutkintoTaiKoulutusOpen={state.activeAccordions.degreeOrEducation}
          toggleTutkintoTaiKoulutus={toggleAccordion("degreeOrEducation")}
          plan={hoks}
        />

        <Henkilotiedot
          title={titles.personalDetails}
          henkilotiedotOpen={state.activeAccordions.personalDetails}
          toggleHenkilotiedot={toggleAccordion("personalDetails")}
          hoks={hoks}
          student={student}
          app={app}
        />

        {props.showOpiskelijapalaute && !hoks.isTuvaHoks && (
          <Opiskelijapalaute
            toggleAccordion={toggleAccordion}
            open={state.activeAccordions.opiskelijapalaute}
            title={titles.opiskelijapalaute}
            palauteTilat={hoks.opiskelijapalauteTilat}
            hoksID={hoks.id}
            oppijaOid={student.oid}
          />
        )}
        {session.hasShallowDeletePrivilege && app === "virkailija" && (
          <HoksPoisto
            hoks={hoks}
            student={student}
            title={titles.hoksPoisto}
            hoksPoistoOpen={state.activeAccordions.hoksPoisto}
            toggleHoksPoisto={toggleAccordion}
          />
        )}
      </React.Fragment>
    )
  })
)

import React from "react"
import { render, fireEvent, wait } from "@testing-library/react"
import { StudyInfo as StudyInfoWithoutTheme } from "../StudyInfo"
import { renderWithContext, withTheme } from "testUtils"
import {
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen
} from "models/helpers/TutkinnonOsa"
import { mockFetch } from "fetchUtils"
import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
const StudyInfo = withTheme(StudyInfoWithoutTheme)

const osaamisvaatimukset = [
  {
    kuvaus: "competence requirement",
    kriteerit: [
      {
        kuvaus: "description for first competence requirement criterion",
        kriteerit: ["1st criterion", "2nd criterion"]
      },
      {
        kuvaus: "description for second competence requirement criterion",
        kriteerit: ["1st criterion", "2nd criterion"]
      }
    ]
  }
]

const naytot1 = [
  {
    alku: "2017-10-25",
    loppu: "2017-10-26",
    nayttoymparisto: {
      kuvaus: "Näyttöympäristö",
      nimi: "Näyttöpaikka"
    },
    jarjestaja: { oppilaitosNimi: "testi testi" },
    tyoelamaArvioijat: ["arvioija"],
    koulutuksenJarjestajaArvioijat: ["koulutuksen arvioija"],
    osaAlueet: [{ koodiVersio: 1 }],
    yksilollisetKriteerit: ["joku kriteeri"],
    sisallonKuvaus: ["Elintarvikkeiden valmistus", "Elintarvikkeiden pakkaus"]
  } as IOsaamisenOsoittaminen
]

const naytot2 = [
  {
    alku: "2017-10-25",
    loppu: "2017-10-26",
    nayttoymparisto: {
      kuvaus: "Näyttöympäristö",
      nimi: "Näyttöpaikka"
    },
    jarjestaja: { oppilaitosNimi: "testi testi" },
    koulutuksenJarjestajaArvioijat: ["koulutuksen arvioija"],
    tyoelamaArvioijat: ["arvioija"],
    sisallonKuvaus: ["Elintarvikkeiden valmistus", "Elintarvikkeiden pakkaus"]
  } as IOsaamisenOsoittaminen,
  {
    alku: "2017-10-25",
    loppu: "2017-10-26",
    nayttoymparisto: {
      kuvaus: "Näyttöympäristö",
      nimi: "Näyttöpaikka"
    },
    jarjestaja: { oppilaitosNimi: "testi testi" },
    koulutuksenJarjestajaArvioijat: ["koulutuksen arvioija"],
    tyoelamaArvioijat: ["arvioija"],
    sisallonKuvaus: ["Elintarvikkeiden valmistus", "Elintarvikkeiden pakkaus"]
  } as IOsaamisenOsoittaminen
]

const naytot3 = [
  {
    alku: "2019-08-01",
    loppu: "2019-08-01",
    nayttoymparisto: {
      kuvaus: "Näyttöympäristö",
      nimi: "Näyttöpaikka"
    },
    jarjestaja: { oppilaitosNimi: "testi testi" },
    koulutuksenJarjestajaArvioijat: ["koulutuksen arvioija"],
    tyoelamaArvioijat: ["arvioija"],
    sisallonKuvaus: ["Elintarvikkeiden valmistus", "Elintarvikkeiden pakkaus"]
  } as IOsaamisenOsoittaminen
]

const osaamisenHankkimistapa1 = [
  {
    alku: "2019-05-24",
    loppu: "2019-07-31",
    selite: "Moodle-kurssi, viestintä",
    tyyppi: OsaamisenHankkimistapaType.Other
  } as IOsaamisenHankkimistapa
]

const osaamisenHankkimistapa2 = [
  {
    alku: "2019-09-13",
    loppu: "2019-09-30",
    tyopaikallaJarjestettavaKoulutus: {
      vastuullinenTyopaikkaOhjaaja: {
        nimi: "John McAfee",
        sahkoposti: "john@mock.dev"
      },
      keskeisetTyotehtavat: [
        "Elintarvikkeiden valmistus",
        "Elintarvikkeiden säilytys"
      ]
    },
    selite: "Palvelutalo Koivikkola",
    muutOppimisymparistot: [{ oppimisymparisto: { nimi: "testiymparisto" } }],
    tyyppi: OsaamisenHankkimistapaType.Workplace
  } as IOsaamisenHankkimistapa,
  {
    alku: "2019-10-01",
    loppu: "2019-10-15",
    selite: "Moodle-kurssi, Ikääntyminen",
    tyopaikallaJarjestettavaKoulutus: {
      vastuullinenTyopaikkaOhjaaja: {
        nimi: "John McAfee",
        sahkoposti: "john@mock.dev"
      },
      keskeisetTyotehtavat: [
        "Elintarvikkeiden valmistus",
        "Elintarvikkeiden säilytys"
      ]
    },
    muutOppimisymparistot: [{ oppimisymparisto: { nimi: "testiymparisto" } }],
    tyyppi: OsaamisenHankkimistapaType.Other
  } as IOsaamisenHankkimistapa
]

describe("StudyInfo", () => {
  beforeEach(() => {
    // mockFetch will load JSONs from shared/stores/mocks/*.json
    window.fetch = mockFetch((path: string) => `/${path}`)
  })

  test("render without params", () => {
    const { getByTestId } = render(<StudyInfo />)
    expect(getByTestId("Title")).toBeEmpty()
    expect(getByTestId("StudyInfo.Competences")).toBeEmpty()
  })

  test("render title", () => {
    const { getByTestId } = render(<StudyInfo title="Test" />)
    expect(getByTestId("Title").textContent).toBe("Test")
  })

  test("render competence requirements", async () => {
    const { getByTestId, queryByTestId } = renderWithContext(
      <StudyInfo title="Test" competenceRequirements={osaamisvaatimukset} />
    )

    const expandCompetences = getByTestId(
      "StudyInfo.Competences.ExpandCompetences"
    )

    expect(
      queryByTestId("StudyInfo.Competences.CollapseCompetences")
    ).not.toBeInTheDocument()
    expect(expandCompetences).toBeInTheDocument()

    fireEvent.click(expandCompetences)

    expect(
      getByTestId("StudyInfo.Competences.CompetenceRequirements").children
        .length
    ).toBe(1)

    const collapseCompetences = getByTestId(
      "StudyInfo.Competences.CollapseCompetences"
    )
    expect(collapseCompetences).toBeInTheDocument()
    expect(expandCompetences).not.toBeInTheDocument()

    fireEvent.click(collapseCompetences)

    expect(
      queryByTestId("StudyInfo.Competences.CompetenceRequirements")
    ).not.toBeInTheDocument()
  })

  test("render demonstrations", async () => {
    const {
      getByTestId,
      getAllByTestId,
      queryByTestId,
      rerender
    } = renderWithContext(
      <StudyInfo title="Test" osaamisenOsoittamiset={naytot1} />
    )

    expect(getByTestId("StudyInfo.DetailsCollapsed")).toBeInTheDocument()
    expect(queryByTestId("StudyInfo.DetailsExpanded")).not.toBeInTheDocument()
    expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(1)

    rerender(<StudyInfo title="Test" osaamisenOsoittamiset={naytot2} />)

    await wait(() => {
      expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(2)
      fireEvent.click(getByTestId("StudyInfo.ExpandDetails"))
      expect(
        queryByTestId("StudyInfo.DetailsCollapsed")
      ).not.toBeInTheDocument()
      expect(getByTestId("StudyInfo.DetailsExpanded")).toBeInTheDocument()
      expect(getAllByTestId("StudyInfo.Demonstration").length).toBe(2)
    })
  })

  test("render learning periods", async () => {
    const {
      getByTestId,
      getAllByTestId,
      queryByTestId,
      rerender
    } = renderWithContext(
      <StudyInfo
        title="Test"
        osaamisenHankkimistavat={osaamisenHankkimistapa1}
      />
    )

    expect(getByTestId("StudyInfo.DetailsCollapsed")).toBeInTheDocument()
    expect(queryByTestId("StudyInfo.DetailsExpanded")).not.toBeInTheDocument()
    expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(1)

    rerender(
      <StudyInfo
        title="Test"
        osaamisenHankkimistavat={osaamisenHankkimistapa2}
      />
    )

    await wait(() => {
      expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(2)
      fireEvent.click(getByTestId("StudyInfo.ExpandDetails"))
      expect(
        queryByTestId("StudyInfo.DetailsCollapsed")
      ).not.toBeInTheDocument()
      expect(getByTestId("StudyInfo.DetailsExpanded")).toBeInTheDocument()
      expect(getAllByTestId("StudyInfo.OsaamisenHankkimistapa").length).toBe(2)
    })
  })

  test("render verification processes", () => {
    const { queryByTestId, queryAllByTestId, rerender } = renderWithContext(
      <StudyInfo
        title="Title"
        verificationProcess={{
          koodiUri: "osaamisentodentamisenprosessi_0001"
        }}
      />
    )

    expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(0)
    expect(queryByTestId("StudyInfo.DirectVerification")).toBeInTheDocument()

    rerender(
      <StudyInfo
        title="Title"
        verificationProcess={{
          koodiUri: "osaamisentodentamisenprosessi_0002",
          lahetettyArvioitavaksi: "2019-04-15"
        }}
        koulutuksenJarjestaja={{
          oid: "1.2.246.562.10.5921222",
          nimi: { fi: "Koulutuksen järjestäjä-organisaatio", sv: "" },
          organizationName: "Koulutuksen järjestäjä-organisaatio"
        }}
      />
    )

    expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(0)
    expect(
      queryByTestId("StudyInfo.AssessmentVerification")
    ).toBeInTheDocument()
    expect(
      queryByTestId("StudyInfo.AssessmentVerificationOrganisation")
    ).toBeInTheDocument()

    rerender(
      <StudyInfo
        title="Title"
        osaamisenOsoittamiset={naytot3}
        verificationProcess={{
          koodiUri: "osaamisentodentamisenprosessi_0003"
        }}
      />
    )

    expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(1)
    expect(
      queryByTestId("StudyInfo.DemonstrationVerification")
    ).toBeInTheDocument()
  })
})

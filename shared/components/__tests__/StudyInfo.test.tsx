import React from "react"
import { render, fireEvent, wait } from "@testing-library/react"
import { TutkinnonOsa as TutkinnonOsaWithoutTheme } from "../TutkinnonOsa"
import { renderWithContext, withTheme } from "testUtils"
import {
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  ITarkentavatTiedotOsaamisenArvioija
} from "models/helpers/TutkinnonOsa"
import { mockFetch } from "fetchUtils"
import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
import { Instance } from "mobx-state-tree"
import { OsaAlueReference } from "../../models/OsaAlueReference"
const TutkinnonOsa = withTheme(TutkinnonOsaWithoutTheme)

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

type osaAlueReference = Instance<typeof OsaAlueReference>

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
    osaAlueet: [] as osaAlueReference[],
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
    osaAlueet: [] as osaAlueReference[],
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
    osaAlueet: [] as osaAlueReference[],
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

function expandDetails(getByTestId: any, queryByTestId: any) {
  fireEvent.click(getByTestId("TutkinnonOsa.ExpandDetails"))
  expect(queryByTestId("TutkinnonOsa.DetailsCollapsed")).not.toBeInTheDocument()
  expect(getByTestId("TutkinnonOsa.DetailsExpanded")).toBeInTheDocument()
}

describe("TutkinnonOsa", () => {
  beforeEach(() => {
    // mockFetch will load JSONs from shared/stores/mocks/*.json
    window.fetch = mockFetch((path: string) => `/${path}`)
  })

  test("render without params", () => {
    const { getByTestId, queryByTestId } = render(<TutkinnonOsa />)
    expect(getByTestId("Title")).toBeEmpty()
    expect(getByTestId("TutkinnonOsa.EmptyCompetences")).toBeInTheDocument()
    expect(queryByTestId("TutkinnonOsa.Competences")).not.toBeInTheDocument()
  })

  test("render title", () => {
    const { getByTestId } = render(<TutkinnonOsa title="Test" />)
    expect(getByTestId("Title").textContent).toBe("Test")
  })

  test("render competence requirements", async () => {
    const { getByTestId, queryByTestId } = renderWithContext(
      <TutkinnonOsa title="Test" competenceRequirements={osaamisvaatimukset} />
    )

    const expandCompetences = getByTestId(
      "TutkinnonOsa.Competences.ExpandCompetences"
    )

    expect(
      queryByTestId("TutkinnonOsa.Competences.CollapseCompetences")
    ).not.toBeInTheDocument()
    expect(expandCompetences).toBeInTheDocument()

    fireEvent.click(expandCompetences)

    expect(
      getByTestId("TutkinnonOsa.Competences.CompetenceRequirements").children
        .length
    ).toBe(1)

    const collapseCompetences = getByTestId(
      "TutkinnonOsa.Competences.CollapseCompetences"
    )
    expect(collapseCompetences).toBeInTheDocument()
    expect(expandCompetences).not.toBeInTheDocument()

    fireEvent.click(collapseCompetences)

    expect(
      queryByTestId("TutkinnonOsa.Competences.CompetenceRequirements")
    ).not.toBeInTheDocument()
  })

  test("render OsaamisenOsoittamiset", async () => {
    const {
      getByTestId,
      getAllByTestId,
      queryByTestId,
      rerender
    } = renderWithContext(
      <TutkinnonOsa title="Test" osaamisenOsoittamiset={naytot1} />
    )

    expect(getByTestId("TutkinnonOsa.DetailsCollapsed")).toBeInTheDocument()
    expect(
      queryByTestId("TutkinnonOsa.DetailsExpanded")
    ).not.toBeInTheDocument()
    expect(getAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(1)

    rerender(<TutkinnonOsa title="Test" osaamisenOsoittamiset={naytot2} />)

    await wait(() => {
      expect(getAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(2)
      expandDetails(getByTestId, queryByTestId)
      expect(getAllByTestId("TutkinnonOsa.OsaamisenOsoittaminen").length).toBe(
        2
      )
    })
  })

  test("render learning periods", async () => {
    const {
      getByTestId,
      getAllByTestId,
      queryByTestId,
      rerender
    } = renderWithContext(
      <TutkinnonOsa
        title="Test"
        osaamisenHankkimistavat={osaamisenHankkimistapa1}
      />
    )

    expect(getByTestId("TutkinnonOsa.DetailsCollapsed")).toBeInTheDocument()
    expect(
      queryByTestId("TutkinnonOsa.DetailsExpanded")
    ).not.toBeInTheDocument()
    expect(getAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(1)

    rerender(
      <TutkinnonOsa
        title="Test"
        osaamisenHankkimistavat={osaamisenHankkimistapa2}
      />
    )

    await wait(() => {
      expect(getAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(2)
      expandDetails(getByTestId, queryByTestId)
      expect(getAllByTestId("TutkinnonOsa.OsaamisenHankkimistapa").length).toBe(
        2
      )
    })
  })

  test("render verification processes collapsed", () => {
    const {
      queryAllByTestId,
      rerender,
      getByText,
      queryByText
    } = renderWithContext(
      <TutkinnonOsa
        title="Title"
        todentamisenProsessi={{
          koodiUri: "osaamisentodentamisenprosessi_0001"
        }}
      />
    )

    expect(queryAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(0)
    expect(getByText("Osaaminen tunnistettu suoraan")).toBeInTheDocument()
    expect(queryByText("Aiemman osaamisen todentanut")).not.toBeInTheDocument()

    rerender(
      <TutkinnonOsa
        title="Title"
        todentamisenProsessi={{
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

    expect(queryAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(0)
    expect(
      getByText("Osaaminen lähetetty arvioitavaksi 15.4.2019")
    ).toBeInTheDocument()
    expect(getByText("Aiemman osaamisen todentanut")).toBeInTheDocument()
    expect(getByText("Koulutuksen järjestäjä-organisaatio")).toBeInTheDocument()

    rerender(
      <TutkinnonOsa
        title="Title"
        osaamisenOsoittamiset={naytot3}
        todentamisenProsessi={{
          koodiUri: "osaamisentodentamisenprosessi_0003"
        }}
      />
    )

    expect(queryAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(1)
    expect(getByText("Osaaminen osoitetaan näytössä")).toBeInTheDocument()
    expect(queryByText("Aiemman osaamisen todentanut")).not.toBeInTheDocument()
  })

  test("render verification processes expanded", async () => {
    const {
      queryAllByTestId,
      queryByTestId,
      getByTestId,
      getByText
    } = renderWithContext(
      <TutkinnonOsa
        title="Title"
        todentamisenProsessi={{
          koodiUri: "osaamisentodentamisenprosessi_0001"
        }}
        tarkentavatTiedotOsaamisenArvioija={
          {
            aiemminHankitunOsaamisenArvioijat: [
              {
                koulutuksenJarjestajaArvioijaDescription:
                  "Testi Teuvo, Organisaatio"
              }
            ]
          } as ITarkentavatTiedotOsaamisenArvioija
        }
      />
    )

    await wait(() => {
      expect(queryAllByTestId("TutkinnonOsa.LearningEvent").length).toBe(0)
      expandDetails(getByTestId, queryByTestId)
      expect(getByText("Osaaminen tunnistettu suoraan")).toBeInTheDocument()
      expect(getByText("Testi Teuvo, Organisaatio")).toBeInTheDocument()
    })
  })
})

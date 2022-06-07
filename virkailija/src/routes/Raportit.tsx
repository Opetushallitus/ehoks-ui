import { RouteComponentProps, Link } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { RaportitTable } from "components/RaportitTable"
import { HelpPopup } from "components/HelpPopup"
import { Heading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { appendCommonHeaders } from "fetchUtils"
import { Column, Row } from "react-table"
import { Button } from "components/Button"
import { InfoModal } from "../../../shared/components/InfoModal"
import { ITyopaikkajaksoRaporttiRivi } from "../../../shared/models/TyopaikkajaksoRaporttiRivi"

const BackgroundContainer = styled("div")`
  background: #f8f8f8;
  min-height: 100%;
`

const TopContainer = styled("div")`
  display: flex;
  align-items: center;
  position: relative;
`

const Nav = styled("div")`
  line-height: 25px;
  width: 14%;
  height: 100%;
  float: left;
  padding: 5px;
`

const Section = styled("div")`
  width: 85%;
  float: left;
  padding: 0px 10px 10px 10px;
  margin-bottom: 10px;
  padding-left: 60px;
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const MenuItem = styled("div")`
  margin-top: 20px;
  padding: 5px;
  display: block;
`

const ItemHeader = styled("h3")`
  margin: 0;
  padding-right: 10px;
  padding-bottom: 10px;
`

const ItemDescription = styled("p")`
  margin: 0;
  padding-right: 10px;
  padding-bottom: 10px;
`

const ContentElement = styled("div")`
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
`

const Separator = styled("div")`
  border-left: 2px solid #a8a8a8;
  min-height: 400px;
  float: left;
`

const SearchButton = styled(Button)`
  margin-left: 25px;
  padding: 5px 20px 5px 20px;
`

const linkStyle = {
  textDecoration: "none",
  color: "#3a7a10"
}

const HelpButton = styled(HelpPopup)`
  margin-left: 12px;
`

const FilterBox = styled("div")`
  margin-bottom: 25px;
`

const DateInput = styled("input")`
  border: 1px solid #999;
  height: 34px;
  padding: 10px;
  font-size: 14px;
`

const Styles = styled("div")`
  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tr:nth-child(even) {
      background: #f4fff4;
    }
    tr:nth-child(odd) {
      background: #fff;
    }

    th,
    td {
      padding: 0.5rem;
      border-bottom: 1px solid black;
      jborder-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    th {
      background: #3a7a10;
      border-bottom: 2px solid black;
      color: white;
      fontweight: bold;
    }
  }
`

interface RaportitProps extends RouteComponentProps {
  store?: IRootStore
}

export interface HoksRow {
  hoksid: number
  hokseid: string
  oppijaoid: string
  opiskeluoikeusoid: string
  oppilaitosoid: string
}
interface hoksitFetchResult {
  count: number
  hoksit: HoksRow[]
}

/*
export interface TpjRow {
  hoksId: number // OK
  hoksEid: string // OK
  opiskeluoikeusOid: string // OK
  oppijaOid: string // OK
  hankkimistapaTyyppi: string // uudelleennimetään osaamisenHankkimistapaKoodiUri
  alkupvm: string // OK
  loppupvm: string // OK
  osaAikaisuus: number // OK
  oppisopimuksenPerusta: string // uudelleennimetään oppisopimuksenPerustaKoodiUri
  tyopaikanNimi: string // OK
  ytunnus: string // OK
  ohjaajaNimi: string // OK
  ohjaajaEmail: string // OK
  ohjaajaPuhelinnumero: string // OK
  customColumn: number
}
*/

interface TpjFetchResult {
  data: ITyopaikkajaksoRaporttiRivi[]
}

interface RaportitState {
  hoksitCount?: number
  data?: (HoksRow | ITyopaikkajaksoRaporttiRivi)[]
  titleText: string
  descText: string
  selected: number
  alku: string
  loppu: string
}

interface CustomColumn {
  cell: {
    value: number
    row: Row
  }
}

@inject("store")
@observer
export class Raportit extends React.Component<RaportitProps> {
  static contextTypes = {
    intl: intlShape
  }

  state: RaportitState = {
    hoksitCount: 0,
    data: [],
    titleText: "Klikkaa valikosta haluamasi raportti",
    descText: "",
    selected: 0,
    alku: "",
    loppu: ""
  }

  async loadHoksesWithoutOpiskeluoikeudet(oppilaitosOid: string | undefined) {
    const { notifications } = this.props.store!
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/missing-oo-hoksit/" +
        oppilaitosOid,
      {
        method: "GET",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )

    if (request.status === 200) {
      const json: hoksitFetchResult = await request.json()
      this.setState({
        hoksitCount: json.count,
        data: json.hoksit
      })
    }

    if (request.status === 403) {
      notifications.addError("Raportit.EiOikeuksia", oppilaitosOid)
    }
  }

  async loadTyopaikkaJaksot() {
    /*
    const tutkinto = JSON.stringify({
      fi: "Autokorimestarin erikoisammattitutkinto",
      sv: "Specialyrkesexamen för karosseri- och bilplåtsmästare"
    })
    */
    const tutkinto = JSON.stringify({})
    const { store } = this.props
    const { notifications } = store!
    const oppilaitosOid: string | undefined =
      store?.session.selectedOrganisationOid
    if (this.state.alku.length && this.state.loppu.length && oppilaitosOid) {
      const request = await window.fetch(
        "/ehoks-virkailija-backend/api/v1/virkailija/tep-jakso-raportti?" +
          "tutkinto=" +
          tutkinto +
          "&oppilaitos=" +
          oppilaitosOid +
          "&start=" +
          this.state.alku +
          "&end=" +
          this.state.loppu,
        {
          method: "GET",
          credentials: "include",
          headers: appendCommonHeaders(
            new Headers({
              Accept: "application/json; charset=utf-8",
              "Content-Type": "application/json"
            })
          )
        }
      )

      if (request.status === 200) {
        const json: TpjFetchResult = await request.json()
        console.log(json.data)
        this.setState({
          data: json.data
        })
      }

      if (request.status === 403) {
        notifications.addError("Raportit.EiOikeuksia", oppilaitosOid)
      }
    }
  }

  async componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  navClickHandler = (
    event: React.MouseEvent<HTMLAnchorElement>,
    titleText: string,
    descText: string,
    selected: number
  ) => {
    this.setState({
      data: []
    })
    event.preventDefault()
    // @ts-ignore Don't know how to remove focus from link without this
    event.target.blur()
    this.setState({
      titleText,
      descText,
      selected
    })
    if (selected === 1) {
      const { store } = this.props
      const oppilaitosOid: string | undefined =
        store?.session.selectedOrganisationOid
      this.loadHoksesWithoutOpiskeluoikeudet(oppilaitosOid)
    }
  }

  getHoksiByHoksId = (hoksid: number) =>
    this.state.data?.find((x: HoksRow) => x.hoksid === hoksid) as HoksRow

  getTpjRowByHoksId = (hoksId: number) =>
    this.state.data?.find(
      (x: ITyopaikkajaksoRaporttiRivi) => x.hoksId === hoksId
    ) as ITyopaikkajaksoRaporttiRivi

  createLinkPath = (hoksid: number) => {
    let row = {} as HoksRow | ITyopaikkajaksoRaporttiRivi
    let oppijaOid = ""
    let hoksEid = ""
    switch (this.state.selected) {
      case 1:
        row = this.getHoksiByHoksId(hoksid)
        oppijaOid = row.oppijaoid
        hoksEid = row.hokseid
        break
      case 2:
        row = this.getTpjRowByHoksId(hoksid)
        oppijaOid = row.oppijaOid
        hoksEid = row.hoksEid
        break
    }
    return oppijaOid.length && hoksEid.length
      ? `/ehoks-virkailija-ui/koulutuksenjarjestaja/${oppijaOid}/${hoksEid}`
      : "/ehoks-virkailija-ui/raportit"
  }

  setPvmDate = (type: string, value: string) => {
    const target = type === "alku" ? "alku" : "loppu"
    this.setState({
      [target]: value
    })
  }

  getColumnsForTable = (selectedRaportti: number): Column[] => {
    if (selectedRaportti === 1) {
      return [
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.ehoksid"
          }),
          accessor: "hoksid",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>
              <Link
                to={this.createLinkPath(value)}
                state={{
                  fromRaportit: true,
                  oppijaoid: this.getHoksiByHoksId(value)?.oppijaoid,
                  hokseid: this.getHoksiByHoksId(value)?.hokseid
                }}
              >
                {value}
              </Link>
            </div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.oppijanumeroTitle"
          }),
          accessor: "oppijaoid"
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.opiskeluoikeusoid"
          }),
          accessor: "opiskeluoikeusoid"
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.oppilaitosoid"
          }),
          accessor: "oppilaitosoid"
        }
      ]
    } else if (selectedRaportti === 2) {
      return [
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.ehoksid"
          }),
          accessor: "hoksId",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>
              <Link
                to={this.createLinkPath(value)}
                state={{
                  fromRaportit: true,
                  oppijaoid: this.getTpjRowByHoksId(value)?.oppijaOid,
                  hokseid: this.getTpjRowByHoksId(value)?.hoksEid
                }}
              >
                {value}
              </Link>
            </div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.opiskeluoikeusoid"
          }),
          accessor: "opiskeluoikeusOid",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.oppijanumeroTitle"
          }),
          accessor: "oppijaOid",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.tyopaikannimi"
          }),
          accessor: "tyopaikanNimi",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.ohjaajannimi"
          }),
          accessor: "ohjaajaNimi",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.alku"
          }),
          accessor: "alkupvm",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.loppu"
          }),
          accessor: "loppupvm",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>{value}</div>
          )
        },
        {
          Header: this.context.intl.formatMessage({
            id: "infoModal.naytaLisatiedot",
            accessor: "customColumn",
            Cell: ({ cell: { value } }: CustomColumn) => (
              <div style={{ textAlign: "center" }}>{value}</div>
            )
          }),
          Cell: ({ cell: { value, row } }: CustomColumn) => {
            const tpjRow = row.original as ITyopaikkajaksoRaporttiRivi
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <InfoModal
                  nayttoymparistoDetails={tpjRow?.tyopaikanNimi}
                  startDate={tpjRow?.alkupvm}
                  endDate={tpjRow?.loppupvm}
                  partTimeAmount={tpjRow?.osaAikaisuus}
                  perusta={tpjRow?.oppisopimuksenPerusta}
                  hoksId={value}
                  opiskeluoikeusOid={tpjRow?.opiskeluoikeusOid}
                  osaamisenHankkimistapaKoodisto={
                    tpjRow?.osaamisenHankkimistapa
                  }
                  ytunnus={tpjRow?.ytunnus}
                  oppijaOid={tpjRow?.oppijaOid}
                  ohjaajaNimi={tpjRow?.ohjaajaNimi}
                  ohjaajaEmail={tpjRow?.ohjaajaEmail}
                  ohjaajaPuhelinnumero={tpjRow?.ohjaajaPuhelinnumero}
                  tutkinnonOsanNimi={tpjRow?.tutkinnonOsanNimi}
                />
              </div>
            )
          }
        }
      ]
    } else {
      return []
    }
  }

  tpjHaeOnClick = () => {
    this.loadTyopaikkaJaksot()
  }

  checkActive = (num: number) =>
    this.state.selected === num ? "bolder" : "initial"

  render() {
    const { data, selected, titleText, descText, alku, loppu } = this.state
    const { intl } = this.context
    const columns = this.getColumnsForTable(selected)

    return (
      <BackgroundContainer>
        <Container>
          <PaddedContent>
            <TopContainer>
              <TopHeading>
                <FormattedMessage
                  id="header.raportitLink"
                  defaultMessage="Raportit"
                />
              </TopHeading>
            </TopContainer>
            <ContentArea>
              <ContentElement>
                <Nav>
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(
                        event,
                        intl.formatMessage({
                          id: "raportit.hoksesWithoutOpiskeluoikeus"
                        }),
                        intl.formatMessage({
                          id: "raportit.hoksesWithoutOpiskeluoikeusAlaOtsikko"
                        }),
                        1
                      )
                    }
                    style={{
                      ...linkStyle,
                      fontWeight: this.checkActive(1)
                    }}
                  >
                    <FormattedMessage
                      id="raportit.hoksesWithoutOpiskeluoikeus"
                      defaultMessage="Hoksit, joissa poistettu opiskeluoikeus"
                    />
                    <HelpButton
                      helpContent={
                        <FormattedMessage
                          id="raportit.hoksesWithoutOpiskeluoikeusInfoKuvaus"
                          defaultMessage="Tietoa olennaisesta seikasta"
                        />
                      }
                      toggleSize="18"
                    />
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(
                        event,
                        intl.formatMessage({
                          id: "raportit.tyopaikkajaksoihinTallennetutTiedot"
                        }),
                        intl.formatMessage({
                          id:
                            "raportit.tyopaikkajaksoihinTallennetutTiedotInfoKuvaus"
                        }),
                        2
                      )
                    }
                    style={{
                      ...linkStyle,
                      fontWeight: this.checkActive(2)
                    }}
                  >
                    <FormattedMessage
                      id="raportit.tyopaikkajaksoihinTallennetutTiedot"
                      defaultMessage="Työpaikkajaksoihin tallennetut tiedot"
                    />
                    <HelpButton
                      helpContent={
                        <FormattedMessage
                          id="raportit.tyopaikkajaksoihinTallennetutTiedotInfoKuvaus"
                          defaultMessage="Hakee ja listaa valitun oppilaitoksen työpaikkajaksot, joista ei löydy osa-aikaisuustietoa."
                        />
                      }
                      toggleSize="18"
                    />
                  </MenuItem>
                </Nav>
                <Separator />
                <Section>
                  <ItemHeader>{titleText}</ItemHeader>
                  <ItemDescription>{descText}</ItemDescription>
                  <div
                    style={{
                      display: selected === 1 ? "block" : "none"
                    }}
                  >
                    <Styles>
                      <RaportitTable data={data} columns={columns} />
                    </Styles>
                  </div>
                  <div
                    style={{
                      display: selected === 2 ? "block" : "none"
                    }}
                  >
                    <FilterBox>
                      <DateInput
                        type="date"
                        value={alku}
                        onChange={e => this.setPvmDate("alku", e.target.value)}
                      />{" "}
                      -{" "}
                      <DateInput
                        type="date"
                        value={loppu}
                        onChange={e => this.setPvmDate("loppu", e.target.value)}
                      />
                      <SearchButton
                        onClick={this.tpjHaeOnClick}
                        disabled={
                          !(this.state.alku.length && this.state.loppu.length)
                        }
                      >
                        Hae
                      </SearchButton>
                    </FilterBox>
                    <Styles>
                      <RaportitTable data={data} columns={columns} />
                    </Styles>
                  </div>
                </Section>
              </ContentElement>
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

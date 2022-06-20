import { RouteComponentProps, Link } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { RaportitTable } from "components/RaportitTable"
import { HelpPopup } from "components/HelpPopup"
import { Heading } from "components/Heading"
import { TyopaikkajaksoRaporttiRivi } from "models/TyopaikkajaksoRaporttiRivi"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { appendCommonHeaders } from "fetchUtils"
import { Column, Row } from "react-table"
import { Button } from "components/Button"
import { InfoModal } from "../../../shared/components/InfoModal"

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
  hoksId: number
  hoksEid: string
  oppijaOid: string
  opiskeluoikeusOid: string
  oppilaitosOid: string
}
interface hoksitFetchResult {
  data: {
    count: number
    pagecount: number
    result: HoksRow[]
  }
}

export interface TpjRow {
  hoksId: number
  hoksEid: string
  opiskeluoikeusOid: string
  oppijaOid: string
  hankkimistapaTyyppi: string
  alkupvm: string
  loppupvm: string
  osaAikaisuus: number
  oppisopimuksenPerusta: string
  tyopaikanNimi: string
  ytunnus: string
  ohjaajaNimi: string
  ohjaajaEmail: string
  ohjaajaPuhelinnumero: string
  customColumn: number
}

interface TpjFetchResult {
  data: {
    count: number
    pagecount: number
    result: TpjRow[]
  }
}

interface RaportitState {
  hoksitCount?: number
  data?: (HoksRow | TpjRow)[]
  loading: boolean
  pageCount: number
  titleText: string
  descText: string
  selected: number
  alku: string
  loppu: string
  initSearchDone: boolean
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
    loppu: "",
    loading: false,
    pageCount: 0,
    initSearchDone: false
  }

  loadHoksesWithoutOpiskeluoikeudet = async (
    pageSize: number,
    pageIndex: number
  ) => {
    const { store } = this.props
    const { notifications } = store!
    const oppilaitosOid: string | undefined =
      store?.session.selectedOrganisationOid
    if (oppilaitosOid) {
      this.setState({
        loading: true
      })
      const request = await window.fetch(
        "/ehoks-virkailija-backend/api/v1/virkailija/missing-oo-hoksit/" +
          oppilaitosOid +
          "?" +
          "pagesize=" +
          pageSize +
          "&pageindex=" +
          pageIndex,
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
          data: json.data.result,
          loading: false,
          pageCount: json.data.pagecount
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
      this.loadHoksesWithoutOpiskeluoikeudet(10, 0)
    }
  }

  getHoksiByHoksId = (hoksId: number) =>
    this.state.data?.find((x: HoksRow) => x.hoksId === hoksId) as HoksRow

  getTpjRowByHoksId = (hoksId: number) =>
    this.props.store!.raportit.tyopaikkajaksoRivit?.find(
      (x: TpjRow) => x.hoksId === hoksId
    ) as TpjRow

  createLinkPath = (hoksId: number) => {
    let row = {} as HoksRow | TpjRow
    let oppijaOid = ""
    let hoksEid = ""
    switch (this.state.selected) {
      case 1:
        row = this.getHoksiByHoksId(hoksId)
        oppijaOid = row.oppijaOid
        hoksEid = row.hoksEid
        break
      case 2:
        row = this.getTpjRowByHoksId(hoksId)
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
          accessor: "hoksId",
          Cell: ({ cell: { value } }: CustomColumn) => (
            <div style={{ textAlign: "center" }}>
              <Link
                to={this.createLinkPath(value)}
                state={{
                  fromRaportit: true,
                  oppijaoid: this.getHoksiByHoksId(value)?.oppijaOid,
                  hokseid: this.getHoksiByHoksId(value)?.hoksEid
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
          accessor: "oppijaOid"
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.opiskeluoikeusoid"
          }),
          accessor: "opiskeluoikeusOid"
        },
        {
          Header: this.context.intl.formatMessage({
            id: "raportit.oppilaitosoid"
          }),
          accessor: "oppilaitosOid"
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
            const tpjRow = row.original as TpjRow
            /*
 *export interface TpjRow {
  hoksId: number
  hoksEid: string
  opiskeluoikeusOid: string
  oppijaOid: string
  hankkimistapaTyyppi: string
  alkupvm: string
  loppupvm: string
  osaAikaisuus: number
  oppisopimuksenPerusta: string
  tyopaikanNimi: string
  ytunnus: string
  ohjaajaNimi: string
  ohjaajaEmail: string
  ohjaajaPuhelinnumero: string
  customColumn: number
}
 * */
            const trr = TyopaikkajaksoRaporttiRivi.create({
              hoksId: tpjRow?.hoksId,
              hoksEid: tpjRow?.hoksEid,
              opiskeluoikeusOid: tpjRow?.opiskeluoikeusOid,
              oppijaOid: tpjRow?.oppijaOid,
              osaamisenHankkimistapaKoodiUri: tpjRow?.hankkimistapaTyyppi,
              osaamisenHankkimistapa: {},
              alkupvm: tpjRow?.alkupvm,
              loppupvm: tpjRow?.loppupvm,
              osaAikaisuus: tpjRow?.osaAikaisuus,
              oppisopimuksenPerustaKoodiUri: tpjRow?.oppisopimuksenPerusta,
              oppisopimuksenPerusta: {},
              tyopaikanNimi: tpjRow?.tyopaikanNimi,
              ytunnus: tpjRow?.ytunnus,
              ohjaajaNimi: tpjRow?.ohjaajaNimi,
              ohjaajaEmail: tpjRow?.ohjaajaEmail,
              ohjaajaPuhelinnumero: tpjRow?.ohjaajaPuhelinnumero,
              customColumn: tpjRow?.customColumn
            })
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <InfoModal
                  nayttoymparistoDetails={trr.tyopaikanNimi}
                  startDate={trr.alkupvm}
                  endDate={trr.loppupvm}
                  partTimeAmount={trr.osaAikaisuus}
                  perusta={trr.oppisopimuksenPerusta}
                  hoksId={value}
                  opiskeluoikeusOid={trr.opiskeluoikeusOid}
                  osaamisenHankkimistapaKoodisto={trr.osaamisenHankkimistapa}
                  ytunnus={trr.ytunnus}
                  oppijaOid={trr.oppijaOid}
                  ohjaajaNimi={trr.ohjaajaNimi}
                  ohjaajaEmail={trr.ohjaajaEmail}
                  ohjaajaPuhelinnumero={trr.ohjaajaPuhelinnumero}
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
    this.props.store!.raportit.fetchTyopaikkajaksoRivit(10, 0)
  }

  checkActive = (num: number) =>
    this.state.selected === num ? "bolder" : "initial"

  render() {
    const {
      // TODO other raportit rows
      alku,
      descText,
      fetchTyopaikkajaksoRivit,
      initSearchDone,
      loading,
      loppu,
      pageCount,
      selected,
      setAlku,
      setLoppu,
      titleText,
      tyopaikkajaksoRivit
    } = this.props.store!.raportit
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
                      <RaportitTable
                        data={data}
                        columns={columns}
                        loading={this.state.loading}
                        pageCount={this.state.pageCount}
                        fetchData={this.loadHoksesWithoutOpiskeluoikeudet}
                      />
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
                        onChange={e => setAlku(e.target.value)}
                      />{" "}
                      -{" "}
                      <DateInput
                        type="date"
                        value={loppu}
                        onChange={e => setLoppu(e.target.value)}
                      />
                      <SearchButton
                        onClick={this.tpjHaeOnClick}
                        disabled={alku.length <= 0 || loppu.length <= 0}
                      >
                        Hae
                      </SearchButton>
                    </FilterBox>
                    {initSearchDone && (
                      <Styles>
                        <RaportitTable
                          data={tyopaikkajaksoRivit}
                          columns={columns}
                          loading={loading}
                          pageCount={pageCount}
                          fetchData={fetchTyopaikkajaksoRivit}
                        />
                      </Styles>
                    )}
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

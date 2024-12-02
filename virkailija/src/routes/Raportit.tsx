import { Link } from "react-router-dom"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { RaportitTable } from "components/RaportitTable"
import { HelpPopup } from "components/HelpPopup"
import { Heading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, injectIntl, IntlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { appendCommonHeaders } from "fetchUtils"
import { Button } from "components/Button"
import { InfoModal } from "components/InfoModal"
import { createColumnHelper, Column } from "@tanstack/react-table"

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

interface RaportitProps {
  store?: IRootStore
  intl: IntlShape
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
  oppilaitosOid: string
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
  data: (HoksRow | TpjRow)[]
  loading: boolean
  pageCount: number
  titleText: string
  descText: string
  selected: number
  alku: string
  loppu: string
  initSearchDone: boolean
}

class RaportitInner extends React.Component<RaportitProps> {
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
          data: json.data.result ?? [],
          loading: false,
          pageCount: json.data.pagecount
        })
      }

      if (request.status === 403) {
        notifications.addError("Raportit.EiOikeuksia", oppilaitosOid)
      }
    }
  }

  loadTyopaikkaJaksot = async (pageSize: number, pageIndex: number) => {
    const tutkinto = JSON.stringify({})
    const { store } = this.props
    const { notifications } = store!
    const oppilaitosOid: string | undefined =
      store?.session.selectedOrganisationOid
    if (this.state.alku.length && this.state.loppu.length && oppilaitosOid) {
      this.setState({
        loading: true
      })
      const request = await window.fetch(
        "/ehoks-virkailija-backend/api/v1/virkailija/tep-jakso-raportti?" +
          "tutkinto=" +
          tutkinto +
          "&oppilaitos=" +
          oppilaitosOid +
          "&start=" +
          this.state.alku +
          "&end=" +
          this.state.loppu +
          "&pagesize=" +
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
        const json: TpjFetchResult = await request.json()
        this.setState({
          data: json.data.result ?? [],
          loading: false,
          pageCount: json.data.pagecount
        })
      }

      if (request.status === 403) {
        notifications.addError("Raportit.EiOikeuksia", oppilaitosOid)
      }
      this.setState({
        initSearchDone: true
      })
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
    this.state.data?.find((x: TpjRow) => x.hoksId === hoksId) as TpjRow

  createLinkPath = (hoksId: number) => {
    const { store } = this.props
    const oppilaitosOid: string | undefined =
      store?.session.selectedOrganisationOid
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
      ? `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
          row.oppilaitosOid || oppilaitosOid
        }/oppija/${oppijaOid}/${hoksEid}`
      : "/ehoks-virkailija-ui/raportit"
  }

  setPvmDate = (type: string, value: string) => {
    const target = type === "alku" ? "alku" : "loppu"
    this.setState({
      [target]: value
    })
  }

  getColumnsForTable = (selectedRaportti: number) => {
    const { intl } = this.props
    if (selectedRaportti === 1) {
      const columnHelper = createColumnHelper<HoksRow>()
      return [
        columnHelper.accessor("hoksId", {
          header: intl.formatMessage({
            id: "raportit.ehoksid"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>
              <Link
                to={this.createLinkPath(row.original.hoksId)}
                state={{
                  fromRaportit: true,
                  oppijaoid: this.getHoksiByHoksId(row.original.hoksId)
                    ?.oppijaOid,
                  hokseid: this.getHoksiByHoksId(row.original.hoksId)?.hoksEid
                }}
              >
                {row.original.hoksId}
              </Link>
            </div>
          )
        }),
        columnHelper.accessor("oppijaOid", {
          header: intl.formatMessage({
            id: "raportit.oppijanumeroTitle"
          })
        }),
        columnHelper.accessor("opiskeluoikeusOid", {
          header: intl.formatMessage({
            id: "raportit.opiskeluoikeusoid"
          })
        }),
        columnHelper.accessor("oppilaitosOid", {
          header: intl.formatMessage({
            id: "raportit.oppilaitosoid"
          })
        })
      ]
    } else if (selectedRaportti === 2) {
      const columnHelper = createColumnHelper<TpjRow>()
      return [
        columnHelper.accessor("hoksId", {
          header: intl.formatMessage({
            id: "raportit.ehoksid"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>
              <Link
                to={this.createLinkPath(row.original.hoksId)}
                state={{
                  fromRaportit: true,
                  oppijaoid: this.getTpjRowByHoksId(row.original.hoksId)
                    ?.oppijaOid,
                  hokseid: this.getTpjRowByHoksId(row.original.hoksId)?.hoksEid
                }}
              >
                {row.original.hoksId}
              </Link>
            </div>
          )
        }),
        columnHelper.accessor("opiskeluoikeusOid", {
          header: intl.formatMessage({
            id: "raportit.opiskeluoikeusoid"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>
              {row.original.opiskeluoikeusOid}
            </div>
          )
        }),
        columnHelper.accessor("oppijaOid", {
          header: intl.formatMessage({
            id: "raportit.oppijanumeroTitle"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>{row.original.oppijaOid}</div>
          )
        }),
        columnHelper.accessor("tyopaikanNimi", {
          header: intl.formatMessage({
            id: "raportit.tyopaikannimi"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>
              {row.original.tyopaikanNimi}
            </div>
          )
        }),
        columnHelper.accessor("ohjaajaNimi", {
          header: intl.formatMessage({
            id: "raportit.ohjaajannimi"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>
              {row.original.ohjaajaNimi}
            </div>
          )
        }),
        columnHelper.accessor("alkupvm", {
          header: intl.formatMessage({
            id: "raportit.alku"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>{row.original.alkupvm}</div>
          )
        }),
        columnHelper.accessor("loppupvm", {
          header: intl.formatMessage({
            id: "raportit.loppu"
          }),
          cell: ({ row }) => (
            <div style={{ textAlign: "center" }}>{row.original.loppupvm}</div>
          )
        }),
        columnHelper.accessor("customColumn", {
          header: intl.formatMessage({
            id: "infoModal.naytaLisatiedot"
          }),
          cell: ({ row }) => {
            const tpjRow = row.original
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <InfoModal
                  nayttoymparistoDetails={tpjRow?.tyopaikanNimi}
                  startDate={tpjRow?.alkupvm}
                  endDate={tpjRow?.loppupvm}
                  partTimeAmount={tpjRow?.osaAikaisuus}
                  oppisopimuksenPerusta={tpjRow?.oppisopimuksenPerusta}
                  hoksId={tpjRow?.hoksId}
                  opiskeluoikeusOid={tpjRow?.opiskeluoikeusOid}
                  hankkimistapaTyyppi={tpjRow?.hankkimistapaTyyppi}
                  ytunnus={tpjRow?.ytunnus}
                  oppijaOid={tpjRow?.oppijaOid}
                  ohjaajaNimi={tpjRow?.ohjaajaNimi}
                  ohjaajaEmail={tpjRow?.ohjaajaEmail}
                  ohjaajaPuhelinnumero={tpjRow?.ohjaajaPuhelinnumero}
                />
              </div>
            )
          }
        })
      ]
    } else {
      return []
    }
  }

  tpjHaeOnClick = () => {
    this.loadTyopaikkaJaksot(10, 0)
  }

  checkActive = (num: number) =>
    this.state.selected === num ? "bolder" : "initial"

  render() {
    const { data, selected, titleText, descText, alku, loppu } = this.state
    const { intl } = this.props
    const columns = this.getColumnsForTable(selected) as unknown as Column<
      HoksRow | TpjRow,
      any
    >[]

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
                          id: "raportit.tyopaikkajaksoihinTallennetutTiedotInfoKuvaus"
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
                    {this.state.initSearchDone && (
                      <Styles>
                        <RaportitTable
                          data={data}
                          columns={columns}
                          loading={this.state.loading}
                          pageCount={this.state.pageCount}
                          fetchData={this.loadTyopaikkaJaksot}
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

export const Raportit = inject("store")(observer(injectIntl(RaportitInner)))

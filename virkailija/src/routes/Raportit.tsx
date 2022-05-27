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
  data: TpjRow[]
}

interface RaportitState {
  hoksitCount?: number
  data?: (HoksRow | TpjRow)[]
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

      /*
      const asd = `{"meta":{},"data":[{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.11723661101","hoksId":44757,"loppupvm":"2021-11-24","hoksEid":"a999c938-7a6d-4bd7-8e49-8f64c0674743","ytunnus":"2667304-3","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Ramin Grilli Oy","alkupvm":"2021-11-17","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Rami"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.11723661101","hoksId":44757,"loppupvm":"2021-11-24","hoksEid":"a999c938-7a6d-4bd7-8e49-8f64c0674743","ytunnus":"1873619-8","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Hesburger Espoo Espoonlahti","alkupvm":"2021-01-09","hankkimistapaTyyppi":"osaamisenhankkimistapa_oppisopimus","ohjaajaNimi":"Hessu"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.11723661101","hoksId":44757,"loppupvm":"2021-11-24","hoksEid":"a999c938-7a6d-4bd7-8e49-8f64c0674743","ytunnus":"1873619-8","oppisopimuksenPerusta":"oppisopimuksenperusta_02","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Hesburger Espoo Espoonlahti","alkupvm":"2021-01-06","hankkimistapaTyyppi":"osaamisenhankkimistapa_oppisopimus","ohjaajaNimi":"Hessu"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.11723661101","hoksId":44757,"loppupvm":"2021-11-24","hoksEid":"a999c938-7a6d-4bd7-8e49-8f64c0674743","ytunnus":"2768896-8","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Kalasataman autopesula","alkupvm":"2021-04-07","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Sami"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.11723661101","hoksId":44757,"loppupvm":"2021-11-24","hoksEid":"a999c938-7a6d-4bd7-8e49-8f64c0674743","ytunnus":"1633133-0","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Auto Sorsa Oy","alkupvm":"2021-08-08","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Sorsa"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.12321544764","hoksId":44760,"loppupvm":"2021-11-25","hoksEid":"8498e5cd-12ea-4a11-9aad-82693d654a63","ytunnus":"123456-7","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Clipper Oy","alkupvm":"2020-11-11","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Sami"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.18102874072","hoksId":44637,"ohjaajaPuhelinnumero":"+358 40 652 7518","loppupvm":"2022-04-29","hoksEid":"d16bdec8-e661-415c-8c9c-949f3c5771ef","ytunnus":"lkjh123123","tyopaikanNimi":"uusjee","alkupvm":"2022-03-16","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"kkhkgjhkgjh"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.27057906615","hoksId":44790,"loppupvm":"2022-03-01","hoksEid":"e473f1b2-464f-4241-b996-386ece7376e6","alkupvm":"2022-03-01","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"1053026-7","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Knowit Oy","alkupvm":"2021-01-01","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Knowit Ohjaaja"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"1053026-7","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Knowit Oy","alkupvm":"2021-03-02","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Knowit Ohjaaja"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"1053026-7","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Knowit Oy","alkupvm":"2021-05-04","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Knowit Ohjaaja"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"2667304-3","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Ramin Grilli Oy","alkupvm":"2021-07-07","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Rami"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"2667304-3","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Ramin Grilli Oy","alkupvm":"2021-08-08","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Rami"},{"oppijaOid":"1.2.246.562.24.98624730263","opiskeluoikeusOid":"1.2.246.562.15.34644080656","hoksId":44652,"loppupvm":"2021-11-24","hoksEid":"73fd1353-e2d8-427b-a1d3-163569b2faf7","ytunnus":"2667304-3","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"Ramin Grilli Oy","alkupvm":"2021-03-12","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Rami"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.40745434916","hoksId":44755,"loppupvm":"2021-11-24","hoksEid":"468baee5-c2cd-4ef5-b0c9-e19b5d601b32","ytunnus":"8765432-1","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"Julli@jullinjuottola.com","tyopaikanNimi":"Jullin juottola","alkupvm":"2021-11-12","hankkimistapaTyyppi":"osaamisenhankkimistapa_oppisopimus","ohjaajaNimi":"Julli"},{"oppijaOid":"1.2.246.562.24.49789387296","opiskeluoikeusOid":"1.2.246.562.15.40745434916","hoksId":44755,"loppupvm":"2021-11-24","hoksEid":"468baee5-c2cd-4ef5-b0c9-e19b5d601b32","ytunnus":"2345678-9","ohjaajaEmail":"Saara@saaransaha.com","tyopaikanNimi":"Saaran saha","alkupvm":"2021-11-17","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"Saara"},{"oppijaOid":"1.2.246.562.24.80414720776","opiskeluoikeusOid":"1.2.246.562.15.76317381846","hoksId":44773,"loppupvm":"2022-01-22","hoksEid":"3990b577-8ce4-46d7-adf2-da85044fc24c","alkupvm":"2022-01-14","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus"},{"oppijaOid":"1.2.246.562.24.37998958910","opiskeluoikeusOid":"1.2.246.562.15.78573431000","hoksId":44794,"loppupvm":"2022-04-29","hoksEid":"51a05e78-3d29-497e-9de6-ace5fb41bc3c","ytunnus":"29Testi-ytunnus","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"29Testi-tyopaikannimi","alkupvm":"2022-02-10","hankkimistapaTyyppi":"osaamisenhankkimistapa_oppisopimus","ohjaajaNimi":"29Testi Testinen"},{"oppijaOid":"1.2.246.562.24.76247627788","opiskeluoikeusOid":"1.2.246.562.15.89243433391","hoksId":44796,"loppupvm":"2022-04-29","hoksEid":"94efd927-e6f6-4ef2-90df-e3a08588ffb5","ytunnus":"29Testi-YT","oppisopimuksenPerusta":"oppisopimuksenperusta_01","ohjaajaEmail":"sami.honkanen@knowit.fi","tyopaikanNimi":"29Testi","alkupvm":"2022-01-10","hankkimistapaTyyppi":"osaamisenhankkimistapa_koulutussopimus","ohjaajaNimi":"29Testi Testinen"}]}`
      this.setState({
        data: JSON.parse(asd).data
      })
      */
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
    this.state.data?.find((x: TpjRow) => x.hoksId === hoksId) as TpjRow

  createLinkPath = (hoksid: number) => {
    let row = {} as HoksRow | TpjRow
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
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <InfoModal
                  nayttoymparistoDetails={tpjRow?.tyopaikanNimi}
                  startDate={tpjRow?.alkupvm}
                  endDate={tpjRow?.loppupvm}
                  partTimeAmount={tpjRow?.osaAikaisuus}
                  oppisopimuksenPerusta={tpjRow?.oppisopimuksenPerusta}
                  hoksId={value}
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

import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { RaportitTable } from "components/RaportitTable"
import { Heading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { appendCommonHeaders } from "fetchUtils"

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
  line-height: 30px;
  width: 20%;
  height: 100%;
  float: left;
  padding: 5px;
`

const Section = styled("div")`
  width: 80%;
  float: left;
  padding: 10px;
  margin-bottom: 10px;
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const MenuItem = styled("span")`
  margin: 0;
  padding: 5px;
`

const ItemHeader = styled("h3")`
  margin: 0;
  padding-right: 10px;
  padding-bottom: 10px;
`

const ContentElement = styled("div")`
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
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
      border-bottom: 3px solid blue;
      color: white;
      fontweight: bold;
    }
  }
`

interface RaportitProps extends RouteComponentProps {
  store?: IRootStore
}

interface SystemInfo {
  cache: { size: number }
  memory: {
    max: number
    total: number
    free: number
  }
  oppijaindex: {
    unindexedOppijat: number
    unindexedOpiskeluoikeudet: number
  }
  hoksit: {
    amount: number
  }
}

interface HoksRow {
  hoksid: number
  opiskeluoikeusoid: string
  oppilaitosoid: string
}

interface fetchResult {
  count: number
  hoksit: HoksRow[]
}

interface RaportitState {
  message: string
  hoksId?: number
  opiskeluoikeusOid?: string | ""
  oppijaOid?: string | ""
  updateOppijaOid?: string | ""
  opiskeluoikeusHakuOid?: string | ""
  opiskeluoikeusUpdateOid?: string | ""
  hoksHakuId?: number
  hoksDeleteId?: number
  hoksPalautusId?: number
  idToDelete?: number
  systemInfo?: SystemInfo
  koulutustoimijaOid?: string | ""
  sendHerateId?: number
  sendHerateDateFrom?: string
  sendHerateDateTo?: string
  sendPaattoHerateDateFrom?: string
  sendPaattoHerateDateTo?: string
  vastaajatunnusToDelete?: string
  hoksitCount?: number
  hoksitWithoutOo?: HoksRow[] | undefined | null
}

@inject("store")
@observer
export class Raportit extends React.Component<RaportitProps> {
  static contextTypes = {
    intl: intlShape
  }

  state: RaportitState = {
    message: "",
    hoksId: undefined,
    opiskeluoikeusOid: "",
    oppijaOid: "",
    updateOppijaOid: "",
    idToDelete: undefined,
    hoksPalautusId: undefined,
    systemInfo: undefined,
    opiskeluoikeusUpdateOid: "",
    koulutustoimijaOid: "",
    hoksitCount: 0,
    hoksitWithoutOo: undefined
  }

  async loadHoksesWithoutOpiskeluoikeudet(oppilaitosOid: string) {
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
      const json: fetchResult = await request.json()
      /*
      const json: fetchResult = JSON.parse(
        '{"count":5,"hoksit":[{"hoksid":36,"opiskeluoikeusoid":"1.2.246.562.15.32354803416","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":35,"opiskeluoikeusoid":"1.2.246.562.15.57320793029","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":8682,"opiskeluoikeusoid":"1.2.246.562.15.59302402942","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":37,"opiskeluoikeusoid":"1.2.246.562.15.64186192825","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":8731,"opiskeluoikeusoid":"1.2.246.562.15.88846009509","oppilaitosoid":"1.2.246.562.10.32506551657"}]}'
      )
      */
      console.log(json)
      console.log(json.count)
      console.log(json.hoksit)
      this.setState({
        hoksitCount: json.count,
        hoksitWithoutOo: json.hoksit
      })
    } else {
      console.log("fail")
    }
  }

  async componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    await this.loadHoksesWithoutOpiskeluoikeudet("1.2.246.562.10.32506551657")
  }

  render() {
    const { hoksitWithoutOo } = this.state

    const data: HoksRow[] | undefined | null = hoksitWithoutOo
    const columns = [
      {
        Header: "eHOKS ID",
        accessor: "hoksid"
      },
      {
        Header: "Opiskeluoikeus OID",
        accessor: "opiskeluoikeusoid"
      },
      {
        Header: "Oppilaitos OID",
        accessor: "oppilaitosoid"
      }
    ]

    if (hoksitWithoutOo === undefined || hoksitWithoutOo === null) return null
    return (
      <BackgroundContainer>
        <Container>
          <PaddedContent>
            <TopContainer>
              <TopHeading>
                <FormattedMessage
                  id="raportit.raportitLink"
                  defaultMessage="Raportit"
                />
              </TopHeading>
            </TopContainer>
            <ContentArea>
              <ContentElement>
                <Nav>
                  <MenuItem>Hoksit ilman OO</MenuItem>
                </Nav>
                <Section>
                  {hoksitWithoutOo && hoksitWithoutOo.length && (
                    <>
                      <ItemHeader>
                        Hoksit, joiden opiskeluoikeutta ei löydy Koskesta
                      </ItemHeader>
                      <Styles>
                        {/*
                          // @ts-ignore fix later */}
                        <RaportitTable data={data} columns={columns} />
                      </Styles>
                    </>
                  )}
                </Section>
              </ContentElement>
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

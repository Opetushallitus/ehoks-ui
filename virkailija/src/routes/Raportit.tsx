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

const linkStyle = {
  textDecoration: "none",
  color: "#3a7a10"
}

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
  hoksitWithoutOo?: HoksRow[] | []
  titleText: string
  selected: number
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
    hoksitWithoutOo: [],
    titleText: "Klikkaa valikosta haluamasi raportti",
    selected: 0
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
  }

  navClickHandler = (
    event: React.MouseEvent<HTMLAnchorElement>,
    titleText: string,
    selected: number
  ) => {
    event.preventDefault()
    // @ts-ignore Don't know how to fix
    event.target.blur()
    this.setState({
      titleText,
      selected
    })
    if (selected === 1) {
      this.loadHoksesWithoutOpiskeluoikeudet("1.2.246.562.10.32506551657")
    }
  }

  render() {
    const { hoksitWithoutOo, selected, titleText } = this.state
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
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(
                        event,
                        "Hoksit, joissa poistettu opiskeluoikeus",
                        1
                      )
                    }
                    style={linkStyle}
                  >
                    Hoksit, joissa poistettu opiskeluoikeus
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(event, "Test1", 0)
                    }
                    style={linkStyle}
                  >
                    Test1
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(event, "Testi2", 0)
                    }
                    style={linkStyle}
                  >
                    Testi2
                  </MenuItem>
                  <MenuItem
                    as="a"
                    href="#"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                      this.navClickHandler(event, "Test3", 0)
                    }
                    style={linkStyle}
                  >
                    Test3
                  </MenuItem>
                </Nav>
                <Separator />
                <Section>
                  <ItemHeader>{titleText}</ItemHeader>
                  <div
                    style={{
                      visibility: selected === 1 ? "visible" : "hidden"
                    }}
                  >
                    <Styles>
                      {/*
                          // @ts-ignore fix later */}
                      <RaportitTable data={hoksitWithoutOo} columns={columns} />
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

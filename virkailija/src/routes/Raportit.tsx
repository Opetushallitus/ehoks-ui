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

const linkStyle = {
  textDecoration: "none",
  color: "#3a7a10"
}

const HelpButton = styled(HelpPopup)`
  margin-left: 12px;
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

interface HoksRow {
  hoksid: number
  hokseid: string
  oppijaoid: string
  opiskeluoikeusoid: string
  oppilaitosoid: string
}

interface fetchResult {
  count: number
  hoksit: HoksRow[]
}

interface RaportitState {
  hoksitCount?: number
  hoksitWithoutOo?: HoksRow[] | []
  titleText: string
  descText: string
  selected: number
}

interface hoksitCell {
  cell: {
    value: number
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
    hoksitWithoutOo: [],
    titleText: "Klikkaa valikosta haluamasi raportti",
    descText: "",
    selected: 0
  }

  async loadHoksesWithoutOpiskeluoikeudet(oppilaitosOid: string | undefined) {
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
        '{"count":5,"hoksit":[{"hoksid":36,"hokseid":36,"oppijaoid":"1.2.246.562.15.32354803416","opiskeluoikeusoid":"1.2.246.562.15.32354803416","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":35,"hokseid":36,"oppijaoid":"1.2.246.562.15.32354803416","opiskeluoikeusoid":"1.2.246.562.15.57320793029","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":8682,"hokseid":36,"oppijaoid":"1.2.246.562.15.32354803416","opiskeluoikeusoid":"1.2.246.562.15.59302402942","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":37,"hokseid":36,"oppijaoid":"1.2.246.562.15.32354803416","opiskeluoikeusoid":"1.2.246.562.15.64186192825","oppilaitosoid":"1.2.246.562.10.32506551657"},{"hoksid":8731,"hokseid":36,"oppijaoid":"1.2.246.562.15.32354803416","opiskeluoikeusoid":"1.2.246.562.15.88846009509","oppilaitosoid":"1.2.246.562.10.32506551657"}]}'
      )
      */
      this.setState({
        hoksitCount: json.count,
        hoksitWithoutOo: json.hoksit
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
    event.preventDefault()
    // @ts-ignore Don't know how to fix
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
    this.state.hoksitWithoutOo?.find((x: HoksRow) => x.hoksid === hoksid)

  createLinkPath = (hoksid: number) => {
    const hoksi = this.getHoksiByHoksId(hoksid)
    return hoksi
      ? `/ehoks-virkailija-ui/koulutuksenjarjestaja/${hoksi.oppijaoid}/${hoksi?.hokseid}`
      : "/ehoks-virkailija-ui/raportit"
  }

  checkActive = (num: number) =>
    this.state.selected === num ? "bolder" : "initial"

  render() {
    const { hoksitWithoutOo, selected, titleText, descText } = this.state
    const { intl } = this.context
    const columns = [
      {
        Header: intl.formatMessage({
          id: "raportit.ehoksid"
        }),
        accessor: "hoksid",
        Cell: ({ cell: { value } }: hoksitCell) => (
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
        )
      },
      {
        Header: intl.formatMessage({
          id: "raportit.oppijanumeroTitle"
        }),
        accessor: "oppijaoid"
      },
      {
        Header: intl.formatMessage({
          id: "raportit.opiskeluoikeusoid"
        }),
        accessor: "opiskeluoikeusoid"
      },
      {
        Header: intl.formatMessage({
          id: "raportit.oppilaitosoid"
        }),
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
                </Nav>
                <Separator />
                <Section>
                  <ItemHeader>{titleText}</ItemHeader>
                  <ItemDescription>{descText}</ItemDescription>
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

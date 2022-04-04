import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { appendCommonHeaders } from "fetchUtils"

export const BackgroundContainer = styled("div")`
  background: #f8f8f8;
  min-height: 100%;
`

const TopContainer = styled("div")`
  display: flex;
  align-items: center;
  position: relative;
`

const TopHeading = styled(Heading)`
  flex: 1;
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
  hoksitWithoutOo?: fetchResult | null
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
    hoksitWithoutOo: null
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
      console.log("123")
      console.log(json.hoksit)
      //console.log(json.hoksit[0])
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
            <ContentArea>{hoksitWithoutOo && { hoksitWithoutOo }}</ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

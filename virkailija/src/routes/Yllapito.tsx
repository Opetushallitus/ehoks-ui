import { RouteComponentProps } from "@reach/router"
import { Button } from "components/Button"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

export const BackgroundContainer = styled("div")`
  background: #f8f8f8;
  height: 100%;
`

const TopContainer = styled("div")`
  display: flex;
  align-items: center;
  position: relative;
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const Spinner = styled(LoadingSpinner)`
  position: absolute;
  right: 0px;
`

const SuccessMessage = styled("div")`
  margin-left: 20px;
  color: ${props => props.theme.colors.midGreen};
`

const FailureMessage = styled("div")`
  margin-left: 20px;
  color: ${props => props.theme.colors.brick};
`

const ContentElement = styled("div")`
  display: block;
  margin-bottom: 10px;
`

const Header = styled(Heading)`
  margin: 0;
  padding-right: 10px;
`

interface YllapitoProps extends RouteComponentProps {
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

type LoadingState = "initial" | "loading" | "success" | "unsuccessful"

interface YllapitoState {
  loadingState: LoadingState
  message: string
  hoksId?: number
  opiskeluoikeusOid?: string | ""
  systemInfo?: SystemInfo
}

interface SystemInfoResponse {
  data: SystemInfo
}

@inject("store")
@observer
export class Yllapito extends React.Component<YllapitoProps> {
  static contextTypes = {
    intl: intlShape
  }

  state: YllapitoState = {
    loadingState: "initial",
    message: "",
    hoksId: undefined,
    opiskeluoikeusOid: "",
    systemInfo: undefined
  }

  async loadSystemInfo() {
    const { intl } = this.context
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/system-info",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )

    if (request.status === 200) {
      const json: SystemInfoResponse = await request.json()
      this.setState({
        loadingState: "success",
        systemInfo: json.data
      })
    } else {
      this.setState({
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.jarjestelmanTietojenLatausEpaonnistui",
          defaultMessage: "Järjestelmän tietojen lataus epäonnistui"
        })
      })
    }
  }

  async componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    await this.loadSystemInfo()
  }

  onClearCacheClicked = async () => {
    const { intl } = this.context
    this.setState({ loadingState: "loading", isLoading: true, message: "" })
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/cache",
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )

    if (request.status === 200) {
      this.setState({
        loadingState: "successfull",
        message: intl.formatMessage({
          id: "yllapito.valimuistiTyhjennetty",
          defaultMessage: "Välimuisti tyhjennetty"
        })
      })
      await this.loadSystemInfo()
    } else {
      this.setState({
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.valimuistinTyhjennysEpaonnistui",
          defaultMessage: "Välimuistin tyhjennys epäonnistui"
        })
      })
    }
  }

  onRunIndexClicked = async () => {
    const { intl } = this.context
    this.setState({ loadingState: "loading", message: "" })
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/index",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )

    if (request.status === 200) {
      this.setState({
        loadingState: "successfull",
        message: intl.formatMessage({
          id: "yllapito.indeksointiSuoritettu",
          defaultMessage: "Indeksointi suoritettu"
        })
      })
      await this.loadSystemInfo()
    } else {
      this.setState({
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.indeksointiEpaonnistui",
          defaultMessage: "Indeksointi epäonnistui"
        })
      })
    }
  }

  onGetHoksId = async (event: any) => {
    const { intl } = this.context
    const { opiskeluoikeusOid } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/opiskeluoikeus/${opiskeluoikeusOid}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )
    if (request.status === 200) {
      const json = await request.json()
      console.log(json)
      this.setState({
        success: true,
        message: intl.formatMessage({
          id: "yllapito.hoksinHakuOnnistui",
          defaultMessage: ""
        }),
        isLoading: false,
        hoksId: json.data.id
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.hoksinHakuEpaonnistui",
          defaultMessage: "Hoksin haku epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  handleOidChange = (inputOid: any) => {
    // const inputOid = event.target.value
    this.setState({
      opiskeluoikeusOid: inputOid
    })
  }

  hideMessage = () => {
    this.setState({ message: "" })
  }

  render() {
    const { loadingState, message, systemInfo } = this.state
    return (
      <BackgroundContainer>
        <Container>
          <PaddedContent>
            <TopContainer>
              <TopHeading>
                <FormattedMessage
                  id="yllapito.title"
                  defaultMessage="Ylläpito"
                />
              </TopHeading>
              {loadingState === "initial" ||
                (loadingState === "loading" && <Spinner />)}
              {loadingState === "success" ? (
                <SuccessMessage onClick={this.hideMessage}>
                  {message}
                </SuccessMessage>
              ) : (
                <FailureMessage onClick={this.hideMessage}>
                  {message}
                </FailureMessage>
              )}
            </TopContainer>
            <ContentArea>
              {systemInfo && (
                <ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.oppijaIndeksiTitle"
                        defaultMessage="Oppijaindeksi"
                      />
                    </Header>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.oppijaIndeksoimatta"
                        defaultMessage="Indeksoimatta: {unindexed} oppijaa"
                        values={{
                          unindexed: systemInfo.oppijaindex.unindexedOppijat
                        }}
                      />
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.hoksIdnHaku"
                        defaultMessage="Hoks-id:n haku"
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <input
                            type="text"
                            value={this.state.opiskeluoikeusOid}
                            onChange={e => this.handleOidChange(e.target.value)}
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onGetHoksId}>
                          <FormattedMessage
                            id="yllapito.haeHoksIdButton"
                            defaultMessage="Hae hoks-id"
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                    <FormattedMessage
                      id="yllapito.hoksIdTulos"
                      defaultMessage="Hoks-id on: {hoksId}"
                      values={{
                        hoksId: this.state.hoksId
                      }}
                    />
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.hoksienmaaraTitle"
                        defaultMessage="Hoksien lukumäärä"
                      />
                    </Header>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.hoksienmaaraArvo"
                        defaultMessage="Lukumäärä: {hoksAmount}"
                        values={{ hoksAmount: systemInfo.hoksit.amount }}
                      />
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.valimuistiTitle"
                        defaultMessage="Välimuisti"
                      />
                    </Header>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.valimuistiKoko"
                        defaultMessage="Koko: {cacheSize}"
                        values={{ cacheSize: systemInfo.cache.size }}
                      />
                    </ContentElement>
                    <ContentElement>
                      <Button onClick={this.onClearCacheClicked}>
                        <FormattedMessage
                          id="yllapito.tyhjennaValimuisti"
                          defaultMessage="Tyhjennä välimuisti"
                        />
                      </Button>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.muistiTitle"
                        defaultMessage="Muisti"
                      />
                    </Header>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.muistiYhteensa"
                        defaultMessage="Yhteensä: {total} MB"
                        values={{
                          total: Math.floor(systemInfo.memory.total / 1000000)
                        }}
                      />
                    </ContentElement>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.muistiVapaana"
                        defaultMessage="Vapaana: {free} MB"
                        values={{
                          free: Math.floor(systemInfo.memory.free / 1000000)
                        }}
                      />
                    </ContentElement>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.muistiMaksimi"
                        defaultMessage="Maksimi: {max} MB"
                        values={{
                          max: Math.floor(systemInfo.memory.max / 1000000)
                        }}
                      />
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.oppijaIndeksiTitle"
                        defaultMessage="Oppijaindeksi"
                      />
                    </Header>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.oppijaIndeksoimatta"
                        defaultMessage="Indeksoimatta: {unindexed} oppijaa"
                        values={{
                          unindexed: systemInfo.oppijaindex.unindexedOppijat
                        }}
                      />
                    </ContentElement>
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.opiskeluoikeusIndeksoimatta"
                        defaultMessage="Indeksoimatta: {unindexed} opiskeluoikeutta"
                        values={{
                          unindexed:
                            systemInfo.oppijaindex.unindexedOpiskeluoikeudet
                        }}
                      />
                    </ContentElement>
                    <Button onClick={this.onRunIndexClicked}>
                      <FormattedMessage
                        id="yllapito.oppijaIndex"
                        defaultMessage="Indeksoi oppijat ja opiskeluoikeudet"
                      />
                    </Button>
                  </ContentElement>
                </ContentElement>
              )}
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

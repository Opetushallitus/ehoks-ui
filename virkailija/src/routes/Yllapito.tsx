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
import { RouteComponentProps } from "@reach/router"

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
}

interface YllapitoState {
  isLoading: boolean
  message: string
  success: boolean
  systemInfo?: SystemInfo | null
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
    isLoading: false,
    message: "",
    success: false,
    systemInfo: null
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
        success: true,
        systemInfo: json.data,
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.jarjestelmanTietojenLatausEpaonnistui",
          defaultMessage: "Järjestelmän tietojen lataus epäonnistui"
        }),
        isLoading: false
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
    this.setState({ isLoading: true, message: "" })
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
        success: true,
        message: intl.formatMessage({
          id: "yllapito.valimuistiTyhjennetty",
          defaultMessage: "Välimuisti tyhjennetty"
        }),
        isLoading: false
      })
      await this.loadSystemInfo()
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.valimuistinTyhjennysEpaonnistui",
          defaultMessage: "Välimuistin tyhjennys epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  onRunIndexClicked = async () => {
    const { intl } = this.context
    this.setState({ isLoading: true, message: "" })
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
        success: true,
        message: intl.formatMessage({
          id: "yllapito.indeksointiSuoritettu",
          defaultMessage: "Indeksointi suoritettu"
        }),
        isLoading: false
      })
      await this.loadSystemInfo()
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.indeksointiEpaonnistui",
          defaultMessage: "Indeksointi epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  hideMessage = () => {
    this.setState({ message: "" })
  }

  render() {
    const { isLoading, message, success, systemInfo } = this.state
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
              {isLoading && <Spinner />}
              {success ? (
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

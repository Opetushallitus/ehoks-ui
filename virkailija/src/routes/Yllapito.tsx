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

const HakuInput = styled("input")`
  width: 100%;
  max-width: 11rem;
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
  oppijaOid?: string | ""
  updateOppijaOid?: string | ""
  opiskeluoikeusHakuOid?: string | ""
  opiskeluoikeusUpdateOid?: string | ""
  hoksHakuId?: number
  hoksDeleteId?: number
  idToDelete?: number
  systemInfo?: SystemInfo
  koulutustoimijaOid?: string | ""
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
    oppijaOid: "",
    updateOppijaOid: "",
    idToDelete: undefined,
    systemInfo: undefined,
    opiskeluoikeusUpdateOid: "",
    koulutustoimijaOid: ""
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
      this.setState({
        success: true,
        message: intl.formatMessage({
          id: "yllapito.hoksinHakuOnnistui",
          defaultMessage: "Hoksin haku onnistui"
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

  onGetOpiskeluoikeusOid = async (event: any) => {
    const { intl } = this.context
    const { hoksHakuId } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${hoksHakuId}`,
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
      this.setState({
        success: true,
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenHakuOnnistui",
          defaultMessage: "Opiskeluoikeuden haku onnistui"
        }),
        isLoading: false,
        opiskeluoikeusHakuOid: json.data["opiskeluoikeus-oid"],
        oppijaOid: json.data["oppija-oid"]
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenHakuEpaonnistui",
          defaultMessage: "Opiskeluoikeuden haku epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  onDeleteHoks = async (event: any) => {
    const { intl } = this.context
    const { idToDelete } = this.state
    event.preventDefault()
    const confirmRequest = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${idToDelete}/deletion-info`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )
    if (confirmRequest.status === 200) {
      const json = await confirmRequest.json()
      const {
        nimi,
        tutkinnonNimi,
        opiskeluoikeusOid,
        oppilaitosOid,
        oppilaitosNimi,
        hoksId
      } = json.data
      if (
        window.confirm(
          this.context.intl.formatMessage(
            {
              id: "yllapito.hoksinPoistoVarmistus",
              defaultMessage:
                "Oletko varma että haluat poistaa seuraavan HOKSin:\n\n" +
                "hoks-id: {hoksId}\n" +
                "oppijan nimi: {nimi}\n" +
                "tutkinnon nimi: {tutkinnonNimi}\n" +
                "opiskeluoikeus-oid: {opiskeluoikeusOid}\n" +
                "oppilaitoksen nimi: {oppilaitosNimi}\n" +
                "oppilaitos-oid: {oppilaitosOid}\n\n" +
                "Poistamisen jälkeen tietoja ei voi palauttaa."
            },
            {
              hoksId,
              nimi,
              tutkinnonNimi:
                tutkinnonNimi[this.props.store!.translations.activeLocale],
              opiskeluoikeusOid,
              oppilaitosNimi:
                oppilaitosNimi[this.props.store!.translations.activeLocale],
              oppilaitosOid
            }
          )
        )
      ) {
        const deleteRequest = await window.fetch(
          `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${idToDelete}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              Accept: "application/json; charset=utf-8",
              "Content-Type": "application/json"
            }
          }
        )
        if (deleteRequest.status === 200) {
          this.setState({
            success: true,
            message: intl.formatMessage({
              id: "yllapito.hoksinPoistoOnnistui",
              defaultMessage: "HOKSin poistaminen onnistui"
            }),
            isLoading: false
          })
        } else {
          this.setState({
            success: false,
            message: intl.formatMessage({
              id: "yllapito.hoksinPoistoEpaonnistui",
              defaultMessage: "HOKSin poistaminen epäonnistui"
            }),
            isLoading: false
          })
        }
      }
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.hoksinVahvistustietojenHakuEpaonnistui",
          defaultMessage:
            "HOKSin poistamisen vahvistustietojen hakeminen epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  onUpdateOpiskeluoikeus = async (event: any) => {
    const { intl } = this.context
    const { opiskeluoikeusUpdateOid } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/opiskeluoikeus/update`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "opiskeluoikeus-oid": opiskeluoikeusUpdateOid
        })
      }
    )
    if (request.status === 204) {
      this.setState({
        success: true,
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenPaivitysOnnistui",
          defaultMessage: "Opiskeluoikeuden päivitys onnistui"
        }),
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenPaivitysEpaonnistui",
          defaultMessage: "Opiskeluoikeuden päivitys epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  onUpdateOpiskeluoikeudet = async (event: any) => {
    const { intl } = this.context
    const { koulutustoimijaOid } = this.state
    event.preventDefault()
    const confirmRequest = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/opiskeluoikeudet/${koulutustoimijaOid}/deletion-info`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        }
      }
    )
    if (confirmRequest.status === 200) {
      const json = await confirmRequest.json()
      const amount = json.data
      console.log(amount)
      if (
        window.confirm(
          this.context.intl.formatMessage(
            {
              id: "yllapito.uudelleenIndeksointiVarmistus",
              defaultMessage:
                "Päivitettäviä opiskeluoikeuksia on yhteensä {amount} kappaletta.\n" +
                "Oletko varma, että haluat poistaa ja hakea opiskeluoikeudet\n" +
                "uudestaan?\n"
            },
            {
              amount
            }
          )
        )
      ) {
        const updateRequest = await window.fetch(
          `/ehoks-virkailija-backend/api/v1/virkailija/opiskeluoikeudet/update`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              Accept: "application/json; charset=utf-8",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "koulutustoimija-oid": koulutustoimijaOid
            })
          }
        )
        if (updateRequest.status === 204) {
          this.setState({
            success: true,
            message: intl.formatMessage({
              id: "yllapito.opiskeluoikeuksienPaivitysOnnistui",
              defaultMessage: "Poisto ja uudelleenindeksointi aloitettu"
            }),
            isLoading: false
          })
        } else {
          this.setState({
            success: false,
            message: intl.formatMessage({
              id: "yllapito.opiskeluoikeuksienPaivitysEpaonnistui",
              defaultMessage: "Poisto ja uudelleenindeksointi epäonnistui."
            }),
            isLoading: false
          })
        }
      }
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeuksienVahvistustietojenHakuEpaonnistui",
          defaultMessage:
            "Opikseluoikeuksien vahvistustietojen hakeminen epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  onUpdateOppija = async () => {
    const { intl } = this.context
    const { updateOppijaOid } = this.state
    const updateRequest = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppija/update`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "oppija-oid": updateOppijaOid
        })
      }
    )
    if (updateRequest.status === 204) {
      this.setState({
        success: true,
        message: intl.formatMessage({
          id: "yllapito.oppijaPaivitetty",
          defaultMessage: "Opiskeluoikeuden päivitys onnistui"
        }),
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.oppijanPaivitysEpaonnistui",
          defaultMessage: "Oppijan päivitys epäonnistui"
        }),
        isLoading: false
      })
    }
  }

  handleHoksIdChange = (inputId: any) => {
    // const inputOid = event.target.value
    this.setState({
      hoksHakuId: inputId
    })
  }
  handleOidChange = (inputOid: any) => {
    // const inputOid = event.target.value
    this.setState({
      opiskeluoikeusOid: inputOid
    })
  }
  handleUpdateOidChange = (inputOid: any) => {
    this.setState({
      opiskeluoikeusUpdateOid: inputOid
    })
  }
  handleDeleteIdChange = (inputId: any) => {
    this.setState({
      idToDelete: inputId
    })
  }

  handlekoulutustoimijaOidChange = (inputOid: any) => {
    this.setState({
      koulutustoimijaOid: inputOid
    })
  }

  handleUpdateOppijaOidChange = (inputOid: any) => {
    this.setState({
      updateOppijaOid: inputOid
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
                          <HakuInput
                            type="text"
                            placeholder="1.2.345.678.98.76543212345"
                            value={this.state.opiskeluoikeusOid}
                            onChange={e => this.handleOidChange(e.target.value)}
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onGetHoksId}>
                          <FormattedMessage
                            id="yllapito.haeHoksIdButton"
                            defaultMessage="Hae hoks-id opiskeluoikeus-oid:llä"
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
                        id="yllapito.opiskeluoikeusOidHaku"
                        defaultMessage="Opiskeluoikeus-oid:n haku"
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="text"
                            placeholder="12345"
                            value={this.state.hoksHakuId}
                            onChange={e =>
                              this.handleHoksIdChange(e.target.value)
                            }
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onGetOpiskeluoikeusOid}>
                          <FormattedMessage
                            id="yllapito.haeOpiskeluoikeusOidButton"
                            defaultMessage="Hae opiskeluoikeus hoks-id:llä"
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                    <FormattedMessage
                      id="yllapito.OpiskeluoikeusOidTulos"
                      defaultMessage="Opiskeluoikeus-oid on: {opiskeluoikeusOid}"
                      values={{
                        opiskeluoikeusOid: this.state.opiskeluoikeusHakuOid
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="yllapito.OppijaOidTulos"
                      defaultMessage="Oppija-oid on: {oppijaOid}"
                      values={{ oppijaOid: this.state.oppijaOid }}
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
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.hoksPoisto"
                        defaultMessage="Aiheettoman HOKSin poisto"
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="text"
                            placeholder="12345"
                            value={this.state.hoksDeleteId}
                            onChange={e =>
                              this.handleDeleteIdChange(e.target.value)
                            }
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onDeleteHoks}>
                          <FormattedMessage
                            id="yllapito.poistaHoksButton"
                            defaultMessage="Poista HOKS"
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.opiskeluoikeusPaivitys"
                        defaultMessage="Päivitä opiskeluoikeus indeksiin Koskesta."
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="text"
                            placeholder="1.2.345.678.98.76543212345"
                            value={this.state.opiskeluoikeusUpdateOid}
                            onChange={e =>
                              this.handleUpdateOidChange(e.target.value)
                            }
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onUpdateOpiskeluoikeus}>
                          <FormattedMessage
                            id="yllapito.updateOpiskeluoikeusButton"
                            defaultMessage="Päivitä opiskeluoikeuden tiedot opiskeluoikeus-indeksiin."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.opiskeluoikeuksienPaivitys"
                        defaultMessage="Päivitä koulutustoimijan opiskeluoikeudet indeksiin Koskesta."
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="text"
                            placeholder="1.2.345.678.98.76543212345"
                            value={this.state.koulutustoimijaOid}
                            onChange={e =>
                              this.handlekoulutustoimijaOidChange(
                                e.target.value
                              )
                            }
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onUpdateOpiskeluoikeudet}>
                          <FormattedMessage
                            id="yllapito.updateOpiskeluoikeudetButton"
                            defaultMessage="Päivitä opiskeluoikeudet."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.oppijanPaivitys"
                        defaultMessage="Päivitä oppijan tiedot indeksiin Oppijanumerorekisteristä."
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="text"
                            placeholder="1.2.345.678.98.76543212345"
                            value={this.state.updateOppijaOid}
                            onChange={e =>
                              this.handleUpdateOppijaOidChange(e.target.value)
                            }
                          />
                        </form>
                      </ContentElement>
                      <ContentElement>
                        <Button onClick={this.onUpdateOppija}>
                          <FormattedMessage
                            id="yllapito.paivitaOppija"
                            defaultMessage="Paivita oppijan tiedot indeksiin."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
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

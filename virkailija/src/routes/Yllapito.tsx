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

const ButtonContainer = styled("div")`
  display: flex;
  margin-bottom: 10px;
`

const MiniLink = styled("button")`
  margin-left: 10px;
  font-size: x-small;
  cursor: pointer;
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

interface SystemInfoCache {
  size: number
}

interface SystemInfoMemory {
  max: number
  total: number
  free: number
}

interface SystemInfoOppijaindex {
  unindexedOppijat: number
  unindexedOpiskeluoikeudet: number
}

interface SystemInfoHoksit {
  amount: number
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
  hoksPalautusId?: number
  idToDelete?: number
  cache?: SystemInfoCache
  memory?: SystemInfoMemory
  oppijaindex?: SystemInfoOppijaindex
  hoksit?: SystemInfoHoksit
  koulutustoimijaOid?: string | ""
  sendHerateId?: number
  sendPaattoHerateId?: number
  sendHerateDateFrom?: string
  sendHerateDateTo?: string
  sendPaattoHerateDateFrom?: string
  sendPaattoHerateDateTo?: string
  vastaajatunnusToDelete?: string
  currentActionId?: string
}

interface SystemInfoCacheResponse {
  data: SystemInfoCache
}
interface SystemInfoMemoryResponse {
  data: SystemInfoMemory
}
interface SystemInfoOppijaindexResponse {
  data: SystemInfoOppijaindex
}
interface SystemInfoHoksitResponse {
  data: SystemInfoHoksit
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
    hoksPalautusId: undefined,
    cache: undefined,
    memory: undefined,
    oppijaindex: undefined,
    hoksit: undefined,
    opiskeluoikeusUpdateOid: "",
    koulutustoimijaOid: ""
  }

  async loadSystemInfo(type: string) {
    const { intl } = this.context
    this.setState({ loadingState: "loading", isLoading: true, message: "" })
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/system-info/" + type,
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
      const json:
        | SystemInfoCacheResponse
        | SystemInfoMemoryResponse
        | SystemInfoOppijaindexResponse
        | SystemInfoHoksitResponse = await request.json()
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.jarjestelmanTietojenLatausOnnistui",
          defaultMessage: "Järjestelmän tietojen lataus onnistui"
        }),
        currentActionId: type,
        [type]: json.data
      })
    } else {
      this.setState({
        success: false,
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
  }

  onClearCacheClicked = async () => {
    const { intl } = this.context
    this.setState({ loadingState: "loading", isLoading: true, message: "" })
    const request = await window.fetch(
      "/ehoks-virkailija-backend/api/v1/virkailija/cache",
      {
        method: "DELETE",
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
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.valimuistiTyhjennetty",
          defaultMessage: "Välimuisti tyhjennetty"
        }),
        currentActionId: "clearCache"
      })
      await this.loadSystemInfo("cache")
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.valimuistinTyhjennysEpaonnistui",
          defaultMessage: "Välimuistin tyhjennys epäonnistui"
        }),
        currentActionId: "clearCache"
      })
    }
  }

  onRemoveVastaajatunnusClicked = async () => {
    const { intl } = this.context
    this.setState({ loadingState: "loading", isLoading: true, message: "" })
    const { vastaajatunnusToDelete } = this.state
    const confirmRequest = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/vastaajatunnus/${vastaajatunnusToDelete}`,
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

    const confirmJson = await confirmRequest.json()
    if (confirmRequest.status === 200) {
      if (confirmJson.data.vastattu) {
        this.setState({
          success: false,
          message: intl.formatMessage({
            id: "yllapito.kyselyynOnJoVastattu",
            defaultMessage: "Kyselyyn on jo vastattu"
          }),
          isLoading: false,
          loadingState: "unsuccessful",
          currentActionId: "removeVastaajatunnus"
        })
      } else if (
        window.confirm(
          this.context.intl.formatMessage(
            {
              id: "yllapito.vastaajatunnuksenPoistoVarmistus",
              defaultMessage:
                "Olet poistaamassa vastaajatunnuksen seuraavilla tiedoilla:\n\n" +
                "Oppijan nimi: {oppijanNimi}\n" +
                "Oppija-OID: {oppijanOid}\n" +
                "Koulutuksen järjestäjä: {koulutustoimijanNimi}\n" +
                "Koulutustoimija-OID: {koulutustoimijanOid}\n" +
                "Opiskeluoikeus-OID: {opiskeluoikeus}\n" +
                "HOKS-ID: {hoksId}\n" +
                "Kyselytyyppi: {kyselytyyppi}\n" +
                "Herätepäivä: {heratepvm}\n\n" +
                "Poistettua vastaajatunnusta ei voi palauttaa."
            },
            {
              oppijanNimi: confirmJson.data["oppijan-nimi"],
              oppijanOid: confirmJson.data["oppijan-oid"],
              koulutustoimijanNimi:
                confirmJson.data["koulutustoimijan-nimi"][
                  this.props.store!.translations.activeLocale
                ] || confirmJson.data["koulutustoimijan-nimi"].fi,
              koulutustoimijanOid: confirmJson.data["koulutustoimijan-oid"],
              opiskeluoikeus: confirmJson.data["opiskeluoikeus-oid"],
              hoksId: confirmJson.data["hoks-id"],
              kyselytyyppi: this.context.intl.formatMessage({
                id:
                  "tavoitteet.opiskelijapalauteTyyppi." +
                  (confirmJson.data.tyyppi || "").replaceAll("_", "")
              }),
              heratepvm: this.context.intl.formatDate(
                new Date(confirmJson.data.alkupvm),
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric"
                }
              )
            }
          )
        )
      ) {
        const request = await window.fetch(
          `/ehoks-virkailija-backend/api/v1/virkailija/vastaajatunnus/${vastaajatunnusToDelete}`,
          {
            method: "DELETE",
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
          this.setState({
            success: true,
            message: intl.formatMessage({
              id: "yllapito.vastaajatunnuksenPoistaminenOnnistui",
              defaultMessage: "Tunnuksen poistaminen onnistui"
            }),
            isLoading: false,
            loadingState: "success",
            currentActionId: "removeVastaajatunnus"
          })
        } else {
          const json = await request.json()
          if (json.error === "Survey ID cannot be removed") {
            this.setState({
              success: false,
              message: intl.formatMessage({
                id: "yllapito.vastaajatunnusEiPoistettavissa",
                defaultMessage: "Tunnus ei ole poistettavissa"
              }),
              isLoading: false,
              loadingState: "unsuccessful",
              currentActionId: "removeVastaajatunnus"
            })
          } else {
            this.setState({
              success: false,
              message: intl.formatMessage({
                id: "yllapito.vastaajatunnuksenPoistaminenEpaonnistui",
                defaultMessage: "Tunnuksen poistaminen epäonnistui"
              }),
              isLoading: false,
              loadingState: "unsuccessful",
              currentActionId: "removeVastaajatunnus"
            })
          }
        }
      }
    } else {
      if (confirmJson.error === "Survey ID not found") {
        this.setState({
          success: false,
          message: intl.formatMessage({
            id: "yllapito.vastaajatunnusVirheellinen",
            defaultMessage: "Tunnus virheellinen"
          }),
          isLoading: false,
          loadingState: "unsuccessful",
          currentActionId: "removeVastaajatunnus"
        })
      } else {
        this.setState({
          success: false,
          message: intl.formatMessage({
            id: "yllapito.vastaajatunnuksenHakuEpaonnistui",
            defaultMessage: "Tunnuksen haku epäonnistui"
          }),
          isLoading: false,
          loadingState: "unsuccessful",
          currentActionId: "removeVastaajatunnus"
        })
      }
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )

    if (request.status === 200) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.indeksointiSuoritettu",
          defaultMessage: "Indeksointi suoritettu"
        }),
        currentActionId: "runIndex"
      })
      await this.loadSystemInfo("oppijaindex")
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.indeksointiEpaonnistui",
          defaultMessage: "Indeksointi epäonnistui"
        }),
        currentActionId: "runIndex"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (request.status === 200) {
      const json = await request.json()
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.hoksinHakuOnnistui",
          defaultMessage: "Hoksin haku onnistui"
        }),
        isLoading: false,
        hoksId: json.data.id,
        currentActionId: "getHoksId"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.hoksinHakuEpaonnistui",
          defaultMessage: "Hoksin haku epäonnistui"
        }),
        isLoading: false,
        currentActionId: "getHoksId"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (request.status === 200) {
      const json = await request.json()
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenHakuOnnistui",
          defaultMessage: "Opiskeluoikeuden haku onnistui"
        }),
        isLoading: false,
        opiskeluoikeusHakuOid: json.data["opiskeluoikeus-oid"],
        oppijaOid: json.data["oppija-oid"],
        currentActionId: "getOpiskeluoikeusOid"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenHakuEpaonnistui",
          defaultMessage: "Opiskeluoikeuden haku epäonnistui"
        }),
        isLoading: false,
        currentActionId: "getOpiskeluoikeusOid"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
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
            headers: appendCommonHeaders(
              new Headers({
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json"
              })
            )
          }
        )
        if (deleteRequest.status === 200) {
          this.setState({
            success: true,
            loadingState: "success",
            message: intl.formatMessage({
              id: "yllapito.hoksinPoistoOnnistui",
              defaultMessage: "HOKSin poistaminen onnistui"
            }),
            isLoading: false,
            currentActionId: "deleteHoks"
          })
        } else {
          this.setState({
            success: false,
            loadingState: "unsuccessful",
            message: intl.formatMessage({
              id: "yllapito.hoksinPoistoEpaonnistui",
              defaultMessage: "HOKSin poistaminen epäonnistui"
            }),
            isLoading: false,
            currentActionId: "deleteHoks"
          })
        }
      }
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.hoksinVahvistustietojenHakuEpaonnistui",
          defaultMessage:
            "HOKSin poistamisen vahvistustietojen hakeminen epäonnistui"
        }),
        isLoading: false,
        currentActionId: "deleteHoks"
      })
    }
  }

  onPalautaHoks = async (event: any) => {
    const { intl } = this.context
    const { hoksPalautusId } = this.state
    event.preventDefault()
    const palautaRequest = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${hoksPalautusId}/undo-shallow-delete`,
      {
        method: "PATCH",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (palautaRequest.status === 200) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.hoksinPalautusOnnistui",
          defaultMessage: "HOKSin palautus onnistui"
        }),
        isLoading: false,
        currentActionId: "palautaHoks"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.hoksinPalautusEpaonnistui",
          defaultMessage: "HOKSin palautus epäonnistui"
        }),
        isLoading: false,
        currentActionId: "palautaHoks"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        ),
        body: JSON.stringify({
          "opiskeluoikeus-oid": opiskeluoikeusUpdateOid
        })
      }
    )
    if (request.status === 204) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenPaivitysOnnistui",
          defaultMessage: "Opiskeluoikeuden päivitys onnistui"
        }),
        isLoading: false,
        currentActionId: "updateOpiskeluoikeus"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeudenPaivitysEpaonnistui",
          defaultMessage: "Opiskeluoikeuden päivitys epäonnistui"
        }),
        isLoading: false,
        currentActionId: "updateOpiskeluoikeus"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (confirmRequest.status === 200) {
      const json = await confirmRequest.json()
      const amount = json.data

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
            headers: appendCommonHeaders(
              new Headers({
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json"
              })
            ),
            body: JSON.stringify({
              "koulutustoimija-oid": koulutustoimijaOid
            })
          }
        )
        if (updateRequest.status === 204) {
          this.setState({
            success: true,
            loadingState: "success",
            message: intl.formatMessage({
              id: "yllapito.opiskeluoikeuksienPaivitysOnnistui",
              defaultMessage: "Poisto ja uudelleenindeksointi aloitettu"
            }),
            isLoading: false,
            currentActionId: "updateOpiskeluoikeudet"
          })
        } else {
          this.setState({
            success: false,
            loadingState: "unsuccessful",
            message: intl.formatMessage({
              id: "yllapito.opiskeluoikeuksienPaivitysEpaonnistui",
              defaultMessage: "Poisto ja uudelleenindeksointi epäonnistui."
            }),
            isLoading: false,
            currentActionId: "updateOpiskeluoikeudet"
          })
        }
      }
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.opiskeluoikeuksienVahvistustietojenHakuEpaonnistui",
          defaultMessage:
            "Opikseluoikeuksien vahvistustietojen hakeminen epäonnistui"
        }),
        isLoading: false,
        currentActionId: "updateOpiskeluoikeudet"
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        ),
        body: JSON.stringify({
          "oppija-oid": updateOppijaOid
        })
      }
    )
    if (updateRequest.status === 204) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.oppijaPaivitetty",
          defaultMessage: "Opiskeluoikeuden päivitys onnistui"
        }),
        isLoading: false,
        currentActionId: "updateOppija"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.oppijanPaivitysEpaonnistui",
          defaultMessage: "Oppijan päivitys epäonnistui"
        }),
        isLoading: false,
        currentActionId: "updateOppija"
      })
    }
  }

  onSendHerate = async (event: any) => {
    const { intl } = this.context
    const { sendHerateId } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${sendHerateId}/resend-aloitusherate`,
      {
        method: "POST",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (request.status === 204) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.herateLahetysOnnistui",
          defaultMessage: "Herätteen lähetys onnistui"
        }),
        isLoading: false,
        currentActionId: "sendHerate"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.herateLahetysEpaonnistui",
          defaultMessage: "Herätteen lähetys epäonnistui"
        }),
        isLoading: false,
        currentActionId: "sendHerate"
      })
    }
  }

  onSendPaattoHerate = async (event: any) => {
    const { intl } = this.context
    const { sendPaattoHerateId } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/${sendPaattoHerateId}/resend-paattoherate`,
      {
        method: "POST",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
      }
    )
    if (request.status === 204) {
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage({
          id: "yllapito.herateLahetysOnnistui",
          defaultMessage: "Herätteen lähetys onnistui"
        }),
        isLoading: false,
        currentActionId: "sendPaattoHerate"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.herateLahetysEpaonnistui",
          defaultMessage: "Herätteen lähetys epäonnistui"
        }),
        isLoading: false,
        currentActionId: "sendPaattoHerate"
      })
    }
  }

  onSendHeratteetBetween = async (event: any) => {
    const { intl } = this.context
    const { sendHerateDateFrom, sendHerateDateTo } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/resend-aloitusherate?from=${sendHerateDateFrom}&to=${sendHerateDateTo}`,
      {
        method: "POST",
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
      const json = await request.json()
      const count = json.data.count
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage(
          {
            id: "yllapito.heratteetLahetysOnnistui",
            defaultMessage: "Lähetettiin {count} herätettä"
          },
          { count }
        ),
        isLoading: false,
        currentActionId: "sendHeratteetBetween"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.heratteetLahetysEpaonnistui",
          defaultMessage: "Virhe herätteiden uudelleenlähetyksessä!"
        }),
        isLoading: false,
        currentActionId: "sendHeratteetBetween"
      })
    }
  }

  onSendPaattoHeratteetBetween = async (event: any) => {
    const { intl } = this.context
    const { sendPaattoHerateDateFrom, sendPaattoHerateDateTo } = this.state
    event.preventDefault()
    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/hoks/resend-paattoherate?from=${sendPaattoHerateDateFrom}&to=${sendPaattoHerateDateTo}`,
      {
        method: "POST",
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
      const json = await request.json()
      const count = json.data.count
      this.setState({
        success: true,
        loadingState: "success",
        message: intl.formatMessage(
          {
            id: "yllapito.heratteetLahetysOnnistui",
            defaultMessage: "Lähetettiin {count} herätettä"
          },
          { count }
        ),
        isLoading: false,
        currentActionId: "sendPaattoHeratteetBetween"
      })
    } else {
      this.setState({
        success: false,
        loadingState: "unsuccessful",
        message: intl.formatMessage({
          id: "yllapito.heratteetLahetysEpaonnistui",
          defaultMessage: "Virhe herätteiden uudelleenlähetyksessä!"
        }),
        isLoading: false,
        currentActionId: "sendPaattoHeratteetBetween"
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

  handlePalautaIdChange = (inputId: any) => {
    this.setState({
      hoksPalautusId: inputId
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

  handleSendHerateIdChange = (inputId: any) => {
    this.setState({
      sendHerateId: inputId
    })
  }

  handleSendPaattoHerateIdChange = (inputId: any) => {
    this.setState({
      sendPaattoHerateId: inputId
    })
  }

  handleSendHerateDateFromChange = (dateFrom: any) => {
    this.setState({
      sendHerateDateFrom: dateFrom
    })
  }

  handleSendHerateDateToChange = (dateTo: any) => {
    this.setState({
      sendHerateDateTo: dateTo
    })
  }

  handleSendPaattoHerateDateFromChange = (dateFrom: any) => {
    this.setState({
      sendPaattoHerateDateFrom: dateFrom
    })
  }

  handleSendPaattoHerateDateToChange = (dateTo: any) => {
    this.setState({
      sendPaattoHerateDateTo: dateTo
    })
  }

  handleVastaajatunnusToDeleteChange = (vastaajatunnus: any) => {
    this.setState({
      vastaajatunnusToDelete: vastaajatunnus
    })
  }

  hideMessage = () => {
    this.setState({ message: "" })
  }

  getMemoryAmount = (type: string) => {
    if (!this.state.memory) {
      return "-"
    } else {
      if (type === "total") {
        return Math.floor(this.state.memory.total / 1000000)
      } else if (type === "free") {
        return Math.floor(this.state.memory.free / 1000000)
      } else if (type === "max") {
        return Math.floor(this.state.memory.max / 1000000)
      } else {
        return `unknown type: ${type}`
      }
    }
  }

  render() {
    const {
      currentActionId,
      loadingState,
      message,
      cache,
      memory,
      oppijaindex,
      hoksit
    } = this.state

    const actionSuccessFailureMessage = (actionId: string) =>
      actionId !== currentActionId ? null : loadingState === "success" ? (
        <SuccessMessage onClick={this.hideMessage}>{message}</SuccessMessage>
      ) : (
        <FailureMessage onClick={this.hideMessage}>{message}</FailureMessage>
      )

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
              <ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.hoksIdnHaku"
                      defaultMessage="Hoks-id:n haku"
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.hoksIdKuvaus"
                    defaultMessage="Hae HOKSin ID opiskeluoikeuden ID:llä."
                  />
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
                    <ButtonContainer>
                      <Button onClick={this.onGetHoksId}>
                        <FormattedMessage
                          id="yllapito.haeHoksIdButton"
                          defaultMessage="Hae hoks-id opiskeluoikeus-oid:llä"
                        />
                      </Button>
                      {actionSuccessFailureMessage("getHoksId")}
                    </ButtonContainer>
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
                  <FormattedMessage
                    id="yllapito.opiskeluoikeusOidHakuKuvaus"
                    defaultMessage={
                      "Hae opiskeluoikeuden ID ja oppijan ID HOKSin ID:llä."
                    }
                  />
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
                    <ButtonContainer>
                      <Button onClick={this.onGetOpiskeluoikeusOid}>
                        <FormattedMessage
                          id="yllapito.haeOpiskeluoikeusOidButton"
                          defaultMessage="Hae opiskeluoikeus hoks-id:llä"
                        />
                      </Button>
                      {actionSuccessFailureMessage("getOpiskeluoikeusOid")}
                    </ButtonContainer>
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
                  <FormattedMessage
                    id="yllapito.hoksienMaaraKuvaus"
                    defaultMessage='Näyttää aktiivisten HOKSien määrän.  Klikkaa "Lataa järjestelmän tiedot" -painiketta ladataksesi tiedot.'
                  />
                  <ContentElement>
                    <FormattedMessage
                      id="yllapito.hoksienmaaraArvo"
                      defaultMessage="Lukumäärä: {hoksAmount}"
                      values={{ hoksAmount: hoksit?.amount }}
                    />
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.valimuistiTitle"
                      defaultMessage="Välimuisti"
                    />
                    <MiniLink onClick={() => this.loadSystemInfo("cache")}>
                      Lataa tiedot
                    </MiniLink>
                  </Header>
                  <FormattedMessage
                    id="yllapito.valimuistiKuvaus"
                    defaultMessage="Välimuistin koko ja tyhjennys."
                  />
                  <br />
                  {cache && (
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.valimuistiKoko"
                        defaultMessage="Koko: {cacheSize}"
                        values={{ cacheSize: cache?.size }}
                      />
                    </ContentElement>
                  )}
                  <ButtonContainer>
                    <Button onClick={this.onClearCacheClicked}>
                      <FormattedMessage
                        id="yllapito.tyhjennaValimuisti"
                        defaultMessage="Tyhjennä välimuisti"
                      />
                    </Button>
                    {actionSuccessFailureMessage("clearCache")}
                  </ButtonContainer>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.muistiTitle"
                      defaultMessage="Muisti"
                    />
                    <MiniLink onClick={() => this.loadSystemInfo("memory")}>
                      Lataa tiedot
                    </MiniLink>
                  </Header>
                  <FormattedMessage
                    id="yllapito.muistiKuvaus"
                    defaultMessage={
                      "Muistin määrä (yhteensä, vapaana, ja maksimi)."
                    }
                  />
                  <br />
                  {memory && (
                    <>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.muistiYhteensa"
                          defaultMessage="Yhteensä: {total} MB"
                          values={{
                            total: this.getMemoryAmount("total")
                          }}
                        />
                      </ContentElement>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.muistiVapaana"
                          defaultMessage="Vapaana: {free} MB"
                          values={{
                            free: this.getMemoryAmount("free")
                          }}
                        />
                      </ContentElement>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.muistiMaksimi"
                          defaultMessage="Maksimi: {max} MB"
                          values={{
                            max: this.getMemoryAmount("max")
                          }}
                        />
                      </ContentElement>
                    </>
                  )}
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.oppijaIndeksiTitle"
                      defaultMessage="Oppijaindeksi"
                    />{" "}
                    <MiniLink
                      onClick={() => this.loadSystemInfo("oppijaindex")}
                    >
                      Lataa tiedot
                    </MiniLink>
                  </Header>
                  <FormattedMessage
                    id="yllapito.oppijaIndeksiKuvaus"
                    defaultMessage={
                      "Oppijoiden ja opiskeluoikeuksien indeksointi."
                    }
                  />
                  <br />
                  {oppijaindex && (
                    <>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.oppijaIndeksoimatta"
                          defaultMessage="Indeksoimatta: {unindexed} oppijaa"
                          values={{
                            unindexed: oppijaindex?.unindexedOppijat
                          }}
                        />
                      </ContentElement>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.opiskeluoikeusIndeksoimatta"
                          defaultMessage="Indeksoimatta: {unindexed} opiskeluoikeutta"
                          values={{
                            unindexed: oppijaindex?.unindexedOpiskeluoikeudet
                          }}
                        />
                      </ContentElement>
                    </>
                  )}
                  <ButtonContainer>
                    <Button onClick={this.onRunIndexClicked}>
                      <FormattedMessage
                        id="yllapito.oppijaIndex"
                        defaultMessage="Indeksoi oppijat ja opiskeluoikeudet"
                      />
                    </Button>
                    {actionSuccessFailureMessage("runIndex")}
                  </ButtonContainer>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.hoksPoisto"
                      defaultMessage="Aiheettoman HOKSin poisto"
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.hoksPoistoKuvaus"
                    defaultMessage="Aiheettoman HOKSin poisto."
                  />
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
                    <ButtonContainer>
                      <Button onClick={this.onDeleteHoks}>
                        <FormattedMessage
                          id="yllapito.poistaHoksButton"
                          defaultMessage="Poista HOKS"
                        />
                      </Button>
                      {actionSuccessFailureMessage("deleteHoks")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.hoksPalautus"
                      defaultMessage={
                        "Palauta virkailijan käyttöliittymästä poistetuksi " +
                        "asetettu HOKS"
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.hoksPalautusKuvaus"
                    defaultMessage={
                      "Palauta vahingossa poistettu HOKS. HOKSeja ei " +
                      "yleensä poisteta totaalisesti, vaan ne vain " +
                      "merkataan poistetuiksi tietokannassa."
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="text"
                          placeholder="12345"
                          value={this.state.hoksPalautusId}
                          onChange={e =>
                            this.handlePalautaIdChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onPalautaHoks}>
                        <FormattedMessage
                          id="yllapito.palautaHoksButton"
                          defaultMessage="Palauta HOKS"
                        />
                      </Button>
                      {actionSuccessFailureMessage("palautaHoks")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.opiskeluoikeusPaivitys"
                      defaultMessage={
                        "Päivitä opiskeluoikeus indeksiin Koskesta."
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.opiskeluoikeusPaivitysKuvaus"
                    defaultMessage={
                      "Päivitä opiskeluoikeuden tiedot " +
                      "opiskeluoikeusindeksiin."
                    }
                  />
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
                    <ButtonContainer>
                      <Button onClick={this.onUpdateOpiskeluoikeus}>
                        <FormattedMessage
                          id="yllapito.updateOpiskeluoikeusButton"
                          defaultMessage={
                            "Päivitä opiskeluoikeuden tiedot " +
                            "opiskeluoikeus-indeksiin."
                          }
                        />
                      </Button>
                      {actionSuccessFailureMessage("updateOpiskeluoikeus")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.opiskeluoikeuksienPaivitys"
                      defaultMessage={
                        "Päivitä koulutustoimijan opiskeluoikeudet " +
                        "indeksiin Koskesta."
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.opiskeluoikeuksienPaivitysKuvaus"
                    defaultMessage={
                      "Päivitä koulutustoimijan opiskeluoikeudet indeksiin."
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="text"
                          placeholder="1.2.345.678.98.76543212345"
                          value={this.state.koulutustoimijaOid}
                          onChange={e =>
                            this.handlekoulutustoimijaOidChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onUpdateOpiskeluoikeudet}>
                        <FormattedMessage
                          id="yllapito.updateOpiskeluoikeudetButton"
                          defaultMessage="Päivitä opiskeluoikeudet."
                        />
                      </Button>
                      {actionSuccessFailureMessage("updateOpiskeluoikeudet")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.oppijanPaivitys"
                      defaultMessage={
                        "Päivitä oppijan tiedot indeksiin " +
                        "Oppijanumerorekisteristä."
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.oppijanPaivitysKuvaus"
                    defaultMessage={
                      "Päivitä oppijan tiedot indeksiin " +
                      "Oppijanumerorekisteristä."
                    }
                  />
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
                    <ButtonContainer>
                      <Button onClick={this.onUpdateOppija}>
                        <FormattedMessage
                          id="yllapito.paivitaOppija"
                          defaultMessage="Paivita oppijan tiedot indeksiin."
                        />
                      </Button>
                      {actionSuccessFailureMessage("updateOppija")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.aloitusHerate"
                      defaultMessage="Lähetä uusi heräte aloituskyselyyn."
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.aloitusHerateKuvaus"
                    defaultMessage={
                      "Käynnistä HOKSin aloituskyselyn muodostus uudestaan " +
                      "eHOKS ID:llä"
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="text"
                          placeholder="123456"
                          value={this.state.sendHerateId}
                          onChange={e =>
                            this.handleSendHerateIdChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onSendHerate}>
                        <FormattedMessage
                          id="yllapito.aloitusHerate"
                          defaultMessage="Lähetä uusi heräte aloituskyselyyn."
                        />
                      </Button>
                      {actionSuccessFailureMessage("sendHerate")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.paattoHerate"
                      defaultMessage="Lähetä uusi heräte päättökyselyyn."
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.paattoHerateKuvaus"
                    defaultMessage={
                      "Käynnistä HOKSin päättökyselyn muodostus uudestaan " +
                      "eHOKS ID:llä"
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="text"
                          placeholder="123456"
                          value={this.state.sendPaattoHerateId}
                          onChange={e =>
                            this.handleSendPaattoHerateIdChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onSendPaattoHerate}>
                        <FormattedMessage
                          id="yllapito.paattoHerate"
                          defaultMessage="Lähetä uusi heräte päättökyselyyn."
                        />
                      </Button>
                      {actionSuccessFailureMessage("sendPaattoHerate")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.aloitusHeratteet"
                      defaultMessage={
                        "Lähetä uudet herätteet aloituskyselyihin " +
                        "aikavälille."
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.aloitusHeratteetKuvaus"
                    defaultMessage={
                      "Lähetä uudestaan kaikki aloituskyselyherätteet, " +
                      "jotka luotiin annetun aikavälin sisällä."
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="date"
                          value={this.state.sendHerateDateFrom}
                          onChange={e =>
                            this.handleSendHerateDateFromChange(e.target.value)
                          }
                        />
                        <HakuInput
                          type="date"
                          value={this.state.sendHerateDateTo}
                          onChange={e =>
                            this.handleSendHerateDateToChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onSendHeratteetBetween}>
                        <FormattedMessage
                          id="yllapito.aloitusHeratteet"
                          defaultMessage={
                            "Lähetä uudet herätteet aloituskyselyihin " +
                            "aikavälille."
                          }
                        />
                      </Button>
                      {actionSuccessFailureMessage("sendHeratteetBetween")}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.paattoHeratteet"
                      defaultMessage={
                        "Lähetä uudet herätteet päättökyselyihin " +
                        "aikavälille."
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.paattoHeratteetKuvaus"
                    defaultMessage={
                      "Lähetä uudestaan kaikki päättökyselyherätteet, " +
                      "jotka luotiin annetun aikavälin sisällä."
                    }
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <HakuInput
                          type="date"
                          value={this.state.sendPaattoHerateDateFrom}
                          onChange={e =>
                            this.handleSendPaattoHerateDateFromChange(
                              e.target.value
                            )
                          }
                        />
                        <HakuInput
                          type="date"
                          value={this.state.sendPaattoHerateDateTo}
                          onChange={e =>
                            this.handleSendPaattoHerateDateToChange(
                              e.target.value
                            )
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={this.onSendPaattoHeratteetBetween}>
                        <FormattedMessage
                          id="yllapito.paattoHeratteet"
                          defaultMessage={
                            "Lähetä uudet herätteet päättökyselyihin " +
                            "aikavälille."
                          }
                        />
                      </Button>
                      {actionSuccessFailureMessage(
                        "sendPaattoHeratteetBetween"
                      )}
                    </ButtonContainer>
                  </ContentElement>
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.vastaajatunnuksenPoisto"
                      defaultMessage={
                        "Opiskelijapalautteen vastaajatunnuksen poisto"
                      }
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.vastaajatunnuksenPoistoKuvaus"
                    defaultMessage="Vastaajatunnuksen poisto ID:llä."
                  />
                  <ContentElement>
                    <form>
                      <HakuInput
                        type="text"
                        placeholder="123456"
                        value={this.state.vastaajatunnusToDelete}
                        onChange={e =>
                          this.handleVastaajatunnusToDeleteChange(
                            e.target.value
                          )
                        }
                      />
                    </form>
                  </ContentElement>
                  <ButtonContainer>
                    <Button onClick={this.onRemoveVastaajatunnusClicked}>
                      <FormattedMessage
                        id="yllapito.poistaVastaajatunnus"
                        defaultMessage="Poista vastaajatunnus"
                      />
                    </Button>
                    {actionSuccessFailureMessage("removeVastaajatunnus")}
                  </ButtonContainer>
                </ContentElement>
              </ContentElement>
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

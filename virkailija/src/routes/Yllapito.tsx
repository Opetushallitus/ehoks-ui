import { Button } from "components/Button"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
import { useIntl, FormattedMessage } from "react-intl"
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

interface YllapitoProps {
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
  isLoading?: boolean
  success?: boolean
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

export const Yllapito = inject("store")(
  observer((props: YllapitoProps) => {
    const [state, setState] = useState<YllapitoState>({
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
    })
    const intl = useIntl()

    const loadSystemInfo = async (type: string) => {
      setState({
        ...state,
        loadingState: "loading",
        isLoading: true,
        message: ""
      })
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
        setState({
          ...state,
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
        setState({
          ...state,
          success: false,
          loadingState: "unsuccessful",
          message: intl.formatMessage({
            id: "yllapito.jarjestelmanTietojenLatausEpaonnistui",
            defaultMessage: "Järjestelmän tietojen lataus epäonnistui"
          })
        })
      }
    }

    useEffect(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
    }, [])

    const onClearCacheClicked = async () => {
      setState({
        ...state,
        loadingState: "loading",
        isLoading: true,
        message: ""
      })
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
        setState({
          ...state,
          success: true,
          loadingState: "success",
          message: intl.formatMessage({
            id: "yllapito.valimuistiTyhjennetty",
            defaultMessage: "Välimuisti tyhjennetty"
          }),
          currentActionId: "clearCache"
        })
        await loadSystemInfo("cache")
      } else {
        setState({
          ...state,
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

    const onRemoveVastaajatunnusClicked = async () => {
      setState({
        ...state,
        loadingState: "loading",
        isLoading: true,
        message: ""
      })
      const { vastaajatunnusToDelete } = state
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
          setState({
            ...state,
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
            intl.formatMessage(
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
                    props.store!.translations.activeLocale
                  ] || confirmJson.data["koulutustoimijan-nimi"].fi,
                koulutustoimijanOid: confirmJson.data["koulutustoimijan-oid"],
                opiskeluoikeus: confirmJson.data["opiskeluoikeus-oid"],
                hoksId: confirmJson.data["hoks-id"],
                kyselytyyppi: intl.formatMessage({
                  id:
                    "tavoitteet.opiskelijapalauteTyyppi." +
                    (confirmJson.data.tyyppi || "").replaceAll("_", "")
                }),
                heratepvm: intl.formatDate(new Date(confirmJson.data.alkupvm), {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric"
                })
              }
            ) as string
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
            setState({
              ...state,
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
              setState({
                ...state,
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
              setState({
                ...state,
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
          setState({
            ...state,
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
          setState({
            ...state,
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

    const onRunIndexClicked = async () => {
      setState({ ...state, loadingState: "loading", message: "" })
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
        setState({
          ...state,
          success: true,
          loadingState: "success",
          message: intl.formatMessage({
            id: "yllapito.indeksointiSuoritettu",
            defaultMessage: "Indeksointi suoritettu"
          }),
          currentActionId: "runIndex"
        })
        await loadSystemInfo("oppijaindex")
      } else {
        setState({
          ...state,
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

    const onGetHoksId = async (event: any) => {
      const { opiskeluoikeusOid } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onGetOpiskeluoikeusOid = async (event: any) => {
      const { hoksHakuId } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onDeleteHoks = async (event: any) => {
      const { idToDelete } = state
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
            intl.formatMessage(
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
                  tutkinnonNimi[props.store!.translations.activeLocale],
                opiskeluoikeusOid,
                oppilaitosNimi:
                  oppilaitosNimi[props.store!.translations.activeLocale],
                oppilaitosOid
              }
            ) as string
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
            setState({
              ...state,
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
            setState({
              ...state,
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
        setState({
          ...state,
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

    const onPalautaHoks = async (event: any) => {
      const { hoksPalautusId } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onUpdateOpiskeluoikeus = async (event: any) => {
      const { opiskeluoikeusUpdateOid } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onUpdateOpiskeluoikeudet = async (event: any) => {
      const { koulutustoimijaOid } = state
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
            intl.formatMessage(
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
            ) as string
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
            setState({
              ...state,
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
            setState({
              ...state,
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
        setState({
          ...state,
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

    const onUpdateOppija = async () => {
      const { updateOppijaOid } = state
      const updateRequest = await window.fetch(
        `/ehoks-virkailija-backend/api/v1/virkailija/onrmodify?oid=${updateOppijaOid}`,
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
      if (updateRequest.status === 204) {
        setState({
          ...state,
          success: true,
          loadingState: "success",
          message: intl.formatMessage({
            id: "yllapito.oppijanPaivitysKaynnistetty",
            defaultMessage: "Oppijan tietojen päivitys käynnistetty eHOKSissa."
          }),
          isLoading: false,
          currentActionId: "updateOppija"
        })
      } else {
        setState({
          ...state,
          success: false,
          loadingState: "unsuccessful",
          message: intl.formatMessage({
            id: "yllapito.oppijanPaivityksenKaynnistysEpaonnistui",
            defaultMessage:
              "Oppijan tietojen päivityksen käynnistys eHOKSissa epäonnistui."
          }),
          isLoading: false,
          currentActionId: "updateOppija"
        })
      }
    }

    const onSendHerate = async (event: any) => {
      const { sendHerateId } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onSendPaattoHerate = async (event: any) => {
      const { sendPaattoHerateId } = state
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
        setState({
          ...state,
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
        setState({
          ...state,
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

    const onSendHeratteetBetween = async (event: any) => {
      const { sendHerateDateFrom, sendHerateDateTo } = state
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
        setState({
          ...state,
          success: true,
          loadingState: "success",
          message: intl.formatMessage(
            {
              id: "yllapito.heratteetLahetysOnnistui",
              defaultMessage: "Lähetettiin {count} herätettä"
            },
            { count }
          ) as string,
          isLoading: false,
          currentActionId: "sendHeratteetBetween"
        })
      } else {
        setState({
          ...state,
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

    const onSendPaattoHeratteetBetween = async (event: any) => {
      const { sendPaattoHerateDateFrom, sendPaattoHerateDateTo } = state
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
        setState({
          ...state,
          success: true,
          loadingState: "success",
          message: intl.formatMessage(
            {
              id: "yllapito.heratteetLahetysOnnistui",
              defaultMessage: "Lähetettiin {count} herätettä"
            },
            { count }
          ) as string,
          isLoading: false,
          currentActionId: "sendPaattoHeratteetBetween"
        })
      } else {
        setState({
          ...state,
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

    const handleHoksIdChange = (inputId: any) => {
      // const inputOid = event.target.value
      setState({
        ...state,
        hoksHakuId: inputId
      })
    }
    const handleOidChange = (inputOid: any) => {
      // const inputOid = event.target.value
      setState({
        ...state,
        opiskeluoikeusOid: inputOid
      })
    }
    const handleUpdateOidChange = (inputOid: any) => {
      setState({
        ...state,
        opiskeluoikeusUpdateOid: inputOid
      })
    }
    const handleDeleteIdChange = (inputId: any) => {
      setState({
        ...state,
        idToDelete: inputId
      })
    }

    const handlePalautaIdChange = (inputId: any) => {
      setState({
        ...state,
        hoksPalautusId: inputId
      })
    }

    const handlekoulutustoimijaOidChange = (inputOid: any) => {
      setState({
        ...state,
        koulutustoimijaOid: inputOid
      })
    }

    const handleUpdateOppijaOidChange = (inputOid: any) => {
      setState({
        ...state,
        updateOppijaOid: inputOid
      })
    }

    const handleSendHerateIdChange = (inputId: any) => {
      setState({
        ...state,
        sendHerateId: inputId
      })
    }

    const handleSendPaattoHerateIdChange = (inputId: any) => {
      setState({
        ...state,
        sendPaattoHerateId: inputId
      })
    }

    const handleSendHerateDateFromChange = (dateFrom: any) => {
      setState({
        ...state,
        sendHerateDateFrom: dateFrom
      })
    }

    const handleSendHerateDateToChange = (dateTo: any) => {
      setState({
        ...state,
        sendHerateDateTo: dateTo
      })
    }

    const handleSendPaattoHerateDateFromChange = (dateFrom: any) => {
      setState({
        ...state,
        sendPaattoHerateDateFrom: dateFrom
      })
    }

    const handleSendPaattoHerateDateToChange = (dateTo: any) => {
      setState({
        ...state,
        sendPaattoHerateDateTo: dateTo
      })
    }

    const handleVastaajatunnusToDeleteChange = (vastaajatunnus: any) => {
      setState({
        ...state,
        vastaajatunnusToDelete: vastaajatunnus
      })
    }

    const hideMessage = () => {
      setState({ ...state, message: "" })
    }

    const getMemoryAmount = (type: string) => {
      if (!state.memory) {
        return "-"
      } else {
        if (type === "total") {
          return Math.floor(state.memory.total / 1000000)
        } else if (type === "free") {
          return Math.floor(state.memory.free / 1000000)
        } else if (type === "max") {
          return Math.floor(state.memory.max / 1000000)
        } else {
          return `unknown type: ${type}`
        }
      }
    }

    const {
      currentActionId,
      loadingState,
      message,
      cache,
      memory,
      oppijaindex,
      hoksit
    } = state

    const actionSuccessFailureMessage = (actionId: string) =>
      actionId !== currentActionId ? null : loadingState === "success" ? (
        <SuccessMessage onClick={hideMessage}>{message}</SuccessMessage>
      ) : (
        <FailureMessage onClick={hideMessage}>{message}</FailureMessage>
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
                <SuccessMessage onClick={hideMessage}>{message}</SuccessMessage>
              ) : (
                <FailureMessage onClick={hideMessage}>{message}</FailureMessage>
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
                          value={state.opiskeluoikeusOid}
                          onChange={e => handleOidChange(e.target.value)}
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onGetHoksId}>
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
                      hoksId: state.hoksId
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
                          value={state.hoksHakuId}
                          onChange={e => handleHoksIdChange(e.target.value)}
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onGetOpiskeluoikeusOid}>
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
                      opiskeluoikeusOid: state.opiskeluoikeusHakuOid
                    }}
                  />
                  <br />
                  <FormattedMessage
                    id="yllapito.OppijaOidTulos"
                    defaultMessage="Oppija-oid on: {oppijaOid}"
                    values={{ oppijaOid: state.oppijaOid }}
                  />
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.hoksienmaaraTitle"
                      defaultMessage="Hoksien lukumäärä"
                    />
                    <MiniLink onClick={() => loadSystemInfo("hoksit")}>
                      <FormattedMessage
                        id="yllapito.lataaTiedot"
                        defaultMessage="Lataa tiedot"
                      />
                    </MiniLink>
                  </Header>
                  <FormattedMessage
                    id="yllapito.hoksienMaaraKuvaus"
                    defaultMessage='Näyttää aktiivisten HOKSien määrän.  Klikkaa "Lataa järjestelmän tiedot" -painiketta ladataksesi tiedot.'
                  />
                  <br />
                  {hoksit && (
                    <ContentElement>
                      <FormattedMessage
                        id="yllapito.hoksienmaaraArvo"
                        defaultMessage="Lukumäärä: {hoksAmount}"
                        values={{ hoksAmount: hoksit?.amount }}
                      />
                    </ContentElement>
                  )}
                </ContentElement>
                <ContentElement>
                  <Header>
                    <FormattedMessage
                      id="yllapito.valimuistiTitle"
                      defaultMessage="Välimuisti"
                    />
                    <MiniLink onClick={() => loadSystemInfo("cache")}>
                      <FormattedMessage
                        id="yllapito.lataaTiedot"
                        defaultMessage="Lataa tiedot"
                      />
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
                    <Button onClick={onClearCacheClicked}>
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
                    <MiniLink onClick={() => loadSystemInfo("memory")}>
                      <FormattedMessage
                        id="yllapito.lataaTiedot"
                        defaultMessage="Lataa tiedot"
                      />
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
                            total: getMemoryAmount("total")
                          }}
                        />
                      </ContentElement>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.muistiVapaana"
                          defaultMessage="Vapaana: {free} MB"
                          values={{
                            free: getMemoryAmount("free")
                          }}
                        />
                      </ContentElement>
                      <ContentElement>
                        <FormattedMessage
                          id="yllapito.muistiMaksimi"
                          defaultMessage="Maksimi: {max} MB"
                          values={{
                            max: getMemoryAmount("max")
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
                    <MiniLink onClick={() => loadSystemInfo("oppijaindex")}>
                      <FormattedMessage
                        id="yllapito.lataaTiedot"
                        defaultMessage="Lataa tiedot"
                      />
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
                    <Button onClick={onRunIndexClicked}>
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
                          value={state.hoksDeleteId}
                          onChange={e => handleDeleteIdChange(e.target.value)}
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onDeleteHoks}>
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
                          value={state.hoksPalautusId}
                          onChange={e => handlePalautaIdChange(e.target.value)}
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onPalautaHoks}>
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
                          value={state.opiskeluoikeusUpdateOid}
                          onChange={e => handleUpdateOidChange(e.target.value)}
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onUpdateOpiskeluoikeus}>
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
                          value={state.koulutustoimijaOid}
                          onChange={e =>
                            handlekoulutustoimijaOidChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onUpdateOpiskeluoikeudet}>
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
                      defaultMessage={`
                        Päivitä oppijan tiedot indeksiin ja oppijan hokseihin
                      `}
                    />
                  </Header>
                  <FormattedMessage
                    id="yllapito.oppijanPaivitysKuvaus"
                    defaultMessage={`
                      Päivittää oppijan tiedot (nimi ja oppijanumero) indeksiin
                      sekä oppijan hokseihin, hakemalla tuoreimmat tiedot
                      Oppijanumerorekisteristä.
                    `}
                  />
                  <ContentElement>
                    <ContentElement>
                      <form>
                        <label htmlFor="oppijaUpdateInput">
                          <FormattedMessage
                            id="yllapito.oppijanPaivitysInputLabel"
                            defaultMessage={`
                              Syötä alla olevaan kenttään oppijan uusin
                              oppijanumero:
                          `}
                          />
                        </label>
                        <br />
                        <HakuInput
                          id="oppijaUpdateInput"
                          type="text"
                          placeholder="1.2.345.678.98.76543212345"
                          value={state.updateOppijaOid}
                          onChange={e =>
                            handleUpdateOppijaOidChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onUpdateOppija}>
                        <FormattedMessage
                          id="yllapito.paivitaOppija"
                          defaultMessage="Käynnistä oppijan tietojen päivitys"
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
                          value={state.sendHerateId}
                          onChange={e =>
                            handleSendHerateIdChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onSendHerate}>
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
                          value={state.sendPaattoHerateId}
                          onChange={e =>
                            handleSendPaattoHerateIdChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onSendPaattoHerate}>
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
                          value={state.sendHerateDateFrom}
                          onChange={e =>
                            handleSendHerateDateFromChange(e.target.value)
                          }
                        />
                        <HakuInput
                          type="date"
                          value={state.sendHerateDateTo}
                          onChange={e =>
                            handleSendHerateDateToChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onSendHeratteetBetween}>
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
                          value={state.sendPaattoHerateDateFrom}
                          onChange={e =>
                            handleSendPaattoHerateDateFromChange(e.target.value)
                          }
                        />
                        <HakuInput
                          type="date"
                          value={state.sendPaattoHerateDateTo}
                          onChange={e =>
                            handleSendPaattoHerateDateToChange(e.target.value)
                          }
                        />
                      </form>
                    </ContentElement>
                    <ButtonContainer>
                      <Button onClick={onSendPaattoHeratteetBetween}>
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
                        value={state.vastaajatunnusToDelete}
                        onChange={e =>
                          handleVastaajatunnusToDeleteChange(e.target.value)
                        }
                      />
                    </form>
                  </ContentElement>
                  <ButtonContainer>
                    <Button onClick={onRemoveVastaajatunnusClicked}>
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
  })
)

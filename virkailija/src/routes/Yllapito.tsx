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
  sendHerateId?: number
  sendHerateDateFrom?: string
  sendHerateDateTo?: string
  sendPaattoHerateDateFrom?: string
  sendPaattoHerateDateTo?: string
  vastaajatunnusToDelete?: string
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
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        )
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

    const confirmJson = confirmRequest.json()
    if (confirmRequest.status === 200) {
      if (confirmJson.data.vastattu) {
        this.setState({
          success: false,
          message: intl.formatMessage({
            id: "yllapito.kyselyynOnJoVastattu",
            defaultMessage: "Kyselyyn on jo vastattu"
          }),
          isLoading: false,
          loadingState: "unsuccessful"
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
              oppijanNimi: confirmJson.data.oppijan_nimi,
              oppijanOid: confirmJson.data.oppijan_oid,
              koulutustoimijanNimi: confirmJson.data.koulutustoimijan_nimi,
              koulutustoimijanOid: confirmJson.data.koulutustoimijan_oid,
              opiskeluoikeus: confirmJson.data.opiskeluoikeus_oid,
              hoksId: confirmJson.data.hoks_id,
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
            loadingState: "success"
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
              loadingState: "unsuccessful"
            })
          } else {
            this.setState({
              success: false,
              message: intl.formatMessage({
                id: "yllapito.vastaajatunnuksenPoistaminenEpaonnistui",
                defaultMessage: "Tunnuksen poistaminen epäonnistui"
              }),
              isLoading: false,
              loadingState: "unsuccessful"
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
          loadingState: "unsuccessful"
        })
      } else {
        this.setState({
          success: false,
          message: intl.formatMessage({
            id: "yllapito.vastaajatunnuksenHakuEpaonnistui",
            defaultMessage: "Tunnuksen haku epäonnistui"
          }),
          isLoading: false,
          loadingState: "unsuccessful"
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
        message: intl.formatMessage({
          id: "yllapito.herateLahetysOnnistui",
          defaultMessage: "Herätteen lähetys onnistui"
        }),
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.herateLahetysEpaonnistui",
          defaultMessage: "Herätteen lähetys epäonnistui"
        }),
        isLoading: false
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
        message: intl.formatMessage(
          {
            id: "yllapito.heratteetLahetysOnnistui",
            defaultMessage: "Lähetettiin {count} herätettä"
          },
          { count }
        ),
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.heratteetLahetysEpaonnistui",
          defaultMessage: "Virhe herätteiden uudelleenlähetyksessä!"
        }),
        isLoading: false
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
        message: intl.formatMessage(
          {
            id: "yllapito.heratteetLahetysOnnistui",
            defaultMessage: "Lähetettiin {count} herätettä"
          },
          { count }
        ),
        isLoading: false
      })
    } else {
      this.setState({
        success: false,
        message: intl.formatMessage({
          id: "yllapito.heratteetLahetysEpaonnistui",
          defaultMessage: "Virhe herätteiden uudelleenlähetyksessä!"
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

  handleSendHerateIdChange = (inputId: any) => {
    this.setState({
      sendHerateId: inputId
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
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.aloitusHerate"
                        defaultMessage="Lähetä uusi heräte aloituskyselyyn."
                      />
                    </Header>
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
                      <ContentElement>
                        <Button onClick={this.onSendHerate}>
                          <FormattedMessage
                            id="yllapito.aloitusHerate"
                            defaultMessage="Lähetä uusi heräte aloituskyselyyn."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.aloitusHeratteet"
                        defaultMessage="Lähetä uudet herätteet aloituskyselyihin aikavälille."
                      />
                    </Header>
                    <ContentElement>
                      <ContentElement>
                        <form>
                          <HakuInput
                            type="date"
                            value={this.state.sendHerateDateFrom}
                            onChange={e =>
                              this.handleSendHerateDateFromChange(
                                e.target.value
                              )
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
                      <ContentElement>
                        <Button onClick={this.onSendHeratteetBetween}>
                          <FormattedMessage
                            id="yllapito.aloitusHeratteet"
                            defaultMessage="Lähetä uudet herätteet aloituskyselyihin aikavälille."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.paattoHeratteet"
                        defaultMessage="Lähetä uudet herätteet päättökyselyihin aikavälille."
                      />
                    </Header>
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
                      <ContentElement>
                        <Button onClick={this.onSendPaattoHeratteetBetween}>
                          <FormattedMessage
                            id="yllapito.paattoHeratteet"
                            defaultMessage="Lähetä uudet herätteet päättökyselyihin aikavälille."
                          />
                        </Button>
                      </ContentElement>
                    </ContentElement>
                  </ContentElement>
                  <ContentElement>
                    <Header>
                      <FormattedMessage
                        id="yllapito.vastaajatunnuksenPoisto"
                        defaultMessage="Opiskelijapalautteen vastaajatunnuksen poisto"
                      />
                    </Header>
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
                    <ContentElement>
                      <Button onClick={this.onRemoveVastaajatunnusClicked}>
                        <FormattedMessage
                          id="yllapito.poistaVastaajatunnus"
                          defaultMessage="Poista vastaajatunnus"
                        />
                      </Button>
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

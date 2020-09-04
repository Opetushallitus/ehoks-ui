import React, { useContext, useEffect, useState } from "react"
import { Location, navigate, RouteComponentProps, Router } from "@reach/router"
import { FormattedMessage, InjectedIntlProps } from "react-intl"
import { fetchLink, LinkInfo } from "./ShareDialog/API"
import { Container } from "components/Container"
// import { OsaamisenOsoittaminen } from "models/OsaamisenOsoittaminen"
// import { OsaamisenHankkimistapa } from "models/OsaamisenHankkimistapa"
import { APIConfigContext } from "components/APIConfigContext"
import { WindowLocation } from "@reach/router"
import { FormattedDate } from "components/FormattedDate"
import { OsaamisenHankkimistapa } from "components/TutkinnonOsa/OsaamisenHankkimistapa"
import { TutkinnonOsa } from "components/TutkinnonOsa"

// interface ShareLinkInfoState {
//   oppijaNimi: string
//   oppijaOid: string
//   tutkintoNimi: string
//   osaamisalaNimi: string
//   voimassaoloAlku: string
//   voimassaoloLoppu: string
//   osaamisenOsoittaminen: typeof OsaamisenOsoittaminen
//   osaamisenHankkimistapa: typeof OsaamisenHankkimistapa
//   tutkinnonosaTyyppi: string
// }

interface ShareLinkInfoProps {
  uuid?: string
}

export function ShareLinkInfo(props: ShareLinkInfoProps) {
  const { uuid } = props

  const apiConfig = useContext(APIConfigContext)
  const [shareInfo, setShareInfo] = useState<LinkInfo>()

  useEffect(() => {
    const fetchData = async () => {
      uuid ? setShareInfo(await fetchLink(uuid, apiConfig)) : ""
    }

    fetchData()
  }, [apiConfig, location])

  console.log(shareInfo)

  const showOsaamisenHankkimiset = () => {
    if (shareInfo && shareInfo.osaamisenHankkimistapa) {
      shareInfo.osaamisenHankkimistapa.map((osaamisenHankkiminen, i) =>
        console.log(osaamisenHankkiminen)
      )
    }
  }

  //      {
  //         shareInfo.osaamisenHankkimistapa.map((osaamisenHankkiminen, i) => (
  //                     {
  //                     <OsaamisenHankkimistapa
  //                     key={i}
  //                     osaamisenHankkimistapa={osaamisenHankkiminen}
  //                 />
  //         ))
  //       }}
  //     }
  //   }

  return (
    <React.Fragment>
      <Container>
        <FormattedMessage
          id="tyopaikantoimija.testi"
          defaultMessage="Oma komponentti"
        />
        <FormattedMessage
          id="tyopaikantoimija.LinkinPvm"
          defaultMessage="Jaetun linkin pvm on: {pvm}"
          values={{
            pvm: shareInfo ? shareInfo.voimassaoloLoppu : "ei päivää"
          }}
        />
        {showOsaamisenHankkimiset()}
      </Container>
    </React.Fragment>
  )
}

import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { fetchLink, LinkInfo } from "./ShareDialog/API"
import { Container } from "components/Container"

import { APIConfigContext } from "components/APIConfigContext"

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

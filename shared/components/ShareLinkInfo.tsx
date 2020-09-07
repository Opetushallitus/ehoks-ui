import React from "react"
import { FormattedMessage } from "react-intl"
import { Container } from "components/Container"
import { OsaamisenHankkimistapa } from "components/TutkinnonOsa/OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "components/TutkinnonOsa/OsaamisenOsoittaminen"
// import { ShareStoreModel } from
// "../../tyopaikantoimija/src/stores/ShareStore"
import { Share } from "../../tyopaikantoimija/src/stores/ShareStore"
import { Instance } from "mobx-state-tree"

interface ShareLinkInfoProps {
  share: Instance<typeof Share>
  //   {
  //     oppijaNimi?: string
  //     oppijaOid?: string
  //     tutkintoNimi?: string
  //     voimassaoloAlku?: string
  //     voimassaoloLoppu?: string
  //     osaamisenOsoittaminen?: OsaamisenOsoittaminen[]
  //     osaamisenHankkimistapa?: OsaamisenHankkimistapa[]
  //   }
}

export function ShareLinkInfo(props: ShareLinkInfoProps) {
  const { share } = props

  const showOsaamisenHankkimiset = () => {
    if (share.osaamisenHankkimistapa) {
      share.osaamisenHankkimistapa.map((osaamisenHankkiminen, i) => (
        <OsaamisenHankkimistapa
          key={i}
          osaamisenHankkimistapa={osaamisenHankkiminen}
        />
      ))
    }
  }

  const showOsaamisenOsoittamiset = () => {
    if (share.osaamisenOsoittaminen) {
      share.osaamisenOsoittaminen.map((naytto, i) => (
        <OsaamisenOsoittaminen key={i} osaamisenOsoittaminen={naytto} />
      ))
    }
  }

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
            pvm: share.oppijaNimi ? share.oppijaNimi : "ei päivää"
          }}
        />
        {showOsaamisenHankkimiset()}
        {showOsaamisenOsoittamiset()}
      </Container>
    </React.Fragment>
  )
}

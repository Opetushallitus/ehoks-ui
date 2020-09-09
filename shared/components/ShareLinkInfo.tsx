import React from "react"
import { FormattedMessage } from "react-intl"
import { Container } from "components/Container"
import { Share } from "../../tyopaikantoimija/src/stores/ShareStore"
import { Instance } from "mobx-state-tree"
import { TutkinnonOsa } from "components/TutkinnonOsa"
import { StudiesContainer } from "components/StudiesContainer"
import { FormattedDate } from "components/FormattedDate"
import styled from "styled"

interface ShareLinkInfoProps {
  share: Instance<typeof Share>
}

const ShareTitle = styled("h1")`
  margin: 0 0 16px 0;
`

const ShareSubTitle = styled("h2")`
  margin: 0 0 16px 0;
`

export function ShareLinkInfo(props: ShareLinkInfoProps) {
  const { share } = props

  return (
    <React.Fragment>
      <Container>
        <Container>
          <ShareTitle>
            <FormattedMessage
              id="tyopaikantoimija.oppijanTiedot"
              defaultMessage="{nimi}, {tutkintoNimi} "
              values={{
                nimi: share.oppijaNimi ? share.oppijaNimi : "ei nimeä",
                tutkintoNimi: share.tutkintoNimi.fi
                  ? share.tutkintoNimi.fi
                  : "ei tutkinnon nimeä"
              }}
            />
          </ShareTitle>
        </Container>
        <Container>
          <ShareSubTitle>
            <FormattedMessage
              id="tyopaikantoimija.linkinTiedot"
              defaultMessage="Työpaikalla oppimisen tiedot on jaettuna sinulle
            {voimassaoloAlku}-{voimassaoloLoppu} "
              values={{
                voimassaoloAlku: share.voimassaoloAlku ? (
                  <FormattedDate date={share.voimassaoloAlku} />
                ) : (
                  "ei alkupäivämäärää"
                ),
                voimassaoloLoppu: share.voimassaoloLoppu ? (
                  <FormattedDate date={share.voimassaoloLoppu} />
                ) : (
                  "ei loppupäivämäärää"
                )
              }}
            />
          </ShareSubTitle>
        </Container>
        <Container>
          {(share.osaamisenHankkimistapa || share.osaamisenOsoittaminen) && (
            <StudiesContainer>
              <TutkinnonOsa
                accentColor="scheduled"
                title={"Tähän tarvitaan otsikko"}
                moduleId={share.tutkinnonosa?.moduleId}
                share={{ moduleId: share.tutkinnonosa?.moduleId }}
                koodiUri={share.tutkinnonosa?.tutkinnonOsaKoodiUri}
                osaamisenHankkimistavat={
                  share.osaamisenHankkimistapa
                    ? [share.osaamisenHankkimistapa]
                    : []
                }
                osaamisenOsoittamiset={
                  share.osaamisenOsoittaminen
                    ? [share.osaamisenOsoittaminen]
                    : []
                }
              />
            </StudiesContainer>
          )}
        </Container>
      </Container>
    </React.Fragment>
  )
}

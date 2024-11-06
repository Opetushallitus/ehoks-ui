import { Container, PaddedContainer } from "components/Container"
import { HomeLink } from "components/HomeLink"
import { HomeOrb } from "components/HomeOrb"
import React, { useEffect } from "react"
import { MdHome } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AmmattitutkintoHaku } from "routes/Ammattitutkinto/AmmattitutkintoHaku"
import { AmmattitutkintoSisalto } from "routes/Ammattitutkinto/AmmattitutkintoSisalto"
import styled from "styled"

const SectionContainer = styled("div")`
  display: flex;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    flex-direction: column-reverse;
  }
`

export const Ammatillinentutkinto = () => {
  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  return (
    <Container>
      <PaddedContainer>
        <HomeLink to="../">
          <HomeOrb>
            <MdHome size="24" color="#fff" />
          </HomeOrb>
          <FormattedMessage
            id="navigaatio.palaaAloitussivulleLink"
            defaultMessage="Palaa aloitussivulle"
          />
        </HomeLink>
        <SectionContainer>
          <AmmattitutkintoSisalto />
          <AmmattitutkintoHaku />
        </SectionContainer>
      </PaddedContainer>
    </Container>
  )
}

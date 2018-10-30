import { Container, PaddedContainer } from "components/Container"
import { BackLink, HomeLink } from "components/HomeLink"
import { HomeOrb } from "components/HomeOrb"
import React from "react"
import { MdHome } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AmmattitutkintoHaku } from "routes/Ammattitutkinto/AmmattitutkintoHaku"
import { AmmattitutkintoSisalto } from "routes/Ammattitutkinto/AmmattitutkintoSisalto"
import styled from "styled"

const SectionContainer = styled("div")`
  display: flex;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: column-reverse;
  }
`

export interface AmmatillinentutkintoProps {
  path?: string
}

export class Ammatillinentutkinto extends React.Component<
  AmmatillinentutkintoProps
> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    return (
      <Container>
        <PaddedContainer>
          <HomeLink to="../">
            <HomeOrb>
              <MdHome size="24" color="#fff" />
            </HomeOrb>
            <FormattedMessage
              id="ammattitutkinto.backToFrontpage"
              defaultMessage="Palaa aloitussivulle"
            />
          </HomeLink>
          <BackLink to="../">
            <FormattedMessage
              id="ammattitutkinto.backToLandingPage"
              defaultMessage="Etusivu - Mitä ammatillinen tutkinto sisältää?"
            />
          </BackLink>
          <SectionContainer>
            <AmmattitutkintoSisalto />
            <AmmattitutkintoHaku />
          </SectionContainer>
        </PaddedContainer>
      </Container>
    )
  }
}

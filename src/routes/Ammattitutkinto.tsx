import { Container } from "components/Container"
import { HomeLink } from "components/HomeLink"
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

export interface AmmattitutkintoProps {
  path?: string
}

export class Ammattitutkinto extends React.Component<AmmattitutkintoProps> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    return (
      <Container>
        <HomeLink to="../">
          <HomeOrb>
            <MdHome size="24" color="#fff" />
          </HomeOrb>
          <FormattedMessage
            id="ammattitutkinto.backToFrontpage"
            defaultMessage="Palaa aloitussivulle"
          />
        </HomeLink>
        <SectionContainer>
          <AmmattitutkintoSisalto />
          <AmmattitutkintoHaku />
        </SectionContainer>
      </Container>
    )
  }
}

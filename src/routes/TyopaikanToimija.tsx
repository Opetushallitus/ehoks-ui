import { Container, PaddedContent } from "components/Container"
import { NavigationContainer } from "components/NavigationContainer"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Heading, MainHeading } from "routes/Etusivu/Heading"
import styled from "styled"
import { BackgroundContainer } from "./Etusivu/SectionContainer"

const HeaderContainer = styled(NavigationContainer)`
  border: none;
`

export interface TyopaikanToimijaProps {
  path?: string
}

export class TyopaikanToimija extends React.Component<TyopaikanToimijaProps> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    return (
      <React.Fragment>
        <HeaderContainer>
          <Container>
            <PaddedContent>
              <MainHeading>
                <FormattedMessage
                  id="tyopaikanToimija.title"
                  defaultMessage="Ammatillisten opintojen henkilökohtaistaminen"
                />
              </MainHeading>
            </PaddedContent>
          </Container>
        </HeaderContainer>

        <BackgroundContainer>
          <Container>
            <PaddedContent>
              <Heading>
                <FormattedMessage
                  id="tyopaikanToimija.tyopaikallaOppijatTitle"
                  defaultMessage="Työpaikalla oppijat"
                />
              </Heading>
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}

import { RouteComponentProps } from "@reach/router"
import { HeroButton } from "components/Button"
import { LinkPanel } from "components/LinkPanel"
import { LinkPanelContainer } from "components/LinkPanelContainer"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SessionStore } from "stores/SessionStore"
import { breakpoints, injectSession } from "utils"

import education from "./Home/education.jpg"
import students from "./Home/students.jpg"

export interface HomeProps {
  session?: Instance<typeof SessionStore>
}

const Container = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
`

const Hero = styled("div")`
  display: flex;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    display: block;
  }
`

const Description = styled("div")`
  flex: 1;
  margin: 20px;

  h1 {
    font-weight: 400;
  }

  p {
    font-size: 18px;
  }
`

const LoginContainer = styled("div")`
  flex: 1;
  margin: 50px 20px 20px 20px;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    margin: 20px;
  }
`

const LoginButton = styled(HeroButton)`
  margin-left: 20px;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    margin-left: 0;
  }
`

@inject(injectSession)
@observer
export class Home extends React.Component<HomeProps & RouteComponentProps> {
  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.session.loginUrl
  }

  render() {
    // const { store } = this.props
    return (
      <Container>
        <Hero>
          <Description>
            <h1>Opiskelun henkilökohtainen suunnittelu</h1>
            <p>
              eHOKS palvelussa voit kirjautumalla siirtyä henkilökohtaiseen
              opintojen suunnitteluun. Ilman kirjautumista voit tutustua eri
              alojen ammattitaitovaatimuksiin ja osaamistavoitteisiin.
            </p>
          </Description>
          <LoginContainer>
            <LoginButton onClick={this.login}>
              Kirjaudu omaan suunnitelmaan
            </LoginButton>
          </LoginContainer>
        </Hero>
        <LinkPanelContainer>
          <LinkPanel
            to="henkilokohtaistaminen"
            title="Mitä opintojen henkilökohtaistaminen tarkoittaa?"
            description="Opiskelu sovitetaan lähtötilanteeseesi..."
            image={students}
          />
          <LinkPanel
            to="ammattitutkinto"
            title="Mitä ammattitutkinto sisältää?"
            description="Jokaiselle tutkinnon osalle on ammattitaitovaatimukset..."
            image={education}
          />
        </LinkPanelContainer>
      </Container>
    )
  }
}

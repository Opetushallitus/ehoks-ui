import { HeroButton } from "components/Button"
import { LinkPanel } from "components/LinkPanel"
import { LinkPanelContainer } from "components/LinkPanelContainer"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SessionStore } from "stores/SessionStore"
import { breakpoints, injectSession } from "utils"

import education from "./education.jpg"
import students from "./students.jpg"

const Hero = styled("div")`
  display: flex;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    display: block;
  }
`

const Content = styled("div")`
  display: flex;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    display: block;
  }
`

const NewsContainer = styled("div")`
  flex: 1;
`

const CurrentNews = styled("div")`
  margin: 0 20px 0 30px;

  h2 {
    font-weight: 400;
    font-size: 28px;
    margin: 0;
    border-bottom: 1px solid #979797;
    padding-bottom: 8px;
  }

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    margin: 0 20px;
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

export interface SignedOutProps {
  session?: Instance<typeof SessionStore>
}

@inject(injectSession)
@observer
export class SignedOut extends React.Component<SignedOutProps> {
  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.session.loginUrl
  }

  render() {
    return (
      <React.Fragment>
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
        <Content>
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
          <NewsContainer>
            <CurrentNews>
              <h2>Ajankohtaista</h2>
            </CurrentNews>
          </NewsContainer>
        </Content>
      </React.Fragment>
    )
  }
}

import { HeroButton } from "components/Button"
import { LinkPanel } from "components/LinkPanel"
import { LinkPanelContainer } from "components/LinkPanelContainer"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import education from "./education.jpg"
import students from "./students.jpg"

const Container = styled("div")`
  display: flex;
  margin: 30px 90px 50px 40px;
  flex-direction: row;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    display: block;
    margin: 30px 50px 0 20px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    flex-direction: column;
  }
`

const Hero = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Header = styled("h1")`
  margin: 0;
`

const Content = styled("main")`
  display: flex;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    display: block;
  }
`

const Description = styled("div")`
  h1 {
    font-weight: 400;
  }

  p {
    font-size: 18px;
    margin: 20px 20px 20px 0;
  }
`

const LoginContainer = styled("div")`
  flex: 1;
  margin: 20px 0 30px 0;
`

const LoginButton = styled(HeroButton)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    width: 100%;
    margin-left: 0;
  }
`

const StyledLinkPanel = styled(LinkPanel)`
  min-height: 400px;
  margin-right: 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    min-height: 320px;
    margin-right: 0;
  }
`

export interface EtusivuProps {
  store?: IRootStore
  path?: string
}

@inject("store")
@observer
export class Etusivu extends React.Component<EtusivuProps> {
  static contextTypes = {
    intl: intlShape
  }

  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.store!.environment.opintopolkuLoginUrl
  }

  render() {
    const { intl } = this.context
    return (
      <Container>
        <Hero role="banner">
          <Description>
            <Header>
              <FormattedMessage
                id="etusivu.title"
                defaultMessage="Opiskelun henkilökohtainen suunnittelu"
              />
            </Header>
            <p>
              <FormattedMessage
                id="etusivu.kuvaus"
                defaultMessage="eHOKS palvelussa voit kirjautumalla siirtyä henkilökohtaiseen
              opintojen suunnitteluun. Ilman kirjautumista voit tutustua eri
              alojen ammattitaitovaatimuksiin ja osaamistavoitteisiin."
              />
            </p>
          </Description>
          <LoginContainer>
            <LoginButton onClick={this.login}>
              <FormattedMessage
                id="etusivu.kirjauduButtonLabel"
                defaultMessage="Kirjaudu omaan suunnitelmaan"
              />
            </LoginButton>
          </LoginContainer>
        </Hero>
        <Content>
          <LinkPanelContainer>
            <StyledLinkPanel
              to="henkilokohtaistaminen"
              title={
                <FormattedMessage
                  id="etusivu.henkilokohtaistaminenTitle"
                  defaultMessage="Mitä opintojen henkilökohtaistaminen tarkoittaa?"
                />
              }
              description={
                <FormattedMessage
                  id="etusivu.henkilokohtaistaminenKuvaus"
                  defaultMessage="Opiskelu sovitetaan lähtötilanteeseesi..."
                />
              }
              image={students}
              imageLabel={intl.formatMessage({
                id: "etusivu.henkilokohtaistaminenKuvanAriaLabel"
              })}
            />
            <StyledLinkPanel
              to="ammatillinentutkinto"
              title={
                <FormattedMessage
                  id="etusivu.ammatillisetTutkinnotTitle"
                  defaultMessage="Mitä ammatilliset tutkinnot sisältävät?"
                />
              }
              description={
                <FormattedMessage
                  id="etusivu.ammatillisetTutkinnotKuvaus"
                  defaultMessage="Jokaiselle tutkinnon osalle on ammattitaitovaatimukset..."
                />
              }
              image={education}
              imageLabel={intl.formatMessage({
                id: "etusivu.ammatillisetTutkinnotKuvanAriaLabel"
              })}
            />
          </LinkPanelContainer>
        </Content>
      </Container>
    )
  }
}

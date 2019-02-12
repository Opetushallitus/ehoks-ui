import { navigate } from "@reach/router"
import { HeroButton } from "components/Button"
import { Container } from "components/Container"
import { LinkPanel } from "components/LinkPanel"
import { LinkPanelContainer } from "components/LinkPanelContainer"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import education from "./Etusivu/education.jpg"
import students from "./Etusivu/students.jpg"

const ContentContainer = styled("div")`
  display: flex;
  margin: 30px 50px 50px 40px;
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
  margin: 0 0 30px 0;
`

const LoginButton = styled(HeroButton)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    width: 100%;
    margin-left: 0;
  }
  width: 60%;
  padding: 15px 0;
`

const StyledLinkPanel = styled(LinkPanel)`
  min-height: 400px;
  margin-right: 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    min-height: 320px;
    margin-right: 0;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    a:last-child & {
      margin-right: 0;
    }
  }
`

export interface EtusivuProps {
  store?: IRootStore
  path?: string
}

@inject("store")
@observer
export class Etusivu extends React.Component<EtusivuProps> {
  disposeLoginReaction: IReactionDisposer

  componentDidMount() {
    const { store } = this.props
    this.disposeLoginReaction = reaction(
      () => store!.session.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          navigate("/ehoks/suunnittelu")
        }
      }
    )
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  loginStudent = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.store!.environment.opintopolkuLoginUrl
  }

  loginInstructor = (event: React.MouseEvent) => {
    event.preventDefault()
    navigate("/ehoks/tyopaikantoimija")
  }

  loginEducationProvider = (event: React.MouseEvent) => {
    event.preventDefault()
    navigate("/ehoks/koulutuksenjarjestaja")
  }

  render() {
    return (
      <Container>
        <ContentContainer>
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
                  id="etusivu.opiskelijaKuvaus"
                  defaultMessage="Opiskelijana eHOKS palvelussa voit kirjautumalla siirtyä henkilökohtaiseen
              opintojen suunnitteluun. Ilman kirjautumista voit tutustua ammatillisten tutkintojen sisältöihin."
                />
              </p>
            </Description>
            <LoginContainer>
              <LoginButton onClick={this.loginStudent}>
                <FormattedMessage
                  id="etusivu.opiskelijaKirjauduButtonLabel"
                  defaultMessage="Kirjaudu omaan opiskelusuunnitelmaasi"
                />
              </LoginButton>
            </LoginContainer>
            <Description>
              <p>
                <FormattedMessage
                  id="etusivu.tyopaikkaohjaajaKuvaus"
                  defaultMessage="Työpaikkaohjaajan eHOKS tukee sinua työpaikalla oppijoiden ohjauksessa ja pystyt seuraamaan heidän suunnitelmaansa."
                />
              </p>
            </Description>
            <LoginContainer>
              <LoginButton onClick={this.loginInstructor}>
                <FormattedMessage
                  id="etusivu.tyopaikkaohjaajaKirjauduButtonLabel"
                  defaultMessage="Kirjaudu työpaikkaohjaajana"
                />
              </LoginButton>
            </LoginContainer>
            <LoginContainer>
              <LoginButton onClick={this.loginEducationProvider}>
                <FormattedMessage
                  id="etusivu.koulutuksenJarjestajaKirjauduButtonLabel"
                  defaultMessage="Kirjaudu koulutuksen järjestäjänä"
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
              />
            </LinkPanelContainer>
          </Content>
        </ContentContainer>
      </Container>
    )
  }
}

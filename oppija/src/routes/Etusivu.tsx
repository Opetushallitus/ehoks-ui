import { navigate } from "@reach/router"
import { HeroButton } from "components/Button"
import { Container } from "components/Container"
import { HelpPopup } from "components/HelpPopup"
import { LinkPanel } from "components/LinkPanel"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import ammatillisetTutkinnotImage from "./Etusivu/kampaaja_ehoks.jpg"
import henkilokohtaistaminenImage from "./Etusivu/talonrakennus_ehoks.jpg"

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

const LoginBoxes = styled("div")`
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: 30px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    margin-right: 0;
    flex-direction: column;
  }
`

const Header = styled("h1")`
  margin: 30px 50px 30px 40px;
  font-weight: 400;
  color: #4a4a4a;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 30px 50px 0 20px;
  }
`

const Content = styled("main")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  flex: 1;
  margin-right: 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    display: block;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    margin-right: 0;
  }
`

const LoginContainer = styled("div")`
  margin: 0 20px 10px 0;
  padding: 10px;
  border: 1px solid #6e6e7e;
  width: calc(50% - 20px);

  p {
    color: #6e6e7e;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    width: calc(100% - 20px);
    margin: 0 0 10px 0;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    width: 100%;
  }
`

const LoginButton = styled(HeroButton)`
  width: 100%;
  padding: 15px 0;
`

const StyledLinkPanel = styled(LinkPanel)`
  min-height: 400px;
  margin-right: 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    min-height: 320px;
    margin-right: 0;
    a:last-child & {
      margin-right: 0;
    }
  }
`

const LoginTitle = styled("div")`
  display: flex;

  h2 {
    flex: 1;
    color: #000;
    font-weight: 400;
    margin: 0;
    font-size: 34px;
  }
`

const HelpButton = styled(HelpPopup)`
  margin-top: 7px;
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
        <Header>
          <FormattedMessage
            id="etusivu.title"
            defaultMessage="Opiskelun henkilökohtainen suunnittelu"
          />
        </Header>

        <ContentContainer>
          <LoginBoxes role="banner">
            <LoginContainer>
              <LoginTitle>
                <h2>
                  <FormattedMessage
                    id="etusivu.omaSuunnitelmaTitle"
                    defaultMessage="Opiskelija"
                  />
                </h2>
                <HelpButton helpContent="Lisätietoa" />
              </LoginTitle>
              <p>
                <FormattedMessage
                  id="etusivu.omaSuunnitelmaKuvaus"
                  defaultMessage="Kirjautumalla siirryt oman henkilö­kohtaiseen opintojen suunnitteluun."
                />
              </p>

              <LoginButton onClick={this.loginStudent}>
                <FormattedMessage
                  id="etusivu.omaSuunnitelmaKirjauduButtonLabel"
                  defaultMessage="Kirjaudu omaan suunnitelmaan"
                />
              </LoginButton>
            </LoginContainer>

            <LoginContainer>
              <LoginTitle>
                <h2>
                  <FormattedMessage
                    id="etusivu.oppilaitoksenEdustajaTitle"
                    defaultMessage="Ohjaaja"
                  />
                </h2>
                <HelpButton helpContent="Lisätietoa" />
              </LoginTitle>
              <p>
                <FormattedMessage
                  id="etusivu.oppilaitoksenEdustajaKuvaus"
                  defaultMessage="Kirjautumalla siirryt ohjattavien opiskelijoiden suunnitelmiin."
                />
              </p>
              <LoginButton onClick={this.loginInstructor}>
                <FormattedMessage
                  id="etusivu.oppilaitoksenEdustajaKirjauduButtonLabel"
                  defaultMessage="Kirjaudu oppilaitoksen edustajana"
                />
              </LoginButton>
            </LoginContainer>
            <LoginContainer>
              <LoginTitle>
                <h2>
                  <FormattedMessage
                    id="etusivu.tyoelamanToimijaTitle"
                    defaultMessage="Työelämän toimija"
                  />
                </h2>
                <HelpButton helpContent="Lisätietoa" />
              </LoginTitle>
              <p>
                <FormattedMessage
                  id="etusivu.tyoelamanToimijaKuvaus"
                  defaultMessage="Kirjaudu palveluun saamasi sähköpostilinkin kautta."
                />
              </p>
            </LoginContainer>
          </LoginBoxes>
          <Content>
            <StyledLinkPanel
              to="henkilokohtaistaminen"
              title={
                <FormattedMessage
                  id="etusivu.henkilokohtaistaminenLinkTitle"
                  defaultMessage="Mitä henkilökohtaista­minen tarkoittaa?"
                />
              }
              image={henkilokohtaistaminenImage}
            />
            <StyledLinkPanel
              to="ammatillinentutkinto"
              title={
                <FormattedMessage
                  id="etusivu.ammatillisetTutkinnotTitle"
                  defaultMessage="Mitä ammatilliset tutkinnot sisältävät?"
                />
              }
              image={ammatillisetTutkinnotImage}
            />
          </Content>
        </ContentContainer>
      </Container>
    )
  }
}

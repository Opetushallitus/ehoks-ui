import React from "react"
import styled, { css } from "react-emotion"

import { FormattedMessage } from "react-intl"
import facebookLogo from "./AppFooter/facebook.svg"
import instagramLogo from "./AppFooter/instagram.svg"
import okmLogo from "./AppFooter/okm_logo.png"
import ophLogo from "./AppFooter/oph_logo.svg"
import opintopolku from "./AppFooter/opintopolku.png"
import twitterLogo from "./AppFooter/twitter.svg"

const logo = css`
  height: 50px;
  &:first-of-type {
    margin-right: 20px;
  }
`

const SocialMediaIcon = styled("img")`
  margin-left: 20px;
  width: 30px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    a:first-of-type & {
      margin-left: 0;
    }
    margin-top: 15px;
    margin-left: 10px;
  }
`

const FooterContainer = styled("div")`
  width: 100%;
  background-color: #f8f8f8;
  margin-top: 10px;
  border-top: 1px solid #c8cdcf;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    background-color: #fff;
  }
`

const Footer = styled("div")`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  padding: 20px 20px 30px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    display: block;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 0;
  }
`

const FooterColumn = styled("div")`
  flex: 1;
`

const LinksContainer = styled(FooterColumn)`
  display: flex;
  align-self: flex-start;
  flex-direction: column;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: row;
    padding: 20px 20px 30px 20px;
  }
`

const LinksList = styled("ul")`
  list-style: none;
  margin: 10px 0 0 0;
  padding-left: 0;

  li {
    line-height: 30px;
    color: #4a4a4a;
  }
`

const DisclaimerAndLogos = styled("div")`
  flex: 2;
  display: flex;
  flex-direction: row;
  background: transparent;
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    background: #f8f8f8;
    border-top: 1px solid #979797;
    flex-direction: column-reverse;
  }
`

const LogosContainer = styled(FooterColumn)`
  display: flex;
  align-items: flex-end;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    justify-content: center;
    margin: 20px 0;
  }
`

const Disclaimer = styled(FooterColumn)`
  align-items: flex-end;

  p {
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    color: #626769;
    margin-bottom: 30px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    p {
      text-align: left;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 0 20px;
    p {
      margin-bottom: 0;
    }
  }
`

const MobileButtons = styled("div")`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const OpintopolkuLogo = styled("img")`
  width: 200px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 150px;
  }
`

const DisclaimerLinks = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    justify-content: flex-start;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

const LanguageVersions = styled("div")`
  a {
    margin-right: 10px;
    font-size: 13px;
  }
`

const Separator = styled("div")`
  color: #cfd5d7;
`

interface SocialMediaIconsContainerProps {
  theme?: any
  desktop: boolean
  mobile: boolean
}
const SocialMediaIconsContainer = styled("div")`
  display: ${(props: SocialMediaIconsContainerProps) =>
    props.desktop ? "block" : "none"};
  @media screen and (max-width: ${(props: SocialMediaIconsContainerProps) =>
      props.theme.breakpoints.Tablet}px) {
    display: ${(props: SocialMediaIconsContainerProps) =>
      props.mobile ? "block" : "none"};
  }
`

const SocialMediaIcons = ({
  desktop = true,
  mobile = true
}: {
  desktop: boolean
  mobile: boolean
}) => {
  return (
    <SocialMediaIconsContainer desktop={desktop} mobile={mobile}>
      <a>
        <SocialMediaIcon src={twitterLogo} alt="Twitter" />
      </a>
      <a>
        <SocialMediaIcon src={facebookLogo} alt="Facebook" />
      </a>
      <a>
        <SocialMediaIcon src={instagramLogo} alt="Instagram" />
      </a>
    </SocialMediaIconsContainer>
  )
}

export class AppFooter extends React.Component<{}> {
  render() {
    return (
      <FooterContainer>
        <Footer>
          <LinksContainer>
            <MobileButtons>
              <OpintopolkuLogo src={opintopolku} />
              <SocialMediaIcons desktop={false} mobile={true} />
            </MobileButtons>
            <LinksList>
              <li>
                <FormattedMessage
                  id="footer.ePerusteetLink"
                  defaultMessage="ePerusteet"
                />
              </li>
              <li>
                <FormattedMessage
                  id="footer.opintoPolkuLink"
                  defaultMessage="Mikä on opintopolku"
                />
              </li>
              <li>
                <FormattedMessage
                  id="footer.registerDescriptionLink"
                  defaultMessage="Tietoturvaseloste"
                />
              </li>
              <li>
                <FormattedMessage
                  id="footer.feedbackLink"
                  defaultMessage="Anna palautetta"
                />
              </li>
            </LinksList>
          </LinksContainer>
          <DisclaimerAndLogos>
            <LogosContainer>
              <img className={logo} src={okmLogo} />
              <img className={logo} src={ophLogo} />
            </LogosContainer>
            <Disclaimer>
              <p>
                <FormattedMessage
                  id="footer.description"
                  defaultMessage="Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja
              koulutuksistaan Opintopolku.fi-palvelussa. Tietojen oikeellisuuden
              voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta."
                />
              </p>
              <DisclaimerLinks>
                <LanguageVersions>
                  <a>
                    <FormattedMessage
                      id="footer.finnishLocale"
                      defaultMessage="Suomeksi"
                    />
                  </a>
                  <a>
                    <FormattedMessage
                      id="footer.englishLocale"
                      defaultMessage="In English"
                    />
                  </a>
                  <a>
                    <FormattedMessage
                      id="footer.swedishLocale"
                      defaultMessage="På svenska"
                    />
                  </a>
                </LanguageVersions>
                <Separator>|</Separator>
                <SocialMediaIcons desktop={true} mobile={false} />
              </DisclaimerLinks>
            </Disclaimer>
          </DisclaimerAndLogos>
        </Footer>
      </FooterContainer>
    )
  }
}

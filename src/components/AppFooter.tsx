import React from "react"
import styled, { css } from "react-emotion"

import { FormattedMessage } from "react-intl"
import { breakpoints } from "utils"
import facebookLogo from "./AppFooter/facebook.svg"
import instagramLogo from "./AppFooter/instagram.svg"
import okmLogo from "./AppFooter/okm_logo.png"
import ophLogo from "./AppFooter/oph_logo.svg"
import opintopolku from "./AppFooter/opintopolku.png"
import twitterLogo from "./AppFooter/twitter.svg"

const socialMediaIcon = css`
  margin-left: 20px;
  width: 30px;
`

const logo = css`
  height: 50px;
  &:first-of-type {
    margin-right: 20px;
  }
`

const FooterContainer = styled("div")`
  width: 100%;
  background-color: #f8f8f8;
  margin-top: 40px;
  border-top: 1px solid #c8cdcf;
`

const Footer = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  padding: 20px 20px 30px 20px;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    display: block;
  }
`

const FooterColumn = styled("div")`
  flex: 1;
`

const LinksContainer = styled(FooterColumn)`
  align-self: flex-start;
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

const LogosContainer = styled(FooterColumn)`
  display: flex;
  align-items: flex-end;
  flex: 1;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    justify-content: center;
    margin: 20px 0;

    .${logo} {
      height: 100px;
    }
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

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    p {
      text-align: left;
    }
  }
`

const OpintopolkuLogo = styled("img")`
  width: 200px;
`

const DisclaimerLinks = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    justify-content: flex-start;
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

const SocialMediaIcons = styled("div")``

export class AppFooter extends React.Component<{}> {
  render() {
    return (
      <FooterContainer>
        <Footer>
          <LinksContainer>
            <OpintopolkuLogo src={opintopolku} />
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
              <SocialMediaIcons>
                <a>
                  <img
                    className={socialMediaIcon}
                    src={twitterLogo}
                    alt="Twitter"
                  />
                </a>
                <a>
                  <img
                    className={socialMediaIcon}
                    src={facebookLogo}
                    alt="Facebook"
                  />
                </a>
                <a>
                  <img
                    className={socialMediaIcon}
                    src={instagramLogo}
                    alt="Instagram"
                  />
                </a>
              </SocialMediaIcons>
            </DisclaimerLinks>
          </Disclaimer>
        </Footer>
      </FooterContainer>
    )
  }
}

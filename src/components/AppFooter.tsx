import React from "react"
import styled from "react-emotion"

import facebookLogo from "./AppFooter/facebook.svg"
import instagramLogo from "./AppFooter/instagram.svg"
import okmLogo from "./AppFooter/okm_logo.png"
import ophLogo from "./AppFooter/oph_logo.svg"
import opintopolku from "./AppFooter/opintopolku.png"
import twitterLogo from "./AppFooter/twitter.svg"

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
`

const OpintopolkuLogo = styled("img")`
  width: 200px;
`

const OkmLogo = styled("img")`
  height: 50px;
  margin-right: 20px;
`

const OphLogo = styled("img")`
  height: 50px;
`

const TwitterLogo = styled("img")`
  margin-left: 20px;
  width: 30px;
`

const FacebookLogo = styled("img")`
  margin-left: 20px;
  width: 30px;
`

const InstagramLogo = styled("img")`
  margin-left: 20px;
  width: 30px;
`

const DisclaimerLinks = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
              <li>ePerusteet</li>
              <li>Mikä on opintopolku</li>
              <li>Tietoturvaseloste</li>
              <li>Anna palautetta</li>
            </LinksList>
          </LinksContainer>
          <LogosContainer>
            <OkmLogo src={okmLogo} />
            <OphLogo src={ophLogo} />
          </LogosContainer>
          <Disclaimer>
            <p>
              Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja
              koulutuksistaan Opintopolku.fi-palvelussa. Tietojen oikeellisuuden
              voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.
            </p>
            <DisclaimerLinks>
              <LanguageVersions>
                <a>Suomeksi</a>
                <a>In English</a>
                <a>På svenska</a>
              </LanguageVersions>
              <Separator>|</Separator>
              <SocialMediaIcons>
                <a>
                  <TwitterLogo src={twitterLogo} alt="Twitter" />
                </a>
                <a>
                  <FacebookLogo src={facebookLogo} alt="Facebook" />
                </a>
                <a>
                  <InstagramLogo src={instagramLogo} alt="Instagram" />
                </a>
              </SocialMediaIcons>
            </DisclaimerLinks>
          </Disclaimer>
        </Footer>
      </FooterContainer>
    )
  }
}

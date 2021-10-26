import { Link } from "@reach/router"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import styled from "styled"
import ehoksLogo from "./ehoks_logo_2.png"
import ophLogo from "./oph_logo.svg"

const EHOKSLogo = styled("img")`
  height: 64px;
  margin: 0 0 40px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: row;
    margin: 0 20px 0 0;
  }
`

const OPHLogo = styled("img")`
  height: 50px;
`

const FooterContainer = styled("footer")`
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #d5d8da;
`

const Footer = styled("div")`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 30px auto 0 auto;
  display: flex;
  flex-direction: column;
`

const TopContent = styled("div")`
  display: flex;
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: column;
  }
`

const FooterColumn = styled("div")`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
`

const Description = styled(FooterColumn)`
  align-items: flex-end;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  margin: 20px 0 20px 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 20px 0 20px 20px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 0 50px 0 20px;
    border-top-width: 0px;
  }
`

const Links = styled(FooterColumn)`
  align-items: center;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  margin: 20px 80px 20px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 20px 50px 20px 0;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    align-items: flex-start;
    margin: 0 50px 0 20px;
    border-bottom-width: 0px;
  }
`

const DescriptionText = styled("div")`
  width: 70%;
  padding: 12px 0;
  color: #6a6a6a;
  line-height: 1.4;

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    width: 90%;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    width: 100%;
  }
`

const LinksContainer = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 12px 0;

  a {
    color: #539d1d;
  }
`

const LogosContainer = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 0 70px 0 70px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: row;
    margin: 20px 0;
    align-items: center;
    justify-content: center;
  }
`

const Disclaimer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6a6a6a;
  line-height: 1.4;
  margin: 20px 0 20px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 20px 50px 20px 20px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 20px 50px 20px 20px;
  }
`

export class AppFooter extends React.Component {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const { intl } = this.context
    return (
      <FooterContainer>
        <Footer>
          <TopContent>
            <Description>
              <DescriptionText>
                <FormattedMessage
                  id="footer.descriptionText"
                  defaultMessage="
              Henkilökohtainen osaamisen kehityssuunnitelma on käytännön
              työväline opiskelijalle, opettajille ja ohjaajille oppilaitoksessa
              ja työpaikoilla."
                />
              </DescriptionText>
            </Description>
            <LogosContainer>
              <EHOKSLogo
                src={ehoksLogo}
                alt={intl.formatMessage({
                  id: "footer.ehoksLogoLabel"
                })}
              />
              <OPHLogo
                src={ophLogo}
                alt={intl.formatMessage({
                  id: "footer.ophLogoLabel"
                })}
              />
            </LogosContainer>
            <Links>
              <LinksContainer>
                <a href="mailto:ehoks@opintopolku.fi">
                  <FormattedMessage
                    id="footer.contactEmailLabel"
                    defaultMessage="Ota yhteyttä: ehoks@opintopolku.fi"
                  />
                </a>
                <Link to="https://beta.opintopolku.fi/konfo/fi/sivu/ehoks-palvelun-tietosuojaseloste">
                  <FormattedMessage
                    id="footer.dataProtectionReportLabel"
                    defaultMessage="Tietosuojaseloste"
                  />
                </Link>
                <Link to="https://beta.opintopolku.fi/konfo/fi/sivu/saavutettavuusselosteet">
                  <FormattedMessage
                    id="footer.accessibilityReportLabel"
                    defaultMessage="Saavutettavuusseloste"
                  />
                </Link>
              </LinksContainer>
            </Links>
          </TopContent>
          <Disclaimer>
            <FormattedMessage
              id="footer.informationDisclaimer"
              defaultMessage="Koulutuksen järjestäjät ylläpitävät eHOKS-tietojasi. Tietojen oikeellisuuden voit tarkistaa kyseisestä oppilaitoksesta."
            />
          </Disclaimer>
        </Footer>
      </FooterContainer>
    )
  }
}

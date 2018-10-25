import { Container } from "components/Container"
import { HomeLink } from "components/HomeLink"
import { HomeOrb } from "components/HomeOrb"
import React from "react"
import { MdHome } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import styled from "styled"

const SectionContainer = styled("div")`
  display: flex;
`

const Section = styled("div")`
  flex: 1;
  margin: 0 20px;
  color: #6e6e7e;
  font-weight: 300;
  font-size: 18px;
`

const SectionTitle = styled("h1")`
  font-weight: 400;
  font-size: 30px;
  color: #4a4a4a;
  margin: 0 0 10px 0;
`

const DashedList = styled("ul")`
  list-style-type: none;
  padding: 0 0 0 10px;

  & li:before {
    content: "-";
    position: absolute;
    margin-left: -10px;
  }
`

export interface HenkilokohtaistaminenProps {
  path?: string
}

export class Henkilokohtaistaminen extends React.Component<
  HenkilokohtaistaminenProps
> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    return (
      <Container>
        <HomeLink to="../">
          <HomeOrb>
            <MdHome size="24" color="#fff" />
          </HomeOrb>
          <FormattedMessage
            id="henkilokohtaistaminen.backToFrontpage"
            defaultMessage="Palaa aloitussivulle"
          />
        </HomeLink>
        <SectionContainer>
          <Section>
            <SectionTitle>
              <FormattedMessage
                id="henkilokohtaistaminen.backToFrontpage"
                defaultMessage="Mitä opiskelujen henkilökohtaistaminen tarkoittaa?"
              />
            </SectionTitle>
            <p>
              <FormattedMessage
                id="henkilokohtaistaminen.first_paragraph"
                defaultMessage="Opiskelun alussa sinulle laaditaan henkilökohtainen osaamisen kehittämissuunnitelma (HOKS), jonka avulla tunnistetaan aiempi osaamisesi ja suunnitellaan, miten hankit tarvittavan osaamisen tutkintoa varten. HOKS sisältää myös tiedot mahdollisesta ohjaus- ja tukitoimista. HOKSiin merkitään muun muassa:"
              />
            </p>
            <DashedList>
              <li>
                <FormattedMessage
                  id="henkilokohtaistaminen.bullet1"
                  defaultMessage="suoritettava tutkinto ja tutkinnon osat"
                />
              </li>
              <li>
                <FormattedMessage
                  id="henkilokohtaistaminen.bullet2"
                  defaultMessage="aiempi osaamisesi, joka liittyy tutkintoon jota suoritat"
                />
              </li>
              <li>
                <FormattedMessage
                  id="henkilokohtaistaminen.bullet3"
                  defaultMessage="mitä erityistä tukea mahdollisesti tarvitset"
                />
              </li>
              <li>
                <FormattedMessage
                  id="henkilokohtaistaminen.bullet4"
                  defaultMessage="mitä opiskeluvalmiuksia tukevia opintoja mahdollisesti tarvitset"
                />
              </li>
              <li>
                <FormattedMessage
                  id="henkilokohtaistaminen.bullet5"
                  defaultMessage="milloin suoritat tutkintoon liittyvät näytöt sekä mitä näytöt sisältävät, missä suoritat ne sekä kuka on järjestäjänä."
                />
              </li>
            </DashedList>
          </Section>
          <Section />
        </SectionContainer>
      </Container>
    )
  }
}

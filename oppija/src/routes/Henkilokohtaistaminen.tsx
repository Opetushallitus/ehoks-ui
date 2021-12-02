import { RouteComponentProps } from "@reach/router"
import {
  ChartArrowBottom,
  ChartArrowLeft,
  ChartArrowRight,
  ChartArrowTop
} from "components/ChartArrow"
import { ChartBox } from "components/ChartBox"
import { ChartContainer } from "components/ChartContainer"
import { ChartContent, ChartFlex } from "components/ChartContent"
import { ChartRow } from "components/ChartRow"
import { Container, PaddedContainer } from "components/Container"
import { HomeLink } from "components/HomeLink"
import { HomeOrb } from "components/HomeOrb"
import PenPaper from "components/icons/PenPaper"
import Ribbon from "components/icons/Ribbon"
import User from "components/icons/User"
import React from "react"
import {
  MdAccountBalance,
  MdDescription,
  MdHome,
  MdSearch,
  MdVerifiedUser
} from "react-icons/md"
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
  color: #4a4a4a;
  margin: 0 0 10px 0;
`

export type HenkilokohtaistaminenProps = RouteComponentProps

export class Henkilokohtaistaminen extends React.Component<
  HenkilokohtaistaminenProps
> {
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render = () => (
    <Container>
      <PaddedContainer>
        <HomeLink to="../">
          <HomeOrb>
            <MdHome size="24" color="#fff" />
          </HomeOrb>
          <FormattedMessage
            id="navigaatio.palaaAloitussivulleLink"
            defaultMessage="Palaa aloitussivulle"
          />
        </HomeLink>
        <SectionContainer>
          <Section>
            <SectionTitle>
              <FormattedMessage
                id="henkilokohtaistaminen.title"
                defaultMessage="Mitä opiskelujen henkilökohtaistaminen tarkoittaa?"
              />
            </SectionTitle>
          </Section>
        </SectionContainer>
        <Section>
          <ChartContainer role="list">
            <ChartRow role="presentation" height="200px" marginBottom="15px">
              <ChartBox
                flex={1}
                backgroundColor="#3A7A10"
                icon={
                  <MdAccountBalance
                    size={160}
                    color="rgba(255, 255, 255, 0.1)"
                  />
                }
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.tavoitteeniAsettaminenTitle"
                      defaultMessage="Tavoitteeni asettaminen"
                    />
                  </h2>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.uratavoite"
                        defaultMessage="Uratavoite"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.koulutustavoite"
                        defaultMessage="Koulutustavoite"
                      />
                    </li>
                  </ul>
                </ChartContent>
                <ChartArrowRight
                  backgroundColor="#3A7A10"
                  size={40}
                  borderWidth={5}
                />
              </ChartBox>
              <ChartBox
                flex={2}
                backgroundColor="#9459A4"
                icon={<MdSearch size={160} color="rgba(255, 255, 255, 0.1)" />}
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.mitaOsaanJoTitle"
                      defaultMessage="Mitä osaan jo?"
                    />
                  </h2>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.osaamisenTunnustaminen"
                        defaultMessage="Aiemmin hankitun osaamisen tunnistaminen ja tunnustaminen suhteessa tavoitteeseen"
                      />
                    </li>
                  </ul>
                </ChartContent>
                <ChartArrowBottom
                  backgroundColor="#9459A4"
                  size={20}
                  borderWidth={15}
                  right="25%"
                />
              </ChartBox>
            </ChartRow>
            <ChartRow role="presentation" marginBottom="5px">
              <ChartBox
                flex={1}
                backgroundColor="#636466"
                icon={<User size={140} color="rgba(255, 255, 255, 0.1)" />}
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.osaamisenHankkiminenTitle"
                      defaultMessage="Osaamisen hankkiminen"
                    />
                  </h2>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.tyopaikalla"
                        defaultMessage="Työpaikalla"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.muissaYmparistoissa"
                        defaultMessage="Muissa sovituissa oppimisympäristöissä"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.opetusOhjaus"
                        defaultMessage="Opetus, ohjaus ja tarvittava tuki"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.palauteKehittymisesta"
                        defaultMessage="Palaute osaamisen kehittymisestä"
                      />
                    </li>
                  </ul>
                </ChartContent>
                <ChartArrowBottom
                  backgroundColor="#636466"
                  size={20}
                  borderWidth={5}
                  left="20%"
                />
              </ChartBox>
              <ChartBox
                flex={1}
                backgroundColor="#42A147"
                icon={<PenPaper size={140} color="rgba(255, 255, 255, 0.1)" />}
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.mitaPuuttuuTitle"
                      defaultMessage="Mitä osaamista minulta puuttuu?"
                    />
                  </h2>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.suunnittelu"
                        defaultMessage="Suunnittelu tavoitteen saavuttamiseksi tutkinnon osa kerrallaan"
                      />
                    </li>
                  </ul>
                </ChartContent>
                <ChartArrowLeft
                  backgroundColor="#42A147"
                  size={40}
                  borderWidth={5}
                />
              </ChartBox>
            </ChartRow>
            <ChartRow role="presentation" height="200px" marginBottom="15px">
              <ChartBox
                flex={2}
                backgroundColor="#C72829"
                icon={
                  <MdDescription size={160} color="rgba(255, 255, 255, 0.1)" />
                }
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.osaamisenOsoittaminenTitle"
                      defaultMessage="Osaamisen osoittaminen"
                    />
                  </h2>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.naytto"
                        defaultMessage="Näyttö"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.osaamisenArviointi"
                        defaultMessage="Osaamisen arviointi"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="henkilokohtaistaminen.palaute"
                        defaultMessage="Palaute"
                      />
                    </li>
                  </ul>
                </ChartContent>
                <ChartArrowRight
                  backgroundColor="#C72829"
                  size={40}
                  borderWidth={5}
                />
              </ChartBox>
              <ChartBox
                flex={1}
                backgroundColor="#3A7210"
                icon={
                  <MdVerifiedUser size={160} color="rgba(255, 255, 255, 0.1)" />
                }
              >
                <ChartContent>
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.osatavoiteSaavutettuTitle"
                      defaultMessage="Osatavoite saavutettu"
                    />
                  </h2>
                </ChartContent>
                <ChartArrowTop
                  backgroundColor="#3A7210"
                  size={20}
                  borderWidth={5}
                  right="50%"
                />
                <ChartArrowBottom
                  backgroundColor="#3A7210"
                  size={20}
                  borderWidth={15}
                  right="50%"
                />
              </ChartBox>
            </ChartRow>
            <ChartRow role="presentation" height="100px" marginBottom="25px">
              <ChartBox flex={1} backgroundColor="#EC7123" padding="0">
                <ChartFlex>
                  <Ribbon size={80} />
                  <h2>
                    <FormattedMessage
                      id="henkilokohtaistaminen.tavoitteenSaavuttaminenTitle"
                      defaultMessage="Tavoitteen saavuttaminen"
                    />
                  </h2>
                </ChartFlex>
              </ChartBox>
            </ChartRow>
          </ChartContainer>
        </Section>
      </PaddedContainer>
    </Container>
  )
}

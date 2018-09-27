import { Link } from "@reach/router"
import React from "react"
import styled from "react-emotion"
import { MdHome, MdSearch } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { SearchResult } from "routes/Ammattitutkinto/SearchResult"

interface PageProps {
  active: boolean
}

const Container = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
`

const SectionContainer = styled("div")`
  display: flex;
`

const SearchContainer = styled("div")`
  border: 1px solid #979797;
  padding: 10px;
`

const SearchResultsContainer = styled("div")`
  margin: 10px 0;
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

const SearchResultsTitle = styled(SectionTitle)`
  color: #000;
`

const HomeLink = styled(Link)`
  color: #1976d2;
  text-decoration: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  padding: 20px;
`

const HomeOrb = styled("div")`
  background-color: #ed7103;
  border-radius: 21px;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`

const SearchHeader = styled("div")`
  display: flex;
  align-items: center;
`

const SearchIcon = styled(MdSearch)`
  margin: 0 20px 0 10px;
`

const SearchInput = styled("input")`
  border: 1px solid #6e6e7e;
  border-radius: 2px;
  color: #6e6e7e;
  font-size: 16px;
  height: 40px;
  padding: 0 10px;
  min-width: 330px;
`

const SearchResultsList = styled("div")`
  padding: 10px;
`

const Paging = styled("div")`
  margin: 10px;
`

const Page = styled("div")`
  display: inline-block;
  background-color: ${(props: PageProps) =>
    props.active ? "#316fa0" : "#ecf3fc"};
  color: ${(props: PageProps) => (props.active ? "#fff" : "#000")};
  padding: 5px 10px;
  margin-right: 10px;
  cursor: ${(props: PageProps) => (props.active ? "default" : "pointer")};
`

export interface AmmattitutkintoProps {
  path?: string
}

export class Ammattitutkinto extends React.Component<AmmattitutkintoProps> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const { intl } = this.context
    const results = [
      {
        competenceAreas: [
          "Elintarviketeknologian osaamisala",
          "Meijerialan osaamisala",
          "Liha-alan osaamisala",
          "Leipomoalan osaamisala"
        ],
        link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
        qualificationTitles: [
          "Elintarvikkeiden valmistaja",
          "Leipuri-kondiittori",
          "Lihatuotteiden valmistaja",
          "Meijeristi"
        ],
        title: "Elintarvikealan perustutkinnon perusteet"
      },
      {
        competenceAreas: [
          "Elintarviketeknologian osaamisala",
          "Meijerialan osaamisala",
          "Liha-alan osaamisala",
          "Leipomoalan osaamisala"
        ],
        link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
        qualificationTitles: [
          "Elintarvikkeiden valmistaja",
          "Leipuri-kondiittori",
          "Lihatuotteiden valmistaja",
          "Meijeristi"
        ],
        title: "Elintarvikealan perustutkinnon perusteet"
      },
      {
        competenceAreas: [
          "Elintarviketeknologian osaamisala",
          "Meijerialan osaamisala",
          "Liha-alan osaamisala",
          "Leipomoalan osaamisala"
        ],
        link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
        qualificationTitles: [
          "Elintarvikkeiden valmistaja",
          "Leipuri-kondiittori",
          "Lihatuotteiden valmistaja",
          "Meijeristi"
        ],
        title: "Elintarvikealan perustutkinnon perusteet"
      },
      {
        competenceAreas: [
          "Elintarviketeknologian osaamisala",
          "Meijerialan osaamisala",
          "Liha-alan osaamisala",
          "Leipomoalan osaamisala"
        ],
        link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
        qualificationTitles: [
          "Elintarvikkeiden valmistaja",
          "Leipuri-kondiittori",
          "Lihatuotteiden valmistaja",
          "Meijeristi"
        ],
        title: "Elintarvikealan perustutkinnon perusteet"
      },
      {
        competenceAreas: [
          "Elintarviketeknologian osaamisala",
          "Meijerialan osaamisala",
          "Liha-alan osaamisala",
          "Leipomoalan osaamisala"
        ],
        link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
        qualificationTitles: [
          "Elintarvikkeiden valmistaja",
          "Leipuri-kondiittori",
          "Lihatuotteiden valmistaja",
          "Meijeristi"
        ],
        title: "Elintarvikealan perustutkinnon perusteet"
      }
    ]
    return (
      <Container>
        <HomeLink to="/">
          <HomeOrb>
            <MdHome size="24" color="#fff" />
          </HomeOrb>
          <FormattedMessage
            id="ammattitutkinto.backToFrontpage"
            defaultMessage="Palaa aloitussivulle"
          />
        </HomeLink>
        <SectionContainer>
          <Section>
            <SectionTitle>
              <FormattedMessage
                id="ammattitutkinto.title"
                defaultMessage="Mitä ammattitutkinto sisältää?"
              />
            </SectionTitle>
            <p>
              <FormattedMessage
                id="ammattitutkinto.first_paragraph"
                defaultMessage="
          Tutkinnon laajuus lasketaan osaamispisteissä. Ammattilliseen
          perustutkintoon (180 osaamispistettä, osp) kuuluu ammattillisia
          tutkinnon osia (145 osp) ja yhteisiä tutkinnon osia (35 osp).
          "
              />
            </p>
            <p>
              <FormattedMessage
                id="ammattitutkinto.second_paragraph"
                defaultMessage="Ammatillinen tutkinto suoritetaan näytöillä osoittamalla ammattitaitoasi käytännön työtehtävissä pääosin työpaikoilla. Näytöissä arvioidaan, miten hyvin olet saavuttanut tutkinnnon vaatiman ammattitaidon. Osaamisesi arvioivat opettaja ja työelämän edustaja yhdessä."
              />
            </p>
            <p>
              <FormattedMessage
                id="ammattitutkinto.third_paragraph"
                defaultMessage="Jos sinulla on jo entuudestaan johonkin ammattiin riittävä osaaminen, osaamisesi kartoitetaan haun jälkeen henkilökohtaistamisvaiheessa."
              />
            </p>
          </Section>
          <Section>
            <SectionTitle>
              <FormattedMessage
                id="ammattitutkinto.searchTitle"
                defaultMessage="Hae tietoa ammatillisista tutkinnoista"
              />
            </SectionTitle>
            <SearchContainer>
              <SearchHeader>
                <SearchIcon size="24" />
                <SearchInput
                  placeholder={intl.formatMessage({
                    defaultMessage: "Hae tietoa ammateista",
                    id: "ammattitutkinto.placeholder"
                  })}
                />
              </SearchHeader>
              <SearchResultsContainer>
                <SearchResultsTitle>
                  <FormattedMessage
                    id="ammattitutkinto.searchResultsTitle"
                    defaultMessage="Tutkinnot ({count})"
                    values={{
                      count: results.length
                    }}
                  />
                </SearchResultsTitle>
                <SearchResultsList>
                  {results.map(result => {
                    return <SearchResult key={result.title} result={result} />
                  })}
                </SearchResultsList>
              </SearchResultsContainer>
              <Paging>
                <Page active={true}>1</Page>
                <Page>2</Page>
              </Paging>
            </SearchContainer>
          </Section>
        </SectionContainer>
      </Container>
    )
  }
}

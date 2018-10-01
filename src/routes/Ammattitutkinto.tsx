import { Container } from "components/Container"
import { HomeLink } from "components/HomeLink"
import { HomeOrb } from "components/HomeOrb"
import { LoadingSpinner } from "components/LoadingSpinner"
import range from "lodash.range"
import slice from "lodash.slice"
import take from "lodash.take"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { MdHome, MdSearch } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { SearchResult } from "routes/Ammattitutkinto/SearchResult"
import { RootStore } from "stores/RootStore"

interface PageProps {
  active?: boolean
}

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

const PagingContainer = styled("div")`
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
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class Ammattitutkinto extends React.Component<AmmattitutkintoProps> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activePage: 0,
    perPage: 5,
    searchText: "",
    searchTimeout: 0
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.searchTimeout) {
      window.clearTimeout(this.state.searchTimeout)
    }
    this.props.store.oppilas.tyhjennaTutkinnot()

    this.setState({
      activePage: 0,
      searchText: event.target.value,
      searchTimeout: setTimeout(() => {
        this.props.store.oppilas.haeMockTutkinnot()
      }, 300)
    })
  }

  goToPage = (index: number) => () => {
    this.setState({ activePage: index })
  }

  render() {
    const { intl } = this.context
    const { store } = this.props
    const { oppilas } = store
    const totalPages = Math.ceil(
      store.oppilas.tutkinnot.length / this.state.perPage
    )
    return (
      <Container>
        <HomeLink to="../">
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
                  onChange={this.updateSearchText}
                />
                {oppilas.isLoading && <LoadingSpinner />}
              </SearchHeader>
              {this.state.searchText.length > 0 &&
                oppilas.tutkinnot.length > 0 && (
                  <React.Fragment>
                    <SearchResultsContainer>
                      <SearchResultsTitle>
                        <FormattedMessage
                          id="ammattitutkinto.searchResultsTitle"
                          defaultMessage="Tutkinnot ({count})"
                          values={{
                            count: oppilas.tutkinnot.length
                          }}
                        />
                      </SearchResultsTitle>
                      <SearchResultsList>
                        {take(
                          slice(
                            oppilas.tutkinnot,
                            this.state.activePage * this.state.perPage
                          ),
                          this.state.perPage
                        ).map((tutkinto, index) => {
                          return <SearchResult key={index} result={tutkinto} />
                        })}
                      </SearchResultsList>
                    </SearchResultsContainer>

                    {oppilas.tutkinnot.length > 0 && (
                      <PagingContainer>
                        {range(totalPages).map(index => {
                          return (
                            <Page
                              key={index}
                              active={this.state.activePage === index}
                              onClick={this.goToPage(index)}
                            >
                              {index + 1}
                            </Page>
                          )
                        })}
                      </PagingContainer>
                    )}
                  </React.Fragment>
                )}
            </SearchContainer>
          </Section>
        </SectionContainer>
      </Container>
    )
  }
}

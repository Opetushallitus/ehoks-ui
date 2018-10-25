import { LoadingSpinner } from "components/LoadingSpinner"
import range from "lodash.range"
import slice from "lodash.slice"
import take from "lodash.take"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdSearch } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { SearchResult } from "routes/Ammattitutkinto/SearchResult"
import { Section } from "routes/Ammattitutkinto/Section"
import { SectionTitle } from "routes/Ammattitutkinto/SectionTitle"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

interface PageProps {
  active?: boolean
}

const Loading = styled(LoadingSpinner)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
    right: 20px;
  }
`

const SearchContainer = styled("div")`
  border: 1px solid #979797;
  padding: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    border-width: 0;
  }
`

const SearchResultsContainer = styled("div")`
  margin: 10px 0;
`

const SearchResultsTitle = styled(SectionTitle)`
  color: #000;
  margin: 10px;
`

const SearchHeader = styled("div")`
  display: flex;
  align-items: center;
`

const SearchIcon = styled(MdSearch)`
  margin: 0 20px 0 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
  }
`

const SearchInput = styled("input")`
  border: 1px solid #6e6e7e;
  border-radius: 2px;
  color: #6e6e7e;
  font-size: 16px;
  height: 40px;
  padding: 0 10px;
  min-width: 330px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    min-width: unset;
    width: 100%;
    padding-left: 40px;
  }
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

export interface AmmattitutkintoHakuProps {
  store?: IRootStore
}

@inject("store")
@observer
export class AmmattitutkintoHaku extends React.Component<
  AmmattitutkintoHakuProps
> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activePage: 0,
    perPage: 5,
    searchText: "",
    searchTimeout: 0
  }

  updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value
    if (this.state.searchTimeout) {
      window.clearTimeout(this.state.searchTimeout)
    }
    this.props.store.oppilas.tyhjennaPerusteet()

    this.setState({
      activePage: 0,
      searchText,
      searchTimeout: setTimeout(() => {
        if (searchText.length > 0) {
          this.props.store.oppilas.haePerusteet(searchText)
        }
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
    const totalPages = Math.ceil(oppilas.perusteet.length / this.state.perPage)
    return (
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
                defaultMessage: "Hae tietoa",
                id: "ammattitutkinto.placeholder"
              })}
              onChange={this.updateSearchText}
            />
            {oppilas.isLoading && <Loading />}
          </SearchHeader>
          {this.state.searchText.length > 0 &&
            oppilas.perusteet.length > 0 && (
              <React.Fragment>
                <SearchResultsContainer>
                  <SearchResultsTitle>
                    <FormattedMessage
                      id="ammattitutkinto.searchResultsTitle"
                      defaultMessage="Tutkinnot ({count})"
                      values={{
                        count: oppilas.perusteet.length
                      }}
                    />
                  </SearchResultsTitle>
                  <SearchResultsList>
                    {take(
                      slice(
                        oppilas.perusteet,
                        this.state.activePage * this.state.perPage
                      ),
                      this.state.perPage
                    ).map(peruste => {
                      return <SearchResult key={peruste.id} result={peruste} />
                    })}
                  </SearchResultsList>
                </SearchResultsContainer>

                {oppilas.perusteet.length > 0 && (
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
    )
  }
}

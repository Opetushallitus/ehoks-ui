import { Page } from "components/Page"
import { SearchField } from "components/SearchField"
import range from "lodash.range"
import slice from "lodash.slice"
import take from "lodash.take"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { SearchResult } from "routes/Ammattitutkinto/SearchResult"
import { Section } from "routes/Ammattitutkinto/Section"
import { SectionTitle } from "routes/Ammattitutkinto/SectionTitle"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

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

const SearchResultsList = styled("div")`
  padding: 10px;
`

const PagingContainer = styled("nav")`
  margin: 10px;
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

  formSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value
    if (this.state.searchTimeout) {
      window.clearTimeout(this.state.searchTimeout)
    }
    this.props.store!.oppilas.tyhjennaPerusteet()

    this.setState({
      activePage: 0,
      searchText,
      searchTimeout: window.setTimeout(() => {
        if (searchText.length > 0) {
          this.props.store!.oppilas.haePerusteet(searchText)
        }
      }, 300)
    })
  }

  onPaginationResultEnter = (index: number) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      this.setState({ activePage: index })
    }
  }

  goToPage = (index: number) => () => {
    this.setState({ activePage: index })
  }

  render() {
    const { intl } = this.context
    const { store } = this.props
    const { searchText } = this.state
    const { oppilas } = store!
    const totalPages = Math.ceil(oppilas.perusteet.length / this.state.perPage)
    return (
      <Section>
        <SectionTitle>
          <FormattedMessage
            id="ammattitutkinto.hakuTitle"
            defaultMessage="Hae tietoa ammatillisista tutkinnoista"
          />
        </SectionTitle>

        <SearchContainer>
          <SearchField
            isLoading={oppilas.isLoading}
            onSubmit={this.formSubmit}
            onTextChange={this.updateSearchText}
            value={searchText}
          />
          {this.state.searchText.length > 0 && oppilas.perusteet.length > 0 && (
            <React.Fragment>
              <SearchResultsContainer>
                <SearchResultsTitle>
                  <FormattedMessage
                    id="ammattitutkinto.hakutuloksetTitle"
                    defaultMessage="Tutkinnot ({count})"
                    values={{
                      count: oppilas.perusteet.length
                    }}
                  />
                </SearchResultsTitle>
                <SearchResultsList role="list">
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

              {totalPages > 1 && oppilas.perusteet.length > 0 && (
                <PagingContainer
                  aria-label={intl.formatMessage({
                    id:
                      "ammattitutkinto.hakutuloksienSivutuksenNavigaatioAriaLabel"
                  })}
                >
                  {range(totalPages).map(index => {
                    return (
                      <Page
                        key={index}
                        active={this.state.activePage === index}
                        aria-current={this.state.activePage === index}
                        onClick={this.goToPage(index)}
                        onKeyPress={this.onPaginationResultEnter(index)}
                        tabIndex={0}
                        aria-label={intl.formatMessage(
                          {
                            id:
                              "ammattitutkinto.meneHakutuloksienSivulleAriaLabel"
                          },
                          { page: index + 1 }
                        )}
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

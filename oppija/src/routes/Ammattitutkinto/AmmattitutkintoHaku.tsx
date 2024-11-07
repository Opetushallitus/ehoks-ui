import { Page } from "components/Page"
import { SearchField } from "components/SearchField"
import range from "lodash.range"
import slice from "lodash.slice"
import take from "lodash.take"
import { inject, observer } from "mobx-react"
import React, { useState } from "react"
import { useIntl, FormattedMessage } from "react-intl"
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

export const AmmattitutkintoHaku = inject("store")(
  observer((props: AmmattitutkintoHakuProps) => {
    const [state, setState] = useState({
      activePage: 0,
      perPage: 5,
      searchText: "",
      searchTimeout: 0
    })
    const intl = useIntl()

    const formSubmit = (event: React.FormEvent) => {
      event.preventDefault()
    }

    const updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchText = event.target.value
      if (state.searchTimeout) {
        window.clearTimeout(state.searchTimeout)
      }
      props.store!.oppilas.tyhjennaPerusteet()

      setState({
        ...state,
        activePage: 0,
        searchText,
        searchTimeout: window.setTimeout(() => {
          if (searchText.length > 0) {
            props.store!.oppilas.haePerusteet(searchText)
          }
        }, 300)
      })
    }

    const onPaginationResultEnter =
      (index: number) => (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          setState({ ...state, activePage: index })
        }
      }

    const goToPage = (index: number) => () => {
      setState({ ...state, activePage: index })
    }

    const { store } = props
    const { searchText } = state
    const { oppilas } = store!
    const totalPages = Math.ceil(oppilas.perusteet.length / state.perPage)
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
            onSubmit={formSubmit}
            onTextChange={updateSearchText}
            value={searchText}
          />
          {state.searchText.length > 0 && oppilas.perusteet.length > 0 && (
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
                    slice(oppilas.perusteet, state.activePage * state.perPage),
                    state.perPage
                  ).map(peruste => (
                    <SearchResult
                      key={peruste.id}
                      result={peruste}
                      intl={intl}
                    />
                  ))}
                </SearchResultsList>
              </SearchResultsContainer>

              {totalPages > 1 && oppilas.perusteet.length > 0 && (
                <PagingContainer
                  aria-label={intl.formatMessage({
                    id: "ammattitutkinto.hakutuloksienSivutuksenNavigaatioAriaLabel"
                  })}
                >
                  {range(totalPages).map(index => (
                    <Page
                      key={index}
                      active={state.activePage === index}
                      aria-current={state.activePage === index}
                      onClick={goToPage(index)}
                      onKeyPress={onPaginationResultEnter(index)}
                      tabIndex={0}
                      aria-label={intl.formatMessage(
                        {
                          id: "ammattitutkinto.meneHakutuloksienSivulleAriaLabel"
                        },
                        { page: index + 1 }
                      )}
                    >
                      {index + 1}
                    </Page>
                  ))}
                </PagingContainer>
              )}
            </React.Fragment>
          )}
        </SearchContainer>
      </Section>
    )
  })
)

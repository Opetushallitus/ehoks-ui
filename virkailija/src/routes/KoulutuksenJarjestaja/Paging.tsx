import { Page, PageButton } from "components/Page"
import range from "lodash.range"
import React from "react"
import { FormattedMessage, injectIntl, IntlShape } from "react-intl"
import styled from "styled"

const PagingContainer = styled("nav")`
  margin: 40px 0 20px 20px;
`

const DotsContainer = styled("div")`
  display: inline-block;
  margin: 0 10px 0 0;
`

interface PagingProps {
  activePage: number
  totalResultsCount: number
  perPage: number
  intl: IntlShape
  goToPage: (index: number) => () => void
  onPaginationResultEnter: (
    index: number
  ) => (event: React.KeyboardEvent<Element>) => void
}

export function Paging(props: PagingProps) {
  const {
    activePage,
    intl,
    totalResultsCount,
    perPage,
    goToPage,
    onPaginationResultEnter
  } = props

  const totalPages = Math.ceil(totalResultsCount / perPage)
  const longPagination = totalPages >= 10
  // TODO: improve these checks, use less nested ternaries :)
  const firstPages = longPagination
    ? activePage < 10
      ? range(10)
      : range(1)
    : range(totalPages)
  const middlePages =
    activePage < 10 || activePage > totalPages - 10 ? [] : range(5)
  const lastPages = longPagination
    ? activePage < 10
      ? totalPages === 10
        ? range(0)
        : range(1)
      : activePage > totalPages - 10
      ? range(10)
      : range(1)
    : range(0)

  return (
    <PagingContainer
      aria-label={intl.formatMessage({
        id: "koulutuksenJarjestaja.haunSivutuksenAriaLabel"
      })}
    >
      {totalPages > 1 && (
        <PageButton
          aria-current={false}
          onClick={goToPage(activePage - 1)}
          onKeyPress={onPaginationResultEnter(activePage - 1)}
          tabIndex={0}
          disabled={activePage === 0}
        >
          <FormattedMessage
            id="koulutuksenJarjestaja.haunSivutuksenEdellinen"
            defaultMessage="Edellinen"
          />
        </PageButton>
      )}
      {firstPages.map(index => (
        <Page
          key={index}
          active={activePage === index}
          aria-current={activePage === index}
          onClick={goToPage(index)}
          onKeyPress={onPaginationResultEnter(index)}
          tabIndex={0}
          aria-label={intl.formatMessage(
            {
              id: "koulutuksenJarjestaja.meneHakutuloksienSivulleAriaLabel"
            },
            { page: index + 1 }
          )}
        >
          {index + 1}
        </Page>
      ))}
      {longPagination && totalPages > 10 && <DotsContainer>…</DotsContainer>}
      {middlePages.map(index => {
        const offsetIndex = activePage - 2 + index
        return (
          <Page
            key={offsetIndex}
            active={activePage === offsetIndex}
            aria-current={activePage === offsetIndex}
            onClick={goToPage(offsetIndex)}
            onKeyPress={onPaginationResultEnter(offsetIndex)}
            tabIndex={0}
            aria-label={intl.formatMessage(
              {
                id: "koulutuksenJarjestaja.meneHakutuloksienSivulleAriaLabel"
              },
              { page: offsetIndex + 1 }
            )}
          >
            {offsetIndex + 1}
          </Page>
        )
      })}
      {longPagination && middlePages.length > 0 && (
        <DotsContainer>…</DotsContainer>
      )}
      {lastPages.reverse().map(index => {
        const offsetIndex = totalPages - 1 - index
        return (
          <Page
            key={offsetIndex}
            active={activePage === offsetIndex}
            aria-current={activePage === offsetIndex}
            onClick={goToPage(offsetIndex)}
            onKeyPress={onPaginationResultEnter(offsetIndex)}
            tabIndex={0}
            aria-label={intl.formatMessage(
              {
                id: "koulutuksenJarjestaja.meneHakutuloksienSivulleAriaLabel"
              },
              { page: offsetIndex + 1 }
            )}
          >
            {offsetIndex + 1}
          </Page>
        )
      })}
      {totalPages > 1 && (
        <PageButton
          aria-current={false}
          onClick={goToPage(activePage + 1)}
          onKeyPress={onPaginationResultEnter(activePage + 1)}
          tabIndex={0}
          disabled={activePage === totalPages - 1}
        >
          <FormattedMessage
            id="koulutuksenJarjestaja.haunSivutuksenSeuraava"
            defaultMessage="Seuraava"
          />
        </PageButton>
      )}
    </PagingContainer>
  )
}

export default injectIntl(Paging)

import { Link } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { Page } from "components/Page"
import { Table } from "components/Table"
import { SearchableHeader } from "components/Table/SearchableHeader"
import { TableBody } from "components/Table/TableBody"
import { TableCell } from "components/Table/TableCell"
import { TableHead } from "components/Table/TableHead"
import { TableRow } from "components/Table/TableRow"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import debounce from "lodash.debounce"
import range from "lodash.range"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { SearchSortKey } from "stores/KoulutuksenJarjestajaStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

export const BackgroundContainer = styled("div")`
  background: #f8f8f8;
  height: 100%;
`

const TopContainer = styled("div")`
  display: flex;
  align-items: center;
  position: relative;
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const TableHeader = styled("th")`
  border-bottom: 1px solid ${props => props.theme.colors.table.cellBorder};
  padding: 25px 0 15px 0;
  vertical-align: top;
  text-align: left;
`

const SearchableTable = styled(Table)<{ children: React.ReactNode }>`
  table-layout: fixed;
`

const Spinner = styled(LoadingSpinner)`
  position: absolute;
  right: 0px;
`

const PagingContainer = styled("nav")`
  margin: 40px 0 20px 20px;
`

interface KoulutuksenJarjestajaProps {
  store?: IRootStore
  path?: string
}

@inject("store")
@observer
export class KoulutuksenJarjestaja extends React.Component<
  KoulutuksenJarjestajaProps
> {
  static contextTypes = {
    intl: intlShape
  }

  debouncedFetchResults = debounce(() => {
    const { koulutuksenJarjestaja, session } = this.props.store!
    koulutuksenJarjestaja.search.haeOppijat()
  }, 500)

  componentDidMount() {
    const { koulutuksenJarjestaja, session } = this.props.store!
    koulutuksenJarjestaja.search.haeOppijat()

    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  formSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  updateSearchText = (field: SearchSortKey) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.changeSearchText(field, event.target.value)
    this.debouncedFetchResults()
  }

  changeSort = (sortName: SearchSortKey) => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.changeSort(sortName)
  }

  goToPage = (index: number) => () => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.changeActivePage(index)
  }

  onPaginationResultEnter = (index: number) => (event: React.KeyboardEvent) => {
    const { koulutuksenJarjestaja } = this.props.store!
    if (event.key === "Enter" || event.key === " ") {
      koulutuksenJarjestaja.search.changeActivePage(index)
    }
  }

  render() {
    const { intl } = this.context
    const { koulutuksenJarjestaja } = this.props.store!
    const {
      activePage,
      perPage,
      sortBy,
      sortDirection,
      results,
      totalResultsCount,
      isLoading,
      searchTexts
    } = koulutuksenJarjestaja.search
    const totalPages = Math.ceil(totalResultsCount / perPage)

    return (
      <BackgroundContainer>
        <Container>
          <PaddedContent>
            <TopContainer>
              <TopHeading>
                <FormattedMessage
                  id="koulutuksenJarjestaja.title"
                  defaultMessage="Opiskelijat"
                />
              </TopHeading>
              {isLoading && <Spinner />}
            </TopContainer>
            <ContentArea>
              <SearchableTable
                sortBy={sortBy}
                sortDirection={sortDirection}
                searchTexts={searchTexts}
                onSort={this.changeSort}
                onUpdateSearchText={this.updateSearchText}
                sortTitle={intl.formatMessage({
                  id: "koulutuksenJarjestaja.jarjestaTitle"
                })}
              >
                <TableHead>
                  <TableRow>
                    <SearchableHeader sortName="nimi">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelijaTitle"
                        defaultMessage="Opiskelijan nimi"
                      />
                    </SearchableHeader>
                    <SearchableHeader sortName="tutkinto">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.tutkintoTitle"
                        defaultMessage="Tutkinto tai koulutus"
                      />
                    </SearchableHeader>
                    <SearchableHeader sortName="osaamisala">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.osaamisalaTitle"
                        defaultMessage="Osaamisala"
                      />
                    </SearchableHeader>
                    <TableHeader>
                      <FormattedMessage
                        id="koulutuksenJarjestaja.hyvaksyttyTitle"
                        defaultMessage="Ens. hyv."
                      />
                    </TableHeader>
                    <TableHeader>
                      <FormattedMessage
                        id="koulutuksenJarjestaja.paivitettyTitle"
                        defaultMessage="Päivitetty"
                      />
                    </TableHeader>
                    <TableHeader>
                      <FormattedMessage
                        id="koulutuksenJarjestaja.lkmTitle"
                        defaultMessage="Lkm"
                      />
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <colgroup>
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <TableBody>
                  {results.map(student => {
                    return (
                      <TableRow key={student.oid}>
                        <TableCell>
                          <Link
                            to={`/ehoks-ui/koulutuksenjarjestaja/${
                              student.oid
                            }`}
                          >
                            {student.nimi}
                          </Link>
                        </TableCell>
                        <TableCell>{student.tutkinto}</TableCell>
                        <TableCell>{student.osaamisala}</TableCell>
                        <TableCell>
                          {student.hyvaksytty
                            ? format(parseISO(student.hyvaksytty), "d.M.yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {student.paivitetty
                            ? format(parseISO(student.paivitetty), "d.M.yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>{student.lukumaara}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </SearchableTable>

              {totalPages > 1 && results.length > 0 && (
                <PagingContainer
                  aria-label={intl.formatMessage({
                    id: "koulutuksenJarjestaja.haunSivutuksenAriaLabel"
                  })}
                >
                  {range(totalPages).map(index => {
                    return (
                      <Page
                        key={index}
                        active={activePage === index}
                        aria-current={activePage === index}
                        onClick={this.goToPage(index)}
                        onKeyPress={this.onPaginationResultEnter(index)}
                        tabIndex={0}
                        aria-label={intl.formatMessage(
                          {
                            id:
                              "koulutuksenJarjestaja.meneHakutuloksienSivulleAriaLabel"
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
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

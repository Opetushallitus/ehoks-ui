import { Link } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
// import { LoadingSpinner } from "components/LoadingSpinner"
import { Page } from "components/Page"
import { Table } from "components/Table"
import { SearchableHeader } from "components/Table/SearchableHeader"
import { TableBody } from "components/Table/TableBody"
import { TableCell } from "components/Table/TableCell"
import { TableHead } from "components/Table/TableHead"
import { TableRow } from "components/Table/TableRow"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import range from "lodash.range"
import { inject, observer } from "mobx-react"
import { MockStudent } from "mocks/MockStudent"
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
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const SearchableTable = styled(Table)<{ children: React.ReactNode }>`
  table-layout: fixed;
`

// const Spinner = styled(LoadingSpinner)`
//   position: absolute;
//   right: 0px;
// `

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

  componentDidMount() {
    const { store } = this.props
    store!.koulutuksenJarjestaja.search.fetchStudents()

    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  toggleApprovedOnly = () => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.toggleApprovedOnly()
  }

  formSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  updateSearchText = (field: SearchSortKey) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.changeSearchText(field, event.target.value)
    koulutuksenJarjestaja.search.fetchStudents()
  }

  changeSort = (sortName: keyof MockStudent) => {
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
      sortedResults,
      results,
      // isLoading,
      searchTexts
    } = koulutuksenJarjestaja.search
    const totalPages = Math.ceil(results.length / perPage)

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
                    <SearchableHeader sortName="hyvaksytty">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.hyvaksyttyTitle"
                        defaultMessage="Ens. hyv."
                      />
                    </SearchableHeader>
                    <SearchableHeader sortName="paivitetty">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.paivitettyTitle"
                        defaultMessage="Päivitetty"
                      />
                    </SearchableHeader>
                    <SearchableHeader sortName="lukumaara">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.lkmTitle"
                        defaultMessage="Lkm"
                      />
                    </SearchableHeader>
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
                  {sortedResults.map(student => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Link
                            to={`/ehoks-ui/koulutuksenjarjestaja/${student.id}`}
                          >
                            {student.nimi}
                          </Link>
                        </TableCell>
                        <TableCell>{student.tutkinto}</TableCell>
                        <TableCell>{student.osaamisala}</TableCell>
                        <TableCell>
                          {format(parseISO(student.hyvaksytty), "d.M.yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(student.paivitetty), "d.M.yyyy")}
                        </TableCell>
                        <TableCell>{student.lukumaara}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </SearchableTable>

              {totalPages > 1 && sortedResults.length > 0 && (
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

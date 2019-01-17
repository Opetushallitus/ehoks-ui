import { Link } from "@reach/router"
import { Checkbox } from "components/Checkbox"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { Page } from "components/Page"
import { SearchField } from "components/SearchField"
import { BackgroundContainer } from "components/SectionContainer"
import { Table } from "components/Table"
import { TableBody } from "components/Table/TableBody"
import { TableCell } from "components/Table/TableCell"
import { TableHead } from "components/Table/TableHead"
import { TableHeader } from "components/Table/TableHeader"
import { TableRow } from "components/Table/TableRow"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import range from "lodash.range"
import { inject, observer } from "mobx-react"
import { MockStudent } from "mocks/MockStudent"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const TopContainer = styled("div")`
  display: flex;
  align-items: center;
`

const TopHeading = styled(Heading)`
  flex: 1;
`

const SelectionContainer = styled("div")`
  flex: 1;
`

const SearchContainer = styled("div")`
  flex: 1;
  justify-content: flex-end;
  position: relative;
`

// TODO: implement using styled-components' css helper
// when TS typings are improved
const SearchHeaderStyles = {
  justifyContent: "flex-end"
}

const Spinner = styled(LoadingSpinner)`
  position: absolute;
  right: 0px;
`

const PagingContainer = styled("nav")`
  margin: 40px 0 20px 40px;
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

  updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.changeSearchText(event.target.value)
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
      approvedOnly,
      perPage,
      sortBy,
      sortDirection,
      sortedResults,
      results,
      toggleApprovedOnly,
      isLoading,
      searchText
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

              <SelectionContainer>
                <Checkbox
                  id="showApprovedOnly"
                  checked={approvedOnly}
                  onToggle={toggleApprovedOnly}
                >
                  <FormattedMessage
                    id="koulutuksenJarjestaja.naytaOpiskelijatButton"
                    defaultMessage="Näytä vain opiskelijat, joiden HOKSin olen hyväksynyt"
                  />
                </Checkbox>
              </SelectionContainer>

              <SearchContainer>
                <SearchField
                  isLoading={isLoading}
                  onSubmit={this.formSubmit}
                  onTextChange={this.updateSearchText}
                  placeholder={intl.formatMessage({
                    id: "koulutuksenJarjestaja.hakuPlaceholder"
                  })}
                  ariaLabel={intl.formatMessage({
                    id: "koulutuksenJarjestaja.hakuAriaLabel"
                  })}
                  loadingSpinner={<Spinner />}
                  headerStyles={SearchHeaderStyles}
                  value={searchText}
                />
              </SearchContainer>
            </TopContainer>
            <ContentArea>
              <Table
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={this.changeSort}
                sortTitle={intl.formatMessage({
                  id: "koulutuksenJarjestaja.jarjestaTitle"
                })}
              >
                <TableHead>
                  <TableRow>
                    <TableHeader sortName="nimi">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelijaTitle"
                        defaultMessage="Opiskelija"
                      />
                    </TableHeader>
                    <TableHeader sortName="tutkinto">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.tutkintoTitle"
                        defaultMessage="Tutkinnon tai koulutuksen nimi"
                      />
                    </TableHeader>
                    <TableHeader sortName="aloitus">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.aloitusTitle"
                        defaultMessage="Aloitus"
                      />
                    </TableHeader>
                    <TableHeader sortName="hyvaksytty">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.hyvaksyttyTitle"
                        defaultMessage="Ens. hyväks."
                      />
                    </TableHeader>
                    <TableHeader sortName="paivitetty">
                      <FormattedMessage
                        id="koulutuksenJarjestaja.paivitettyTitle"
                        defaultMessage="Päivitetty"
                      />
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedResults.map(student => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Link to={`${student.id}`}>{student.nimi}</Link>
                        </TableCell>
                        <TableCell>{student.tutkinto}</TableCell>
                        <TableCell>
                          {format(parseISO(student.aloitus), "d.M.yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(student.hyvaksytty), "d.M.yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(student.paivitetty), "d.M.yyyy")}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 &&
                sortedResults.length > 0 && (
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

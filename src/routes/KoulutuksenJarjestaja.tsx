import { Link } from "@reach/router"
import { Checkbox } from "components/Checkbox"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { LoadingSpinner } from "components/LoadingSpinner"
import { Page } from "components/Page"
import { SearchField } from "components/SearchField"
import { Table } from "components/Table"
import { TableBody } from "components/Table/TableBody"
import { TableCell } from "components/Table/TableCell"
import { TableHead } from "components/Table/TableHead"
import { TableHeader } from "components/Table/TableHeader"
import { TableRow } from "components/Table/TableRow"
import addDays from "date-fns/addDays"
import format from "date-fns/format"
import drop from "lodash.drop"
import range from "lodash.range"
import take from "lodash.take"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Etusivu/Heading"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { BackgroundContainer } from "./Etusivu/SectionContainer"

const firstNames = [
  "Matti",
  "Timo",
  "Juha",
  "Kari",
  "Antti",
  "Tuula",
  "Ritva",
  "Leena",
  "Anne",
  "Päivi"
]
const lastNames = [
  "Korhonen",
  "Virtanen",
  "Mäkinen",
  "Nieminen",
  "Mäkelä",
  "Hämäläinen",
  "Laine",
  "Heikkinen",
  "Koskinen",
  "Järvinen"
]

const qualifications = [
  "Sosiaali- ja terveysalan perustutkinto",
  "Ravintola- ja catering-alan perustutkinto",
  "Autoalan perustutkinto",
  "Musiikkialan perustutkinto",
  "Tieto- ja viestintätekniikan perustutkinto",
  "Liiketoiminnan perustutkinto"
]

const startRange = [1451606400000, 1514764800000]

interface MockStudent {
  id: number
  nimi: string
  tutkinto: string
  aloitus: string
  hyvaksytty: string
  paivitetty: string
}

const mockStudents: MockStudent[] = Array.from(Array(100).keys()).map(key => {
  const startingDate = new Date(
    Math.floor(
      Math.random() * (startRange[1] - startRange[0] + 1) + startRange[0]
    )
  )
  const acceptedDate = addDays(
    startingDate,
    Math.floor(Math.random() * (30 - 7 + 1) + 7)
  )
  const updateDate = addDays(
    acceptedDate,
    Math.floor(Math.random() * (120 - 7 + 1) + 7)
  )
  return {
    id: key,
    nimi: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * firstNames.length)]
    }`,
    tutkinto: qualifications[Math.floor(Math.random() * qualifications.length)],
    aloitus: format(startingDate, "yyyy-MM-dd"),
    hyvaksytty: format(acceptedDate, "yyyy-MM-dd"),
    paivitetty: format(updateDate, "yyyy-MM-dd")
  }
})

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

interface KoulutuksenJarjestajaState {
  showApprovedOnly: boolean
  searchText: string
  searchTimeout: number
  sortBy: keyof MockStudent
  sortDirection: string
  activePage: number
  perPage: number
  searchResults: MockStudent[]
}

@inject("store")
@observer
export class KoulutuksenJarjestaja extends React.Component<
  KoulutuksenJarjestajaProps,
  KoulutuksenJarjestajaState
> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    showApprovedOnly: true,
    searchText: "",
    searchTimeout: 0,
    sortBy: "nimi" as keyof MockStudent,
    sortDirection: "desc",
    activePage: 0,
    perPage: 10,
    searchResults: mockStudents
  }
  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  toggleApprovedOnly = () => {
    this.setState(state => ({
      ...state,
      showApprovedOnly: !state.showApprovedOnly
    }))
  }

  formSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  updateSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value
    if (this.state.searchTimeout) {
      window.clearTimeout(this.state.searchTimeout)
    }
    this.setState(state => ({
      ...state,
      searchText,
      searchResults:
        searchText.length > 0
          ? mockStudents.filter(student => {
              return !!student.nimi.toLowerCase().match(searchText)
            })
          : mockStudents
    }))
  }

  changeSort = (sortName: keyof MockStudent) => {
    const changeDirection = (sortBy: keyof MockStudent) => sortBy === sortName
    this.setState(state => ({
      ...state,
      sortBy: sortName,
      sortDirection: changeDirection(state.sortBy)
        ? state.sortDirection === "asc"
          ? "desc"
          : "asc"
        : state.sortDirection
    }))
  }

  goToPage = (index: number) => () => {
    this.setState({ activePage: index })
  }

  onPaginationResultEnter = (index: number) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      this.setState({ activePage: index })
    }
  }

  render() {
    const { intl } = this.context
    const {
      activePage,
      perPage,
      sortBy,
      sortDirection,
      searchResults
    } = this.state
    const totalPages = Math.ceil(searchResults.length / perPage)

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
                  checked={this.state.showApprovedOnly}
                  onToggle={this.toggleApprovedOnly}
                >
                  <FormattedMessage
                    id="koulutuksenJarjestaja.naytaOpiskelijatButton"
                    defaultMessage="Näytä vain opiskelijat, joiden HOKSin olen hyväksynyt"
                  />
                </Checkbox>
              </SelectionContainer>

              <SearchContainer>
                <SearchField
                  isLoading={false}
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
                  {take(
                    drop(
                      searchResults.sort((a, b) => {
                        const reverse = sortDirection === "desc"
                        if (a[sortBy] > b[sortBy]) {
                          return reverse ? -1 : 1
                        } else if (a[sortBy] < b[sortBy]) {
                          return reverse ? 1 : -1
                        } else {
                          return 0
                        }
                      }),
                      activePage * perPage
                    ),
                    perPage
                  ).map(student => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Link to={`/test/${student.id}`}>{student.nimi}</Link>
                        </TableCell>
                        <TableCell>{student.tutkinto}</TableCell>
                        <TableCell>
                          {format(student.aloitus, "d.M.yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(student.hyvaksytty, "d.M.yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(student.paivitetty, "d.M.yyyy")}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 &&
                searchResults.length > 0 && (
                  <PagingContainer
                    aria-label={intl.formatMessage({
                      id: "koulutuksenJarjestaja.haunSivutuksenAriaLabel"
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

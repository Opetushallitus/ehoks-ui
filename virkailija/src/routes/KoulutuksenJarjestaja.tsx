import { Link, RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentArea } from "components/ContentArea"
import { FormattedDate } from "components/FormattedDate"
import { Heading } from "components/Heading"
import { LoadingSpinner } from "components/LoadingSpinner"
import { Table } from "components/Table"
import { SearchableHeader } from "components/Table/SearchableHeader"
import { TableBody } from "components/Table/TableBody"
import { TableCell } from "components/Table/TableCell"
import { TableHead } from "components/Table/TableHead"
import { TableRow } from "components/Table/TableRow"
import debounce from "lodash.debounce"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEdit } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import Paging from "routes/KoulutuksenJarjestaja/Paging"
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

interface KoulutuksenJarjestajaProps extends RouteComponentProps {
  store?: IRootStore
  // from path parameters
  orgId?: string
}

@inject("store")
@observer
export class KoulutuksenJarjestaja extends React.Component<
  KoulutuksenJarjestajaProps
> {
  static contextTypes = {
    intl: intlShape
  }
  disposeLoginReaction: IReactionDisposer

  debouncedFetchResults = debounce(() => {
    const { koulutuksenJarjestaja } = this.props.store!
    koulutuksenJarjestaja.search.fetchOppijat()
  }, 500)

  componentDidMount() {
    const { koulutuksenJarjestaja, session } = this.props.store!
    const orgId = this.props.orgId

    this.disposeLoginReaction = reaction(
      () => session.isLoggedIn && session.organisations.length > 0,
      async hasLoggedIn => {
        if (orgId && orgId !== session.selectedOrganisationOid) {
          session.changeSelectedOrganisationOid(orgId)
        }
        if (hasLoggedIn) {
          await koulutuksenJarjestaja.search.fetchOppijat()
          window.requestAnimationFrame(() => {
            window.scrollTo(0, 0)
          })
        }
      }
    )
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
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
    const { koulutuksenJarjestaja, session } = this.props.store!
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
    const selectedOrganisationOid = this.props.orgId

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
                    <SearchableHeader sortName="hoks-id" omitSortButtons={true}>
                      <FormattedMessage
                        id="koulutuksenJarjestaja.hoksIdTitle"
                        defaultMessage="eHOKS-id"
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
                    <TableHeader />
                  </TableRow>
                </TableHead>
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "5%" }} />
                </colgroup>
                <TableBody>
                  {results.map((student, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {student.lukumaara > 0 ? (
                          <Link
                            to={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${selectedOrganisationOid}/oppija/${student.oid}`}
                          >
                            {student.nimi}
                          </Link>
                        ) : (
                          student.nimi
                        )}
                      </TableCell>
                      <TableCell>{student.tutkinto}</TableCell>
                      <TableCell>{student.osaamisala}</TableCell>
                      <TableCell>{student.hoksId}</TableCell>
                      <TableCell>
                        <FormattedDate
                          date={
                            student.hyvaksytty ? student.hyvaksytty : undefined
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormattedDate
                          date={
                            student.paivitetty ? student.paivitetty : undefined
                          }
                        />
                      </TableCell>
                      <TableCell>{student.lukumaara}</TableCell>
                      <TableCell>
                        {session.hasEditPrivilege && student.editLink && (
                          <Link to={student.editLink}>
                            <MdEdit size={24} color="#000" />
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!results.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <FormattedMessage
                          id="koulutuksenJarjestaja.eiOpiskelijoitaLabel"
                          defaultMessage="Näillä hakuehdoilla ei löytynyt yhtään opiskelijaa."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SearchableTable>

              {totalResultsCount > perPage && results.length > 0 && (
                <Paging
                  activePage={activePage}
                  totalResultsCount={totalResultsCount}
                  perPage={perPage}
                  goToPage={this.goToPage}
                  onPaginationResultEnter={this.onPaginationResultEnter}
                />
              )}
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  }
}

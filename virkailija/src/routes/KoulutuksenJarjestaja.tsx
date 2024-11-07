import { Link } from "react-router-dom"
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
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { MdEdit } from "react-icons/md"
import { useIntl, FormattedMessage } from "react-intl"
import Paging from "routes/KoulutuksenJarjestaja/Paging"
import { SearchSortKey } from "stores/KoulutuksenJarjestajaStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { useParams } from "react-router"

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
  right: 0;
  top: 20px;
`

interface KoulutuksenJarjestajaProps {
  store?: IRootStore
}

export const KoulutuksenJarjestaja = inject("store")(
  observer((props: KoulutuksenJarjestajaProps) => {
    const {
      koulutuksenJarjestaja: { search },
      session
    } = props.store!
    const debouncedFetchResults = debounce(() => {
      search.fetchOppijat()
    }, 500)
    const { orgId } = useParams()

    useEffect(() => {
      if (orgId && orgId !== session.selectedOrganisationOid) {
        session.changeSelectedOrganisationOid(orgId)
      }
      if (orgId && session.isLoggedIn && session.organisations.length > 0) {
        search.fetchOppijat().then(() => {
          window.requestAnimationFrame(() => {
            window.scrollTo(0, 0)
          })
        })
      }
    }, [
      search,
      session,
      session.isLoggedIn,
      session.organisations.length,
      orgId
    ])

    const updateSearchText =
      (field: SearchSortKey) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        search.changeSearchText(field, event.target.value)
        debouncedFetchResults()
      }

    const changeSort = (sortName: SearchSortKey) => {
      search.changeSort(sortName)
    }

    const goToPage = (index: number) => () => {
      search.changeActivePage(index)
    }

    const onPaginationResultEnter =
      (index: number) => (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          search.changeActivePage(index)
        }
      }

    const intl = useIntl()
    const {
      activePage,
      perPage,
      sortBy,
      sortDirection,
      results,
      totalResultsCount,
      isLoading,
      searchTexts
    } = search

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
                onSort={changeSort}
                onUpdateSearchText={updateSearchText}
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
                            to={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${orgId}/oppija/${student.oid}`}
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
                  goToPage={goToPage}
                  onPaginationResultEnter={onPaginationResultEnter}
                />
              )}
            </ContentArea>
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    )
  })
)

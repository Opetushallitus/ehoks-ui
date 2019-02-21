import React from "react"
import { MdSearch } from "react-icons/md"
import { intlShape } from "react-intl"
import styled from "styled"
import { LoadingSpinner } from "./LoadingSpinner"
import { SimpleInterpolation } from "styled-components"

const Loading = styled(LoadingSpinner)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
    right: 20px;
  }
`

interface SearchHeaderProps {
  headerStyles?: SimpleInterpolation
}
const SearchHeader = styled("form")<SearchHeaderProps>`
  display: flex;
  align-items: center;
  ${props => props.headerStyles}
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

interface SearchFieldProps {
  onSubmit?: (event: React.FormEvent) => void
  onTextChange?: (event: React.ChangeEvent) => void
  isLoading?: boolean
  placeholder?: string
  ariaLabel?: string
  loadingSpinner?: React.ReactNode
  headerStyles?: SimpleInterpolation
  value: string
}

export class SearchField extends React.Component<SearchFieldProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { intl } = this.context
    const {
      onSubmit,
      onTextChange,
      isLoading,
      placeholder = intl.formatMessage({
        id: "ammattitutkinto.hakuPlaceholder"
      }),
      ariaLabel = intl.formatMessage({
        id: "ammattitutkinto.hakuAriaLabel"
      }),
      loadingSpinner = <Loading />,
      headerStyles = {},
      value
    } = this.props
    return (
      <SearchHeader
        role="search"
        onSubmit={onSubmit}
        headerStyles={headerStyles}
      >
        <SearchIcon size="24" />
        <SearchInput
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={onTextChange}
          required={true}
          value={value}
        />
        {isLoading && loadingSpinner}
      </SearchHeader>
    )
  }
}

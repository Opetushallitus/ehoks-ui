import React from "react"
import { MdSearch } from "react-icons/md"
import { intlShape } from "react-intl"
import styled from "styled"
import { LoadingSpinner } from "./LoadingSpinner"

const Loading = styled(LoadingSpinner)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
    right: 20px;
  }
`

const SearchHeader = styled("form")`
  display: flex;
  align-items: center;
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
  headerStyles?: React.CSSProperties
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
      <SearchHeader role="search" onSubmit={onSubmit} style={headerStyles}>
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

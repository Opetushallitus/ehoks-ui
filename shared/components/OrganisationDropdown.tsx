import React from "react"
import styled from "styled"

export interface OrganisationDropdownProps {
  oids: string[]
  value: string
  onChange: (oid: string) => void
}

const OppilaitosSelect = styled("select")`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 3px;
  margin: 10px 0;
  background: #fff;
  color: #2b2b2b;
  border-radius: 2px;
  border: 1px solid #999;
`

/**
 * OrganisationDropdown
 */
export class OrganisationDropdown extends React.Component<OrganisationDropdownProps> {

  handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { oids, value } = this.props
    return (
      <OppilaitosSelect
            value={value}
            onChange={this.handleOnChange}
          >
            {oids.map(o => (
              <option
                key={o}
                value={o}
                aria-selected={o === value}
              >
                {o}
              </option>
            ))}
          </OppilaitosSelect>
    )
  }
}
import React from "react"
import styled from "styled"
import { IOrganisation } from "types/Organisation"

export interface OrganisationDropdownProps {
  organisations: IOrganisation[]
  value: string
  lang?: string
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
export class OrganisationDropdown
  extends React.Component<OrganisationDropdownProps> {

  handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { organisations, value} = this.props
    const lang = this.props.lang || "fi"
    return (
      <OppilaitosSelect
            value={value}
            onChange={this.handleOnChange}
          >
            {organisations.map(o => (
              <option
                key={o.oid}
                value={o.oid}
                aria-selected={o.oid === value}
              >
                {o.nimi.get(lang)}
              </option>
            ))}
          </OppilaitosSelect>
    )
  }
}
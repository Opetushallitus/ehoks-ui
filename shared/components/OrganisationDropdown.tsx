import React from "react"
import styled from "styled"
import { IOrganisation } from "types/Organisation"
import { observer } from "mobx-react"

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
@observer
export class OrganisationDropdown extends React.Component<
  OrganisationDropdownProps
> {
  handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { organisations, value } = this.props
    const lang = this.props.lang || "fi"
    return (
      <OppilaitosSelect value={value} onChange={this.handleOnChange}>
        {organisations
          .slice()
          .sort((a, b) => {
            if (a.nimi < b.nimi) {
              return 1
            }
            if (a.nimi > b.nimi) {
              return -1
            }
            return 0
          })
          .map(o => (
            <option key={o.oid} value={o.oid} aria-selected={o.oid === value}>
              {o.nimi.get(lang)}
            </option>
          ))}
      </OppilaitosSelect>
    )
  }
}

import React from "react"
import styled from "react-emotion"

export interface ListColumnHeadersProps {
  title?: string
  date?: string
  className?: string
}

const ListColumnHeadersContainer = styled("div")`
  display: flex;
  align-items: center;
`

const TitleColumn = styled("div")`
  margin: 0 0 0 64px;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
`

const DateColumn = styled("div")`
  margin: 0 20px;
  font-size: 16px;
  font-weight: bold;
`

export class ListColumnHeaders extends React.Component<ListColumnHeadersProps> {
  render() {
    const { className, title, date } = this.props
    return (
      <ListColumnHeadersContainer className={className}>
        <TitleColumn>{title}</TitleColumn>
        <DateColumn>{date}</DateColumn>
      </ListColumnHeadersContainer>
    )
  }
}

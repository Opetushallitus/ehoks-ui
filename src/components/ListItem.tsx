import { AvatarImage } from "components/AvatarImage"
import React from "react"
import styled from "styled"

export interface ListItemProps {
  className?: string
  avatar?: string
  title?: string
  subtitle?: string
  date?: string
}

const ListItemContainer = styled("div")`
  display: flex;
  align-items: center;
`

const TitleContainer = styled("div")`
  flex: 1;
  & h1 {
    margin: 0;
    font-size: 22px;
  }

  & h2 {
    margin: 0;
    font-size: 16px;
  }
`

const DateUpdated = styled("div")`
  margin: 0 20px;
  font-size: 20px;
  font-weight: bold;
`

export class ListItem extends React.Component<ListItemProps> {
  render() {
    const { avatar, title, subtitle, date, className } = this.props
    return (
      <ListItemContainer className={className}>
        <AvatarImage src={avatar} />

        <TitleContainer>
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
        </TitleContainer>

        <DateUpdated>{date}</DateUpdated>
      </ListItemContainer>
    )
  }
}

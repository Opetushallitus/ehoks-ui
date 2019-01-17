import { TitleContainer } from "components/TitleContainer"
import React from "react"
import styled from "styled"

const SubHeaderContainer = styled("div")`
  display: flex;
  height: 64px;
  width: 100%;
  color: #fff;
  align-items: center;
`

const Title = styled("div")`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`

const SubTitle = styled("div")`
  font-size: 14px;
  color: #fff;
`

export interface SubHeaderProps {
  icon?: React.ReactNode
  title?: React.ReactNode
  subTitle?: React.ReactNode
  additionalContent?: React.ReactNode
}

export class SubHeader extends React.Component<SubHeaderProps> {
  render() {
    const { icon, title, subTitle, additionalContent } = this.props
    return (
      <SubHeaderContainer>
        {icon}
        <TitleContainer>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
        </TitleContainer>
        {additionalContent}
      </SubHeaderContainer>
    )
  }
}

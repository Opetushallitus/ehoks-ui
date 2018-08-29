import { AvatarImage } from "components/AvatarImage"
import { TitleContainer } from "components/TitleContainer"
import React from "react"
import styled from "react-emotion"

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

const AdditionalText = styled("div")`
  font-size: 18px;
  font-weight: bold;
  margin-left: 16px;
`

export interface SubHeaderProps {
  avatar?: string
  title?: React.ReactNode
  subTitle?: React.ReactNode
  additionalText?: React.ReactNode
}

export class SubHeader extends React.Component<SubHeaderProps> {
  render() {
    const { avatar, title, subTitle, additionalText } = this.props
    return (
      <SubHeaderContainer>
        <AvatarImage src={avatar} />
        <TitleContainer>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
        </TitleContainer>
        <AdditionalText>{additionalText}</AdditionalText>
      </SubHeaderContainer>
    )
  }
}

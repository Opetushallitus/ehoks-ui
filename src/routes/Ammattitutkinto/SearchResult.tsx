import { IPeruste } from "models/Peruste"
import React from "react"
import { MdLaunch } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import styled from "styled"

const Container = styled("div")`
  margin: 15px 0 0 0;
  padding: 20px;
  background: #f8f8f8;
  color: #020202;
  font-size: 14px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.6);

  &:first-of-type {
    margin-top: 0;
  }
`

const TitleContainer = styled("a")`
  display: flex;
  align-items: center;
  text-decoration: none;
`

const LinkIcon = styled(MdLaunch)`
  margin-right: 10px;
`

const Title = styled("div")`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.waterBlue};
  text-decoration: underline;
`

const Values = styled("div")`
  margin-top: 20px;
`

interface SearchResultProps {
  result?: IPeruste
}

export class SearchResult extends React.Component<SearchResultProps> {
  render() {
    const { result } = this.props
    return (
      <Container role="listitem">
        <TitleContainer href={result.link} target="_blank">
          <LinkIcon size={16} color="#84898C" />
          <Title>{result.title}</Title>
        </TitleContainer>
        {(result.qualificationTitles.length > 0 ||
          result.competenceAreas.length > 0) && (
          <Values>
            {result.qualificationTitles.length > 0 && (
              <div>
                <strong>
                  <FormattedMessage
                    id="ammattitutkinto.qualificationTitles"
                    defaultMessage="Tutkintonimikkeet"
                  />
                </strong>
                : {result.qualificationTitles.join(", ")}
              </div>
            )}
            {result.competenceAreas.length > 0 && (
              <div>
                <strong>
                  <FormattedMessage
                    id="ammattitutkinto.competenceAreas"
                    defaultMessage="Osaamisalat"
                  />
                </strong>
                : {result.competenceAreas.join(", ")}
              </div>
            )}
          </Values>
        )}
      </Container>
    )
  }
}

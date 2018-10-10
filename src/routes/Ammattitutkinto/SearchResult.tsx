import { Instance } from "mobx-state-tree"
import { Peruste } from "models/Peruste"
import React from "react"
import styled from "react-emotion"
import { FormattedMessage } from "react-intl"

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

const Title = styled("h2")`
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 400;
  color: #222;
`

const Link = styled("a")`
  display: flex;
  justify-content: flex-end;
  padding: 10px 30px 10px 0;
  color: ${props => props.theme.colors.waterBlue};
  font-size: 17px;
  font-weight: 600;
`

interface SearchResultProps {
  result?: Instance<typeof Peruste>
}

export class SearchResult extends React.Component<SearchResultProps> {
  render() {
    const { result } = this.props
    return (
      <Container>
        <Title>{result.title}</Title>
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
        <Link href={result.link} target="_blank">
          <FormattedMessage
            id="ammattitutkinto.qualificationContent"
            defaultMessage="Tutkinnon sisältö"
          />
        </Link>
      </Container>
    )
  }
}

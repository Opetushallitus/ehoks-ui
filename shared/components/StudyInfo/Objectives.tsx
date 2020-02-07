import React from "react"
import styled from "../../styled"
import { FormattedMessage } from "react-intl"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"

const Container = styled("div")`
  background: #fff;
`

const ObjectivesContainer = styled("div")`
  border-top: 1px solid #c9cdcf;
`

const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 10px 20px;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

interface ObjectiveProps {
}

export class Objectives extends React.Component<ObjectiveProps>{
  render() {
    return <Container>
      <ObjectivesContainer>
        <ExpandContainer>
          <ExpandTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetJaSisallot"
              defaultMessage="Tavoitteet ja sisällöt"
            />
            </ExpandTitle>
          <IconContainer
            // onClick={toggle}
            // aria-label={intl.formatMessage({
            //   id:
            //    "opiskelusuunnitelma.naytaTavoitteetjaSisallotAriaLabel"
            //})}
          >
            <Expand size={40} />
          </IconContainer>
        </ExpandContainer>
      </ObjectivesContainer>
    </Container>
  }
}
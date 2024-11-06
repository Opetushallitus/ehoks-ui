import React from "react"
import styled from "../../styled"
import { useIntl, FormattedMessage } from "react-intl"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { ToggleableItems } from "./TutkinnonOsaHelpers"
import { Collapse } from "./Collapse"
import { HorizontalLine } from "../HorizontalLine"
import { InfoTextContainer } from "./Shared"

const Container = styled("div")`
  background: #fff;
`

const Line = styled(HorizontalLine)`
  width: unset;
  margin: 0;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

const CollapseContainer = styled("div")`
  display: flex;
  padding: 20px 10px 10px 20px;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    align-items: center;
    padding-bottom: 0;
  }
`

const CollapseTitle = styled("h2")`
  margin: 0;
  flex: 1;
  cursor: pointer;
  ${(props) => props.theme.typography.heading3}

  @media screen and (max-width: ${(props) =>
    props.theme.breakpoints.Tablet}px) {
    flex: unset;
    font-size: 16px;
  }
`

const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;
  border-top: 1px solid #c9cdcf;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 10px 20px;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

const ObjectiveData = styled(InfoTextContainer)`
  margin: 10px 20px 20px 20px;
`

interface ObjectiveProps {
  expanded: boolean
  toggle: (name: ToggleableItems) => () => void
  objectives?: string
}

export const Objectives = (props: ObjectiveProps) => {
  const { expanded, toggle, objectives } = props
  const intl = useIntl()

  return (
    <Container>
      {expanded ? (
        <>
          <CollapseContainer>
            <CollapseTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.tavoitteetJaSisallot"
                defaultMessage="Tavoitteet ja sisällöt"
              />
            </CollapseTitle>
            <IconContainer
              onClick={toggle("objectives")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.piilotaTavoitteetjaSisallotAriaLabel"
              })}
            >
              <Collapse size={40} />
            </IconContainer>
          </CollapseContainer>
          <Line height="2px" backgroundColor="#000" />
          <ObjectiveData>{objectives}</ObjectiveData>
        </>
      ) : (
        <>
          <ExpandContainer>
            <ExpandTitle onClick={toggle("objectives")}>
              <FormattedMessage
                id="opiskelusuunnitelma.tavoitteetJaSisallot"
                defaultMessage="Tavoitteet ja sisällöt"
              />
            </ExpandTitle>
            <IconContainer
              onClick={toggle("objectives")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.naytaTavoitteetjaSisallotAriaLabel"
              })}
            >
              <Expand size={40} />
            </IconContainer>
          </ExpandContainer>
        </>
      )}
    </Container>
  )
}

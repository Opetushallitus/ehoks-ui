import React from "react"
import styled from "styled"
import { Competences } from "./StudyInfo/Competences"
import { Details } from "./StudyInfo/Details"

interface ContainerProps {
  accentColor?: string
  expanded: boolean
  width: string
}
const Container = styled("div")`
  display: ${(props: ContainerProps) => (props.expanded ? "block" : "flex")};
  flex: ${(props: ContainerProps) => (props.expanded ? "unset" : 1)};
  max-width: ${(props: ContainerProps) =>
    props.expanded ? "100%" : `calc(${props.width} - 15px)`};
  width: ${(props: ContainerProps) => (props.expanded ? "100%" : "unset")};
  border-top-style: solid;
  border-top-width: 4px;
  border-top-color: ${(props: ContainerProps) =>
    props.accentColor ? props.accentColor : "#979797"};
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.4);
  margin-left: ${(props: ContainerProps) => (props.expanded ? "0" : "20px")};
  margin-bottom: 20px;

  &:first-of-type {
    margin-left: 0;
  }

  @media screen and (max-width: 1060px) {
    margin-left: 0;
    max-width: unset;
  }

  &:nth-child(5n + 1) {
    margin-left: 0;
  }
`

const InnerContainer = styled("div")`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled("h2")`
  color: #000;
  font-weight: 600;
  font-size: 20px;
  display: block;
  margin: 10px 20px;
`

// TODO: use inferred type from mobx-state-tree
// TODO: translate field names to finnish for consistency?
export interface TempLearningPeriod {
  approved?: string
  period?: string[]
  instructor?: string
  assignments?: string[]
}

// TODO: use inferred type from mobx-state-tree
// TODO: translate field names to finnish for consistency?
export interface TempDemonstration {
  period: string[]
  organisation: string
  environment: string
  assessors: string[]
  assignments: string[]
}

// TODO: use inferred type from mobx-state-tree
export interface TempCompetenceRequirement {
  kuvaus: string
  arviointikriteerit: Array<{
    kuvaus: string
    kriteerit: string[]
  }>
}

export interface StudyInfoProps {
  /** Color of top border */
  accentColor?: string
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: TempCompetenceRequirement[]
  /** List of competence demonstrations */
  demonstrations?: TempDemonstration[]
  /** Color of additional info container */
  fadedColor?: string
  /**
   * List of learning periods
   * @default []
   */
  learningPeriods?: TempLearningPeriod[]
  /**
   * List of locations
   * @default []
   */
  locations?: string[]
  /** Title of the accordion, always visible */
  title?: React.ReactNode
  /**
   * Width of the element for desktop resolutions
   * @default 25%
   */
  width?: string
}

export interface StudyInfoState {
  expanded: {
    competences: boolean
    details: boolean
  }
  expandedCompetences: number[]
}

/**
 * Shows information about single study
 */
export class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  state: StudyInfoState = {
    expanded: {
      competences: false,
      details: false
    },
    expandedCompetences: []
  }

  toggle = (name: "competences" | "details") => () => {
    this.setState(state => ({
      ...state,
      expanded: { ...state.expanded, [name]: !state.expanded[name] }
    }))
  }

  expandCompetence = (index: number) => () => {
    this.setState((state: StudyInfoState) => ({
      expandedCompetences:
        state.expandedCompetences.indexOf(index) > -1
          ? state.expandedCompetences.filter(i => i !== index)
          : [...state.expandedCompetences, index]
    }))
  }

  expandAll = () => {
    this.setState({
      expandedCompetences: (this.props.competenceRequirements || []).map(
        (_, i) => i
      )
    })
  }

  collapseAll = () => {
    this.setState({ expandedCompetences: [] })
  }

  render() {
    const {
      accentColor,
      competenceRequirements = [],
      demonstrations = [],
      fadedColor,
      locations = [],
      learningPeriods = [],
      title,
      width = "25%"
    } = this.props
    const { expandedCompetences, expanded } = this.state

    const hasDetails =
      (learningPeriods && learningPeriods.length > 0) ||
      demonstrations.length > 0

    return (
      <Container
        accentColor={accentColor}
        expanded={expanded.competences || expanded.details}
        width={width}
      >
        <InnerContainer>
          <Title>{title}</Title>
          {hasDetails && (
            <Details
              accentColor={accentColor}
              demonstrations={demonstrations}
              expanded={expanded.details}
              learningPeriods={learningPeriods}
              locations={locations}
              toggle={this.toggle}
            />
          )}
          <Competences
            collapseAll={this.collapseAll}
            competenceRequirements={competenceRequirements}
            expandAll={this.expandAll}
            expandCompetence={this.expandCompetence}
            expanded={expanded.competences}
            expandedCompetences={expandedCompetences}
            fadedColor={fadedColor}
            toggle={this.toggle}
          />
        </InnerContainer>
      </Container>
    )
  }
}

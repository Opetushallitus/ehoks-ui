import { RouteComponentProps } from "@reach/router"
import { ContentArea } from "components/ContentArea"
import { EmptyItem } from "components/EmptyItem"
import { HeadingContainer, HelpHeading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { StudiesContainer } from "components/StudiesContainer"
import { StudyInfo } from "components/StudyInfo"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { TutkinnonOsa } from "models/helpers/TutkinnonOsa"
import styled from "styled"
import { FetchShareLinks } from "stores/ShareLinkStore"

const Container = styled(StudiesContainer)`
  margin-top: 0;
`

export interface AiempiOsaaminenProps {
  children?: React.ReactChildren
  heading?: React.ReactNode
  studies: Array<TutkinnonOsa>
  fetchShareLinks: FetchShareLinks
}

export interface AiempiOsaaminenState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

export class AiempiOsaaminen extends React.Component<
  AiempiOsaaminenProps & RouteComponentProps,
  AiempiOsaaminenState
> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activeAccordions: {
      previousCompetence: false
    }
  }

  toggleAccordion = (accordion: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]: !state.activeAccordions[accordion]
      }
    }))
  }

  render() {
    const {
      fetchShareLinks,
      studies,
      heading = (
        <FormattedMessage
          id="aiempiOsaaminen.title"
          defaultMessage="Aiempi osaamiseni"
        />
      )
    } = this.props
    const { intl } = this.context
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })

    return (
      <React.Fragment>
        <HeadingContainer>
          <HelpHeading>{heading}</HelpHeading>
          <HelpPopup
            helpContent={
              <FormattedMessage
                id="aiempiOsaaminen.titleHelpLabel"
                defaultMessage="Tietoa aiemmasta osaamisesta"
              />
            }
          />
        </HeadingContainer>

        <ContentArea>
          <Container>
            {studies.map((study, i) => {
              const renderExtraItem = (i + 1) % 4 === 0
              return (
                <React.Fragment key={i}>
                  <StudyInfo
                    accentColor="#43A047"
                    fadedColor="#ECF6ED"
                    fetchShareLinks={fetchShareLinks}
                    title={study.opintoOtsikko(competencePointsTitle)}
                    learningPeriods={study.harjoittelujaksot}
                    competenceRequirements={study.osaamisvaatimukset}
                    demonstrations={study.naytot}
                    verificationProcess={study.todentamisenProsessi}
                  />
                  {renderExtraItem && <EmptyItem />}
                </React.Fragment>
              )
            })}
            {!studies.length && (
              <div>
                <FormattedMessage
                  id="aiempiOsaaminen.eiAiempaaOsaamista"
                  defaultMessage="Ei aiempia opintoja"
                />
                .
              </div>
            )}
          </Container>
        </ContentArea>
      </React.Fragment>
    )
  }
}

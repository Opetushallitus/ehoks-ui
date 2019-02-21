import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { HOKSButton } from "components/HOKSButton"
import { NavigationContainer } from "components/NavigationContainer"
import { BackgroundContainer } from "components/SectionContainer"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const SuunnitelmaContainer = styled("div")`
  display: flex;
  align-items: center;
  border: 1px solid #979797;
  background: #fff;
  padding: 15px 15px 15px 30px;
  margin-bottom: 20px;

  &:first-of-type {
    margin-top: 20px;
  }
`

const Text = styled("div")`
  flex: 1;
  font-size: 20px;
  font-weight: 600;
`

interface ValitseHOKSProps {
  suunnitelmat: IRootStore["hoks"]["suunnitelmat"]
}

@observer
export class ValitseHOKS extends React.Component<
  ValitseHOKSProps & RouteComponentProps
> {
  render() {
    const { suunnitelmat } = this.props

    return (
      <React.Fragment>
        <NavigationContainer>
          <Container>
            <PaddedContent>
              <Heading>
                <FormattedMessage
                  id="valinta.title"
                  defaultMessage="Ammattillisten opintojen henkilökohtaistaminen"
                />
              </Heading>
            </PaddedContent>
          </Container>
        </NavigationContainer>

        <BackgroundContainer>
          <Container>
            <PaddedContent>
              <Heading>
                <FormattedMessage
                  id="valinta.voimassaOlevatSuunnitelmasiTitle"
                  defaultMessage="Voimassa olevat suunnitelmasi"
                />
              </Heading>

              {suunnitelmat.map((suunnitelma, i) => {
                return (
                  <SuunnitelmaContainer key={i}>
                    <Text>
                      {suunnitelma.tutkinnonNimi}, {suunnitelma.oppilaitos}.{" "}
                      {suunnitelma.keskeytysPvm ? (
                        <span>
                          <FormattedMessage
                            id="valinta.opinnotKeskeytyneetTitle"
                            defaultMessage="Opinnot keskeytyneet"
                          />{" "}
                          {format(
                            parseISO(suunnitelma.keskeytysPvm),
                            "d.M.yyyy"
                          )}
                        </span>
                      ) : (
                        <span>
                          <FormattedMessage
                            id="valinta.aloitettuTitle"
                            defaultMessage="Aloitettu"
                          />{" "}
                          {format(parseISO(suunnitelma.aloitusPvm), "d.M.yyyy")}
                        </span>
                      )}
                      .
                    </Text>

                    <HOKSButton to={`/ehoks/suunnittelu/${suunnitelma.eid}`}>
                      <FormattedMessage
                        id="valinta.avaaHoksTitle"
                        defaultMessage="Avaa HOKS"
                      />
                    </HOKSButton>
                  </SuunnitelmaContainer>
                )
              })}
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}

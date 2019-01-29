import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { HOKSButton } from "components/HOKSButton"
import { NavigationContainer } from "components/NavigationContainer"
import { BackgroundContainer } from "components/SectionContainer"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const Suunnitelma = styled("div")`
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
  store?: IRootStore
}

@inject("store")
@observer
export class ValitseHOKS extends React.Component<
  ValitseHOKSProps & RouteComponentProps
> {
  disposeLoginReaction: IReactionDisposer
  componentDidMount() {
    const { store } = this.props
    this.disposeLoginReaction = reaction(
      () => store!.session.isLoggedIn,
      isLoggedIn => {
        // navigate to Opintopolku logout url after logging out
        if (!isLoggedIn) {
          window.location.href = this.props.store!.environment.opintopolkuLogoutUrl
        }
      }
    )
    store!.hoks.haeSuunnitelmat()
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  render() {
    const store = this.props.store!

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

              {store.hoks.suunnitelmat.map((suunnitelma, i) => {
                return (
                  <Suunnitelma key={i}>
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
                  </Suunnitelma>
                )
              })}
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}

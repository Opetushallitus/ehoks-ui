import React from "react"
import { navigate } from "@reach/router"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { ShareType } from "stores/NotificationStore"
import { HeroButton } from "components/Button"

interface ColorProps {
  background: string
}

const ShareContainer = styled("div")`
  background: #fff;
  border: 1px solid #030303;
  padding: 20px;
  margin: 10px;
`

const ShareHeaderContainer = styled("div")`
  display: flex;
  flex-direction: row;
`

const ShareHeader = styled("div")`
  flex: 1;
`

const ShareTitle = styled("h1")`
  font-weight: 400;
  margin: 0 0 16px 0;
`

const ShareDescription = styled("strong")`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
`

const ChildContainer = styled("div")`
  border: 1px solid #979797;
  background: ${(props: ColorProps) => props.background};
`

const Button = styled(HeroButton)`
  display: inline-flex;
  margin-right: 40px;
`

interface ShareDialogProps {
  active: boolean
  background: string
  koodiUri: string
  type: ShareType
}

export class ShareDialog extends React.Component<ShareDialogProps> {
  ref = React.createRef<HTMLDivElement>()

  componentDidMount() {
    window.requestAnimationFrame(() => {
      if (this.ref && this.ref.current) {
        this.ref.current.scrollIntoView({ block: "end", behavior: "smooth" })
      }
    })
  }

  close = () => {
    // as query params are the master data for sharing,
    // closing the dialog is achieved by clearing them
    navigate(window.location.pathname)
  }

  render() {
    const { active, background, children, type } = this.props
    return (
      <React.Fragment>
        {active ? (
          <ShareContainer ref={this.ref}>
            <ShareHeaderContainer>
              <ShareHeader>
                <ShareTitle>
                  {type === "naytto" ? (
                    <FormattedMessage
                      id="jakaminen.naytonTietojenJakaminenTitle "
                      defaultMessage="Näytön tietojen jakaminen"
                    />
                  ) : (
                    <FormattedMessage
                      id="jakaminen.tutkinnonosanTietojenJakaminenTitle "
                      defaultMessage="Tutkinnonosan tietojen jakaminen"
                    />
                  )}
                </ShareTitle>

                <ShareDescription>
                  {type === "naytto" ? (
                    <FormattedMessage
                      id="jakaminen.naytonJakoDescription"
                      defaultMessage="Olet jakamassa näitä näytön tietoja"
                    />
                  ) : (
                    <FormattedMessage
                      id="jakaminen.tutkinnonosanJakoDescription"
                      defaultMessage="Olet jakamassa näitä tutkinnonosan tietoja"
                    />
                  )}
                </ShareDescription>
              </ShareHeader>
              <div>
                <Button onClick={this.close} secondary={true}>
                  <FormattedMessage
                    id="jakaminen.suljeButtonTitle"
                    defaultMessage="Sulje"
                  />
                </Button>
              </div>
            </ShareHeaderContainer>
            <ChildContainer background={background}>{children}</ChildContainer>
          </ShareContainer>
        ) : (
          children
        )}
      </React.Fragment>
    )
  }
}

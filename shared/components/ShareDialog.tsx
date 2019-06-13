import React, { useState, useRef, useEffect, useContext } from "react"
import { navigate } from "@reach/router"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { ShareType } from "stores/NotificationStore"
import { HeroButton } from "components/Button"
import { ModalWithBackground } from "components/Modal"
import { fetchLinks, ShareLink } from "components/ShareDialog/fetchLinks"
import { APIConfigContext } from "components/APIConfigContext"

interface ColorProps {
  background: string
}

const ShareContainer = styled("div")`
  background: #fff;
  border: 1px solid #030303;
  padding: 20px;
  margin: 10px;
  z-index: 10;
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
  margin-top: 10px;
  margin-bottom: 10px;
`

const SharedLinks = styled("ul")`
  list-style: none;
  padding: 0;
  border: 1px solid #999;
  li:nth-child(odd) {
    background: transparent;
  }
`

const SharedLink = styled("li")`
  display: flex;
  background: #fafafa;
  padding: 10px;
`

const LinkItem = styled("div")`
  flex: 1;
  font-size: 16px;
`

const LinkAnchor = styled(LinkItem)`
  flex: unset;
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
  children: any // TODO: fix
  koodiUri: string
  type: ShareType
}

export function ShareDialog(props: ShareDialogProps) {
  const { active, background, children, koodiUri, type } = props
  const ref = useRef<HTMLDivElement>(null)
  const [sharedLinks, setSharedLinks] = useState<Array<ShareLink>>([])
  const apiConfig = useContext(APIConfigContext)

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (ref && ref.current) {
        // ensures that share dialog is visible
        ref.current.scrollIntoView({ block: "end", behavior: "smooth" })
      }
    })

    const fetchData = async () => {
      const links = await fetchLinks(koodiUri, type, apiConfig)
      setSharedLinks(links)
    }
    fetchData()
  }, [])

  const close = () => {
    // as query params are the master data for sharing,
    // closing the dialog is achieved by clearing them
    navigate(window.location.pathname)
  }

  // TODO: to be implemented
  const remove = (event: React.MouseEvent, id: number) => {
    event.preventDefault()
    console.log("clicked remove for", id)
    confirm("Haluatko varmasti poistaa valitun jakolinkin?")
  }

  return (
    <React.Fragment>
      {active ? (
        <ShareContainer ref={ref}>
          <ModalWithBackground />
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
              <Button onClick={close} secondary={true}>
                <FormattedMessage
                  id="jakaminen.suljeButtonTitle"
                  defaultMessage="Sulje"
                />
              </Button>
            </div>
          </ShareHeaderContainer>
          <ChildContainer background={background}>{children}</ChildContainer>
          <ShareDescription>
            {type === "naytto" ? (
              <FormattedMessage
                id="jakaminen.aiemmatNaytonJaotDescription"
                defaultMessage="Aiemmin tekemäsi näytön jakolinkit"
              />
            ) : (
              <FormattedMessage
                id="jakaminen.aiemmatTutkinnonosanJaotDescription"
                defaultMessage="Aiemmin tekemäsi tutkinnonosan jakolinkit"
              />
            )}
          </ShareDescription>
          <SharedLinks>
            {sharedLinks.map((link, i) => {
              return (
                <SharedLink key={i}>
                  <LinkItem>
                    Linkki luotu {link.createdAt}, voimassa {link.validFrom} -{" "}
                    {link.validTo}
                  </LinkItem>
                  <LinkItem>{link.url}</LinkItem>
                  <LinkAnchor>
                    <a
                      href=""
                      onClick={(event: React.MouseEvent) =>
                        remove(event, link.id)
                      }
                    >
                      Poista linkki
                    </a>
                  </LinkAnchor>
                </SharedLink>
              )
            })}
          </SharedLinks>
        </ShareContainer>
      ) : (
        children
      )}
    </React.Fragment>
  )
}

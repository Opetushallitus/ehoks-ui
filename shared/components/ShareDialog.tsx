import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useLayoutEffect
} from "react"
import { navigate } from "@reach/router"
import { FormattedMessage, injectIntl, InjectedIntl } from "react-intl"
import styled from "styled"
import { ShareType } from "stores/NotificationStore"
import { HeroButton } from "components/Button"
import { ModalWithBackground } from "components/ModalDialogs/Modal"
import {
  fetchLinks,
  createLink,
  ShareLink,
  removeLink
} from "./ShareDialog/API"
import { APIConfigContext } from "components/APIConfigContext"
import CopyToClipboard from "react-copy-to-clipboard"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { HOKSEidContext } from "components/HOKSEidContext"
import { AppContext } from "components/AppContext"

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

const ShareColumns = styled("div")`
  display: flex;
  align-items: center;
`

const ShareColumn = styled("div")`
  flex: 1;
`

const TitleColumn = styled("div")`
  padding-right: 20px;
`

const ButtonsContainer = styled(ShareColumn)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    flex-direction: column;
  }
`

const Subtitle = styled("strong")`
  display: block;
  font-size: 16px;
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

const ShareButton = styled(Button)`
  width: 260px;
  padding: 15px;
  justify-content: center;
`

const DateInput = styled("input")`
  border: 1px solid #999;
  height: 34px;
  padding: 10px;
  font-size: 14px;
`

interface ShareDialogProps {
  active: boolean
  background: string
  children: any // TODO: fix
  koodiUri: string
  type: ShareType,
  uuid: string
  tutkinnonOsaTyyppi: string
  defaultPeriod?: { start?: string; end?: string }
  instructor?: { name: string; organisation?: string; email: string }
  intl?: InjectedIntl
}

export function ShareDialog(props: ShareDialogProps) {
  const {
    active,
    background,
    children,
    defaultPeriod,
    instructor,
    koodiUri,
    type,
    uuid,
    tutkinnonOsaTyyppi,
    intl
  } = props

  const { featureFlags } = useContext(AppContext)

  // disable share dialog if feature flag is set to non-truthy value
  if (!featureFlags.shareDialog) {
    return children
  }

  const ref = useRef<HTMLDivElement>(null)
  const [sharedLinks, setSharedLinks] = useState<Array<ShareLink>>([])
  const [startDate, setStartDate] = useState(
    defaultPeriod ? defaultPeriod.start || "" : ""
  )
  const [endDate, setEndDate] = useState(
    defaultPeriod ? defaultPeriod.end || "" : ""
  )
  const [createdUrl, setCreatedUrl] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [instructorCopied, setInstructorCopied] = useState(false)
  const apiConfig = useContext(APIConfigContext)

  // NOTE: we use HOKSEidContext to prevent passing `eid` prop all the way
  // from OmienOpintojenSuunnittelu -> OpiskeluSuunnitelma -> StudyInfo -> Details -> ShareDialog
  const eid = useContext(HOKSEidContext) || ""

  useLayoutEffect(() => {
    window.requestAnimationFrame(() => {
      if (ref && ref.current) {
        // ensures that share dialog is visible
        ref.current.scrollIntoView({ block: "end", behavior: "smooth" })
      }
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setSharedLinks(await fetchLinks(apiConfig, uuid))
    }
    fetchData()
  }, [])

  const addLink = async () => {
    const createdUuid = await createLink({
      eid,
      startDate,
      endDate,
      uuid,
      tutkinnonOsaTyyppi,
      apiConfig
    })
    setSharedLinks(await fetchLinks(apiConfig, uuid))
    setCreatedUrl(`https://not.implemented.yet/jako/${createdUuid}`)
  }

  const close = () => {
    // as query params are the master data for sharing,
    // closing the dialog is achieved by clearing them
    navigate(window.location.pathname)
  }

  const remove = async (event: React.MouseEvent, uuid: string) => {
    event.preventDefault()
    if (
      confirm(
        intl!.formatMessage({
          id: "jakaminen.haluatkoPoistaaConfirm"
        })
      )
    ) {
      await removeLink({
        eid,
        koodiUri,
        uuid,
        apiConfig
      })
      setSharedLinks(await fetchLinks(apiConfig, uuid))
      setCreatedUrl("")
    }
  }

  const copyLinkNotification = () => {
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, 3000)
  }

  const copyInstructorNotification = () => {
    setInstructorCopied(true)
    setTimeout(() => {
      setInstructorCopied(false)
    }, 3000)
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
                    <FormattedMessage
                      id="jakaminen.linkki"
                      defaultMessage="Linkki"
                    />{" "}
                    <FormattedMessage
                      id="jakaminen.voimassa"
                      defaultMessage="voimassa"
                    />{" "}
                    {format(parseISO(link.validFrom), "dd.MM.yyyy")} -{" "}
                    {format(parseISO(link.validTo), "dd.MM.yyyy")}
                  </LinkItem>
                  <LinkItem>{link.uuid}</LinkItem>
                  <LinkAnchor>
                    <a
                      href=""
                      onClick={(event: React.MouseEvent) =>
                        remove(event, link.uuid)
                      }
                    >
                      <FormattedMessage
                        id="jakaminen.poistaLinkki"
                        defaultMessage="Poista linkki"
                      />
                    </a>
                  </LinkAnchor>
                </SharedLink>
              )
            })}
          </SharedLinks>
          <div>
            <div>
              <ShareColumns>
                <ShareColumn>
                  {createdUrl && (
                    <ShareColumns>
                      <ShareColumn>
                        <Subtitle>
                          {type === "naytto" ? (
                            <FormattedMessage
                              id="jakaminen.linkkiNaytonTietoihin"
                              defaultMessage="Linkki näytön tietoihin"
                            />
                          ) : (
                              <FormattedMessage
                                id="jakaminen.linkkiTutkinnonosanTietoihin"
                                defaultMessage="Linkki tutkinnonosan tietoihin"
                              />
                            )}
                        </Subtitle>
                      </ShareColumn>
                      <ShareColumn>{createdUrl}</ShareColumn>
                    </ShareColumns>
                  )}
                  <ShareColumns>
                    <TitleColumn>
                      <Subtitle>
                        <FormattedMessage
                          id="jakaminen.linkinVoimassaolo"
                          defaultMessage="Linkin voimassaolo"
                        />
                      </Subtitle>
                    </TitleColumn>
                    <ShareColumn>
                      <DateInput
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                      />{" "}
                      -{" "}
                      <DateInput
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                      />
                    </ShareColumn>
                  </ShareColumns>
                </ShareColumn>
                <ButtonsContainer>
                  <ShareButton onClick={addLink}>
                    <FormattedMessage
                      id="jakaminen.luoUusiLinkki"
                      defaultMessage="Luo uusi linkki"
                    />
                  </ShareButton>
                  {createdUrl && !linkCopied && (
                    <CopyToClipboard
                      text={createdUrl}
                      onCopy={copyLinkNotification}
                    >
                      <ShareButton>
                        <FormattedMessage
                          id="jakaminen.kopioiJaettavaLinkki"
                          defaultMessage="Kopioi jaettava linkki"
                        />
                      </ShareButton>
                    </CopyToClipboard>
                  )}
                  {createdUrl && linkCopied && (
                    <ShareButton disabled={true}>
                      <FormattedMessage
                        id="jakaminen.linkkiKopioitiin"
                        defaultMessage="Linkki kopioitiin leikepöydälle"
                      />
                    </ShareButton>
                  )}
                </ButtonsContainer>
              </ShareColumns>
            </div>
            {instructor && instructor.email && (
              <ShareColumns>
                <ShareColumn>
                  <ShareColumns>
                    <TitleColumn>
                      <Subtitle>
                        <FormattedMessage
                          id="jakaminen.tyopaikkaohjaaja"
                          defaultMessage="Työpaikkaohjaaja"
                        />
                      </Subtitle>
                    </TitleColumn>
                    <ShareColumn>
                      {instructor.name}, {instructor.organisation}{" "}
                      {instructor.email}
                    </ShareColumn>
                  </ShareColumns>
                </ShareColumn>
                <ButtonsContainer>
                  {instructor.email && !instructorCopied && (
                    <CopyToClipboard
                      text={instructor.email}
                      onCopy={copyInstructorNotification}
                    >
                      <ShareButton>
                        <FormattedMessage
                          id="jakaminen.kopioiOhjaajanSahkoposti"
                          defaultMessage="Kopioi sähköpostiosoite"
                        />
                      </ShareButton>
                    </CopyToClipboard>
                  )}
                  {instructor.email && instructorCopied && (
                    <ShareButton disabled={true}>
                      <FormattedMessage
                        id="jakaminen.sahkopostiKopioitiin"
                        defaultMessage="Sähköpostiosoite kopioitiin leikepöydälle"
                      />
                    </ShareButton>
                  )}
                </ButtonsContainer>
              </ShareColumns>
            )}
          </div>
        </ShareContainer>
      ) : (
          children
        )}
    </React.Fragment>
  )
}

export default injectIntl(ShareDialog)

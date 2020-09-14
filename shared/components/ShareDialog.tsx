import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import { navigate } from "@reach/router"
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl"
import styled from "styled"
import { HeroButton, LinkButton } from "components/Button"
import { ModalWithBackground } from "components/ModalDialogs/Modal"
import {
  createLink,
  fetchLinks,
  removeLink,
  ShareLink
} from "./ShareDialog/API"
import { APIConfigContext } from "components/APIConfigContext"
import CopyToClipboard from "react-copy-to-clipboard"
import { FormattedDate } from "components/FormattedDate"
import { AppContext } from "components/AppContext"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"

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

const RemoveLinkButton = styled(LinkButton)`
  color: #1976d2;
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

export interface Instructor {
  name: string
  organisation?: string
  email: string
}

export interface ShareLinkValidityPeriod {
  start?: string
  end?: string
}

interface ShareDialogProps extends InjectedIntlProps {
  active: boolean
  background: string
  /* Used version of react-intl cannot handle React.ReactNode here */
  children: any
  moduleId: string
  hoksEid: string
  type: ShareType
  defaultPeriod?: ShareLinkValidityPeriod
  instructor?: Instructor
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaModuleId: string
  intl: ReactIntl.InjectedIntl
}

export function ShareDialog(props: ShareDialogProps) {
  const {
    active,
    background,
    children,
    defaultPeriod,
    instructor,
    moduleId,
    hoksEid,
    type,
    tutkinnonOsaTyyppi,
    tutkinnonOsaModuleId,
    intl
  } = props

  const ref = useRef<HTMLDivElement>(null)
  const [sharedLinks, setSharedLinks] = useState<ShareLink[]>([])
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
      setSharedLinks(await fetchLinks(moduleId, apiConfig))
    }
    fetchData()
  }, [apiConfig, moduleId])

  const addLink = async () => {
    if (tutkinnonOsaTyyppi) {
      const createdUuid = await createLink({
        moduleId,
        hoksEid,
        startDate,
        endDate,
        type,
        tutkinnonOsaTyyppi,
        tutkinnonOsaModuleId,
        apiConfig
      })
      setSharedLinks(await fetchLinks(moduleId, apiConfig))
      setCreatedUrl(
        `${window.location.origin}/ehoks-tyopaikantoimija-ui/${createdUuid}`
      )
    }
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
        // eslint-disable-next-line react/prop-types
        intl.formatMessage({
          id: "jakaminen.haluatkoPoistaaConfirm"
        })
      )
    ) {
      await removeLink({
        uuid,
        apiConfig
      })
      setSharedLinks(await fetchLinks(moduleId, apiConfig))
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
          {/* Invision designs do not have modal, but it was decided to use */}
          <ModalWithBackground />
          <ShareHeaderContainer>
            <ShareHeader>
              <ShareTitle>
                {type === ShareType.osaamisenosoittaminen ? (
                  <FormattedMessage
                    id="jakaminen.naytonTietojenJakaminenTitle "
                    defaultMessage="Näytön tietojen jakaminen"
                  />
                ) : (
                  <FormattedMessage
                    id="jakaminen.osaamisenHankkimistavanTietojenJakaminenTitle "
                    defaultMessage="Osaamisenhankkimistavan tietojen jakaminen"
                  />
                )}
              </ShareTitle>

              <ShareDescription>
                {type === ShareType.osaamisenosoittaminen ? (
                  <FormattedMessage
                    id="jakaminen.naytonJakoDescription"
                    defaultMessage="Olet jakamassa näitä näytön tietoja"
                  />
                ) : (
                  <FormattedMessage
                    id="jakaminen.osaamisenhankkimistavanJakoDescription"
                    defaultMessage="Olet jakamassa näitä tietoja"
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
            {type === ShareType.osaamisenosoittaminen ? (
              <FormattedMessage
                id="jakaminen.aiemmatNaytonJaotDescription"
                defaultMessage="Aiemmin tekemäsi näytön jakolinkit"
              />
            ) : (
              <FormattedMessage
                id="jakaminen.aiemmatOsaamisenHankkimistavanJaotDescription"
                defaultMessage="Aiemmin tekemäsi jakolinkit"
              />
            )}
          </ShareDescription>
          <SharedLinks>
            {sharedLinks.map((link, i) => (
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
                  <FormattedDate date={link.validFrom} /> -{" "}
                  <FormattedDate date={link.validTo} />
                </LinkItem>
                <LinkItem>{link.jakoUuid}</LinkItem>
                <LinkAnchor>
                  <RemoveLinkButton
                    onClick={(event: React.MouseEvent) =>
                      remove(event, link.jakoUuid)
                    }
                  >
                    <FormattedMessage
                      id="jakaminen.poistaLinkki"
                      defaultMessage="Poista linkki"
                    />
                  </RemoveLinkButton>
                </LinkAnchor>
              </SharedLink>
            ))}
          </SharedLinks>
          <div>
            <div>
              <ShareColumns>
                <ShareColumn>
                  {createdUrl && (
                    <ShareColumns>
                      <ShareColumn>
                        <Subtitle>
                          {type === ShareType.osaamisenosoittaminen ? (
                            <FormattedMessage
                              id="jakaminen.linkkiNaytonTietoihin"
                              defaultMessage="Linkki näytön tietoihin"
                            />
                          ) : (
                            <FormattedMessage
                              id="jakaminen.linkkiJaettuihinTietoihin"
                              defaultMessage="Linkki jaettuihin tietoihin"
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

const TestForFeatureFlagShareDialog = (props: ShareDialogProps) => {
  const { featureFlags } = useContext(AppContext)
  // disable share dialog if feature flag is set to non-truthy value
  if (!featureFlags.shareDialog) {
    return props.children
  }
  return <ShareDialog {...props} />
}

export default injectIntl(TestForFeatureFlagShareDialog)

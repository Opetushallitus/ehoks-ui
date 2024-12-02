import React from "react"

export type VirkailijaRaamitProps = {
  scriptUrl: string
}

export const UiVirkailijaRaamit = ({ scriptUrl }: VirkailijaRaamitProps) => {
  React.useEffect(() => {
    const showRaamit = !!scriptUrl

    let scriptElement: HTMLScriptElement

    if (showRaamit) {
      scriptElement = document.createElement("script")
      scriptElement.src = scriptUrl

      document.body.appendChild(scriptElement)
    }

    return () => {
      if (scriptElement) document.body.removeChild(scriptElement)
    }
  }, [scriptUrl])

  return null
}

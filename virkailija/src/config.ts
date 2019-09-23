const defaultConfig = () => ({
  backendUrl: `/ehoks-virkailija-backend/api/v1`
})

const config = (() => {
  const appEl = document.getElementById("app")

  if (appEl == null) {
    return defaultConfig()
  }

  const data = appEl.getAttribute("data-app-boot-config")

  if (data == null || data === "APP-BOOT-CONFIG-DEFAULT") {
    return defaultConfig()
  }

  return JSON.parse(data)
})()

if (/\bdebug=1\b/.test(window.location.search)) {
  console.log("Config: ", config)
}

const backendUrl = config.backendUrl

export const apiUrl = (path: string) => `${backendUrl}/${path}`
export const apiPrefix = "virkailija"
export const callerId = "1.2.246.562.10.00000000001.ehoks.ehoks-ui.virkailija"

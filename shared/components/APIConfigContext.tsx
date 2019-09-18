import React from "react"

export interface APIConfig {
  apiUrl: (path: string) => string
  apiPrefix: string
}

export const APIConfigContext = React.createContext<APIConfig>({
  apiUrl: (path: string) => path,
  apiPrefix: ""
})

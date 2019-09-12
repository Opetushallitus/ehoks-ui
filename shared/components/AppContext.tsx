import React from "react"

// AppContext can be used as kind of feature flag,
// e.g. disabling ShareDialog in virkailija app

// Usage:
// Wrap your <App /> with <AppContext.Provider value="app_name">
// and in your component you can retrieve the current app using
// const app = useContext(AppContext) // => "app_name"
export const AppContext = React.createContext<string>("")

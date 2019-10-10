import React from "react"

interface AppContextShape {
  app: string
  featureFlags: { shareDialog: boolean; shareNotifications: boolean }
}

// AppContext can be used for easily getting the current
// app name and feature flags deep down the React tree

// Usage
//
// Wrap your <App /> with:
// <AppContext.Provider
//   value={
//     {
//       app: "app_name",
//       featureFlags: {
//         shareDialog: false,
//         shareNotifications: false
//       }
//     }
//   }
// >
// and then in your component you can retrieve the current app
// and feature flags using:
// const { app, featureFlags } = useContext(AppContext)
// app => "app_name"
// featureFlags => { shareDialog: false, shareNotifications: false }
export const AppContext = React.createContext<AppContextShape>({
  app: "",
  featureFlags: {
    shareDialog: false,
    shareNotifications: false
  }
})

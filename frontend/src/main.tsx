import React from "react"
import ReactDOM from "react-dom/client"
import AppRouter from "./AppRouter"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import SessionBootstrap from "./features/auth/SessionBootstrap"
import "./styles.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><Provider store={store}><SessionBootstrap><BrowserRouter><AppRouter /></BrowserRouter></SessionBootstrap></Provider></React.StrictMode>,
)

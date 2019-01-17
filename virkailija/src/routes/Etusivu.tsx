import { Link } from "@reach/router"
import React from "react"

interface EtusivuProps {
  path?: string
}

export class Etusivu extends React.Component<EtusivuProps> {
  render() {
    return (
      <div>
        <h1>Etusivu</h1>
        <ul>
          <li>
            <Link to="/hoks/uusi">Luo uusi HOKS</Link>
          </li>
          <li>
            <Link to="/koulutuksenjarjestaja">
              Kirjaudu koulutuksen järjestäjänä
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

import React from "react"
import { FormattedMessage } from "react-intl"
import { Section } from "routes/Ammattitutkinto/Section"
import { SectionTitle } from "routes/Ammattitutkinto/SectionTitle"
import styled from "styled"

const OpintopolkuLink = styled("a")`
  display: block;
  color: ${props => props.theme.colors.waterBlue};
`

export class AmmattitutkintoSisalto extends React.Component<{}> {
  render = () => (
      <Section>
        <SectionTitle>
          <FormattedMessage
            id="ammattitutkinto.sisaltoTitle"
            defaultMessage="Mitä ammatilliset tutkinnot sisältävät?"
          />
        </SectionTitle>
        <p>
          <FormattedMessage
            id="ammattitutkinto.ensimmainenKappale"
            defaultMessage="Ammatillisessa koulutuksessa hankit osaamista työelämää varten. Ammatillisia tutkintoja ovat ammatilliset perustutkinnot, ammattitutkinnot ja erikoisammattitutkinnot. Ammatillisessa perustutkinnossa osoitat laaja-alaiset ammatilliset perusvalmiudet alan eri tehtäviin. Lisäksi voit saada valmiuksia yrittäjyyteen sekä jatko-opintojen kannalta tarpeellisia tietoja ja taitoja. Ammatillinen perustutkinto 180 osaamispisteen laajuinen tutkinto."
          />
        </p>
        <p>
          <FormattedMessage
            id="ammattitutkinto.toinenKappale"
            defaultMessage="Ammattitutkinnossa osoitat työelämän tarpeiden mukaisesti kohdennettua ammattitaitoa, joka on perustutkintoa syvällisempää tai kohdistuu rajatumpiin työtehtäviin. Ammattitutkinto on 150 tai 120 osaamispisteen laajuinen tutkinto. Erikoisammattitutkinnossa osoitat ammattitutkintoa syvällisempää ammatin hallintaa tai monialaista osaamista. Erikoisammattitutkinto on 180 osaamispisteen laajuinen tutkinto."
          />
        </p>
        <p>
          <FormattedMessage
            id="ammattitutkinto.kolmasKappale"
            defaultMessage="Lisää tietoa ammatillisesta koulutuksesta"
          />
          <OpintopolkuLink
            href="https://opintopolku.fi/wp/ammatillinen-koulutus/"
            target="_blank"
          >
            https://opintopolku.fi/wp/ammatillinen-koulutus/
          </OpintopolkuLink>
        </p>
      </Section>
    );
}

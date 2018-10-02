import React from "react"
import { FormattedMessage } from "react-intl"
import { Section } from "routes/Ammattitutkinto/Section"
import { SectionTitle } from "routes/Ammattitutkinto/SectionTitle"

export class AmmattitutkintoSisalto extends React.Component<{}> {
  render() {
    return (
      <Section>
        <SectionTitle>
          <FormattedMessage
            id="ammattitutkinto.title"
            defaultMessage="Mitä ammatillinen tutkinto sisältää?"
          />
        </SectionTitle>
        <p>
          <FormattedMessage
            id="ammattitutkinto.first_paragraph"
            defaultMessage="
          Tutkinnon laajuus lasketaan osaamispisteissä. Ammattilliseen
          perustutkintoon (180 osaamispistettä, osp) kuuluu ammattillisia
          tutkinnon osia (145 osp) ja yhteisiä tutkinnon osia (35 osp).
          "
          />
        </p>
        <p>
          <FormattedMessage
            id="ammattitutkinto.second_paragraph"
            defaultMessage="Ammatillinen tutkinto suoritetaan näytöillä osoittamalla ammattitaitoasi käytännön työtehtävissä pääosin työpaikoilla. Näytöissä arvioidaan, miten hyvin olet saavuttanut tutkinnnon vaatiman ammattitaidon. Osaamisesi arvioivat opettaja ja työelämän edustaja yhdessä."
          />
        </p>
        <p>
          <FormattedMessage
            id="ammattitutkinto.third_paragraph"
            defaultMessage="Jos sinulla on jo entuudestaan johonkin ammattiin riittävä osaaminen, osaamisesi kartoitetaan haun jälkeen henkilökohtaistamisvaiheessa."
          />
        </p>
      </Section>
    )
  }
}

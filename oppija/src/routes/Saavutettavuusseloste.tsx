import { RouteComponentProps } from "@reach/router"
import { Container } from "components/Container"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"

const Content = styled("div")`
  margin: 20px 80px 20px 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 20px 80px 20px 20px;
  }
`

interface SaavutettavuusselosteProps extends RouteComponentProps {}

export function Saavutettavuusseloste(_: SaavutettavuusselosteProps) {
  return (
    <Container>
      <Content>
        <h1>
          <FormattedMessage
            id="saavutettavuus.title"
            defaultMessage="eHoks-verkkopalvelun saavutettavuusseloste"
          />
        </h1>

        <p>
          <FormattedMessage
            id="saavutettavuus.yleiskuvaus"
            defaultMessage="Tämä saavutettavuusseloste kattaa Opintopolku.fi/eHoks-palvelun eri
          kieliversiot. Tämä seloste on laadittu 24.9.2019. Saavutettavuusarvio
          perustuu Opetushallituksen Oppijan palvelut -yksikön omaan
          arviointiin. Saavutettavuusarvioinnissa olemme arvioineet
          verkkopalvelun testiversion."
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.ehoksVerkkopalveluTitle"
            defaultMessage="eHoks verkkopalvelu"
          />
        </h2>

        <p>
          <FormattedMessage
            id="saavutettavuus.ehoksVerkkopalveluJulkaistiin"
            defaultMessage="eHoks-verkkopalvelu julkaistiin 14.10.2019"
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.saavutettavuusvaatimuksetTitle"
            defaultMessage="Saavutettavuusvaatimukset"
          />
        </h2>

        <p>
          <FormattedMessage
            id="saavutettavuus.vaatimukset1"
            defaultMessage="
          Julkishallinnon organisaatioiden verkkopalvelujen täytyy olla
          saavutettavia."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.vaatimukset2"
            defaultMessage="Verkkopalvelu on saavutettava, kun käyttäjä huolimatta mahdollisista
          toimintarajoitteista, kuten näkö- ja kuulovamma, ikä, äidinkieli tai
          kognitiiviset ja motoriset taidot, kykenee käyttämään verkkopalvelua
          ilman ongelmia."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.vaatimukset3"
            defaultMessage="Saavutettavuudesta säädetään laissa digitaalisten palveluiden
          tarjoamisesta ja sitä edeltäneessä EU:n saavutettavuusdirektiivissä.
          Saavutettavuusvaatimukset perustuvat WCAG 2.1 AA -ohjeisiin. (Web
          contents accessibility guidelines, verkkopalvelujen
          saavutettavuusohjeet)."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.vaatimukset4"
            defaultMessage="
          Vaatimukset koskevat eHoks-palvelussa julkaistuja sisältöjä 23.9.2019
          alkaen."
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.ehoksSaavutettavuusTitle"
            defaultMessage="eHoks-verkkopalvelun saavutettavuus"
          />
        </h2>

        <p>
          <FormattedMessage
            id="saavutettavus.palveluEiOleSaavutettava"
            defaultMessage="
          Palvelu ei ole kaikille saavutettava, sillä se ei täytä lain
          edellyttämiä kriittisiä saavutettavuusvaatimuksia. Emme noudata vielä
          lakia."
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.havaitutPuutteetTitle"
            defaultMessage="Havaitut puutteet saavutettavuudessa"
          />
        </h2>

        <ul>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute1"
              defaultMessage="
            Kuvien ja infograafien vaihtoehtoiset kuvaukset (alt-tekstit)
            puuttuvat."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute2"
              defaultMessage="
            Sivujen tekstin ja taustan värikontrastit eivät ole riittäviä."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute3"
              defaultMessage="
            Tekstiä esitetään kuvina ilman vaihtoehtoista kuvausta (alt-teksti),
            esimerkiksi painikkeet ja linkit"
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute4"
              defaultMessage="Käyttäjä ei voi hallinnoida palvelussa olevia aikaan sidottuja
            toimintoja. Käyttäjä ei voi kytkeä pois päältä palvelussa olevaa
            aikarajaa, säätää sitä tai pitkittää sitä, esimerkiksi lomakepohja"
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute5"
              defaultMessage="Linkkien ja lomakekenttien navigointijärjestys ei ole looginen ja
            intuitiivinen."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute6"
              defaultMessage="Palvelu ei anna riittävästi ohjeita siitä, miten linkit toimivat.
            Linkkien toimintaa ja tarkoitusta ei kerrota käyttäjälle. Käyttäjä
            ei voi selvittää, mille sivulle ja mihin palveluun linkit aukeavat."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute7"
              defaultMessage="Näppäinkohdistus ei ole koko ajan näkyvissä eikä ole riittävän
            näkyvä."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute8"
              defaultMessage="Sivuston ja sivujen kielimääritykset (suomi ja ruotsi) puuttuvat."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute9"
              defaultMessage="Lomakkeiden täyttämistä varten ja toiminnallisten elementtien
            käyttämiseen ei ole riittävästi ohjeita. Lomakepohja on
            puutteellinen."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute10"
              defaultMessage="Hyppää sisältöön -linkkiä ei löydy palvelun alusta."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute11"
              defaultMessage="Käyttäjälle ei anneta mahdollisuutta ohittaa sellaisia elementtejä,
            jotka eivät ole olennaisia palvelun käytölle (esimerkiksi: palvelua
            ei ole nimetty title-tagilla)."
            />
          </li>
          <li>
            <FormattedMessage
              id="saavutettavuus.puute12"
              defaultMessage="Palvelu ei ole yhteensopiva eri sovellusten kanssa eikä toimi
            moitteetta avustavan teknologian avulla, esimerkiksi
            ruudunlukuohjelmat."
            />
          </li>
        </ul>

        <p>
          <FormattedMessage
            id="saavutettavuus.puutteetKorjataan"
            defaultMessage="eHoks-palvelun saavutettavuuteen liittyvät puutteet korjataan vuoden
          2020 aikana WCAG-kriteerien mukaisesti. Tarvittaessa tarjoamme tukea
          kaikille käyttäjille."
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.saavutettavuusPalauteTitle"
            defaultMessage="Saavutettavuuspalaute"
          />
        </h2>

        <p>
          <FormattedMessage
            id="saavutettavuus.huomasitkoPuutteita"
            defaultMessage="Huomasitko joitakin muita saavutettavuuspuutteita eHOKS-palvelussa?
          Kerro se meille ja teemme parhaamme puutteen korjaamiseksi."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.voitPyytaaSaavutettavassaMuodossa"
            defaultMessage="Jos et voi käyttää jotain sisältöä, voit pyytää sen meiltä
          saavutettavassa muodossa."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.voitAntaaPalautetta"
            defaultMessage="Voit antaa palautetta mahdollisista puutteista sähköpostilla
          osoitteeseen:"
          />{" "}
          <a
            href={`mailto:${(
              <FormattedMessage
                id="saavutettavuus.palauteEmail"
                defaultMessage="ehoks@opintopolku.fi"
              />
            )}`}
          >
            <FormattedMessage
              id="saavutettavuus.palauteEmail"
              defaultMessage="ehoks@opintopolku.fi"
            />
          </a>
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.asiakaspalveluVastaaPalautteisiin"
            defaultMessage="eHoks-verkkopalvelun asiakaspalvelutiimi vastaa palautteisiin."
          />
        </p>

        <h2>
          <FormattedMessage
            id="saavutettavuus.valvontaviranomainenTitle"
            defaultMessage="Valvontaviranomainen"
          />
        </h2>

        <p>
          <FormattedMessage
            id="saavutettavuus.josEtSaaVastausta"
            defaultMessage="Jos et saa vastausta kysymyksiisi, voit tehdä puutteista valituksen
          valvontaviranomaiselle."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.valvontaviranomainen"
            defaultMessage="Verkkopalveluiden saavutettavuuden valvontaviranomainen on
          Etelä-Suomen aluehallintovirasto."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.josHuomaatSaavutettavuusOngelmia"
            defaultMessage="Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta
          sivuston ylläpitäjälle. Vastaamme 14 vuorokauden sisällä."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.josEtOleTyytyvainen"
            defaultMessage="Jos et ole tyytyväinen saamaasi vastaukseen, tai et saa vastausta
          lainkaan kahden viikon aikana, voit tehdä ilmoituksen Etelä-Suomen
          aluehallintovirastoon."
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.aluehallintovirastonSivullaKerrotaan"
            defaultMessage="Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
          valituksen voi tehdä ja miten asia käsitellään."
          />
        </p>

        <h3>
          <FormattedMessage
            id="saavutettavuus.valvontaviranomaisenYhteystiedotTitle"
            defaultMessage="Valvontaviranomaisen yhteystiedot"
          />
        </h3>

        <p>
          <FormattedMessage
            id="saavutettavuus.etelaSuomenAluehallintovirasto"
            defaultMessage="Etelä-Suomen aluehallintovirasto"
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.saavutettavuudenValvonnanYksikko"
            defaultMessage="Saavutettavuuden valvonnan yksikkö"
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.saavutettavuusvaatimuksetPlainLink"
            defaultMessage="www.saavutettavuusvaatimukset.fi"
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.saavutettavuusEmailPlain"
            defaultMessage="saavutettavuus(at)avi.fi"
          />
        </p>

        <p>
          <FormattedMessage
            id="saavutettavuus.puhelinnumero"
            defaultMessage="puhelinnumero vaihde 0295 016 000"
          />
        </p>

        <h3>
          <FormattedMessage
            id="saavutettavuus.lueLisaaTitle"
            defaultMessage="Lue lisää"
          />
        </h3>

        <p>
          <FormattedMessage
            id="saavutettavuus.saavutettavuusvaatimuksetDescription"
            defaultMessage="Saavutettavuusvaatimukset.fi (Aluehallintovirasto AVI)"
          />
          <br />
          <a href="https://www.saavutettavuusvaatimukset.fi/">
            <FormattedMessage
              id="saavutettavuus.saavutettavuusvaatimuksetLink"
              defaultMessage="https://www.saavutettavuusvaatimukset.fi/"
            />
          </a>
        </p>
      </Content>
    </Container>
  )
}

import { Container } from "components/Container"
import React from "react"
import styled from "styled"

const Content = styled("div")`
  margin: 20px 80px 20px 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 20px 80px 20px 20px;
  }
`

interface SaavutettavuusselosteProps {
  path?: string
}

export function Saavutettavuusseloste(_: SaavutettavuusselosteProps) {
  return (
    <Container>
      <Content>
        <h1>eHoks-verkkopalvelun saavutettavuusseloste</h1>

        <p>
          Tämä saavutettavuusseloste kattaa Opintopolku.fi/eHoks-palvelun eri
          kieliversiot. Tämä seloste on laadittu 24.9.2019. Saavutettavuusarvio
          perustuu Opetushallituksen Oppijan palvelut -yksikön omaan
          arviointiin. Saavutettavuusarvioinnissa olemme arvioineet
          verkkopalvelun testiversion.
        </p>

        <h2>eHoks verkkopalvelu</h2>

        <p>eHoks-verkkopalvelu julkaistiin 14.10.2019</p>

        <h2>Saavutettavuusvaatimukset</h2>

        <p>
          Julkishallinnon organisaatioiden verkkopalvelujen täytyy olla
          saavutettavia.
        </p>

        <p>
          Verkkopalvelu on saavutettava, kun käyttäjä huolimatta mahdollisista
          toimintarajoitteista, kuten näkö- ja kuulovamma, ikä, äidinkieli tai
          kognitiiviset ja motoriset taidot, kykenee käyttämään verkkopalvelua
          ilman ongelmia.
        </p>

        <p>
          Saavutettavuudesta säädetään laissa digitaalisten palveluiden
          tarjoamisesta ja sitä edeltäneessä EU:n saavutettavuusdirektiivissä.
          Saavutettavuusvaatimukset perustuvat WCAG 2.1 AA -ohjeisiin. (Web
          contents accessibility guidelines, verkkopalvelujen
          saavutettavuusohjeet).
        </p>

        <p>
          Vaatimukset koskevat eHoks-palvelussa julkaistuja sisältöjä 23.9.2019
          alkaen.
        </p>

        <h2>eHoks-verkkopalvelun saavutettavuus</h2>

        <p>
          Palvelu ei ole kaikille saavutettava, sillä se ei täytä lain
          edellyttämiä kriittisiä saavutettavuusvaatimuksia. Emme noudata vielä
          lakia.
        </p>

        <h2>Havaitut puutteet saavutettavuudessa</h2>

        <ul>
          <li>
            Kuvien ja infograafien vaihtoehtoiset kuvaukset (alt-tekstit)
            puuttuvat.
          </li>
          <li>
            Sivujen tekstin ja taustan värikontrastit eivät ole riittäviä.
          </li>
          <li>
            Tekstiä esitetään kuvina ilman vaihtoehtoista kuvausta (alt-teksti),
            esimerkiksi painikkeet ja linkit
          </li>
          <li>
            Käyttäjä ei voi hallinnoida palvelussa olevia aikaan sidottuja
            toimintoja. Käyttäjä ei voi kytkeä pois päältä palvelussa olevaa
            aikarajaa, säätää sitä tai pitkittää sitä, esimerkiksi lomakepohja
          </li>
          <li>
            Linkkien ja lomakekenttien navigointijärjestys ei ole looginen ja
            intuitiivinen.
          </li>
          <li>
            Palvelu ei anna riittävästi ohjeita siitä, miten linkit toimivat.
            Linkkien toimintaa ja tarkoitusta ei kerrota käyttäjälle. Käyttäjä
            ei voi selvittää, mille sivulle ja mihin palveluun linkit aukeavat.
          </li>
          <li>
            Näppäinkohdistus ei ole koko ajan näkyvissä eikä ole riittävän
            näkyvä.
          </li>
          <li>
            Sivuston ja sivujen kielimääritykset (suomi ja ruotsi) puuttuvat.
          </li>
          <li>
            Lomakkeiden täyttämistä varten ja toiminnallisten elementtien
            käyttämiseen ei ole riittävästi ohjeita. Lomakepohja on
            puutteellinen.
          </li>
          <li>Hyppää sisältöön -linkkiä ei löydy palvelun alusta.</li>
          <li>
            Käyttäjälle ei anneta mahdollisuutta ohittaa sellaisia elementtejä,
            jotka eivät ole olennaisia palvelun käytölle (esimerkiksi: palvelua
            ei ole nimetty title-tagilla).
          </li>
          <li>
            Palvelu ei ole yhteensopiva eri sovellusten kanssa eikä toimi
            moitteetta avustavan teknologian avulla, esimerkiksi
            ruudunlukuohjelmat.
          </li>
        </ul>

        <p>
          eHoks-palvelun saavutettavuuteen liittyvät puutteet korjataan vuoden
          2020 aikana WCAG-kriteerien mukaisesti. Tarvittaessa tarjoamme tukea
          kaikille käyttäjille.
        </p>

        <h2>Saavutettavuuspalaute</h2>

        <p>
          Huomasitko joitakin muita saavutettavuuspuutteita eHOKS-palvelussa?
          Kerro se meille ja teemme parhaamme puutteen korjaamiseksi.
        </p>

        <p>
          Jos et voi käyttää jotain sisältöä, voit pyytää sen meiltä
          saavutettavassa muodossa.
        </p>

        <p>
          Voit antaa palautetta mahdollisista puutteista sähköpostilla
          osoitteeseen:{" "}
          <a href="mailto:ehoks@opintopolku.fi">ehoks@opintopolku.fi</a>
        </p>

        <p>eHoks-verkkopalvelun asiakaspalvelutiimi vastaa palautteisiin.</p>

        <h2>Valvontaviranomainen</h2>

        <p>
          Jos et saa vastausta kysymyksiisi, voit tehdä puutteista valituksen
          valvontaviranomaiselle.
        </p>

        <p>
          Verkkopalveluiden saavutettavuuden valvontaviranomainen on
          Etelä-Suomen aluehallintovirasto.
        </p>

        <p>
          Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta
          sivuston ylläpitäjälle. Vastaamme 14 vuorokauden sisällä.
        </p>

        <p>
          Jos et ole tyytyväinen saamaasi vastaukseen, tai et saa vastausta
          lainkaan kahden viikon aikana, voit tehdä ilmoituksen Etelä-Suomen
          aluehallintovirastoon.
        </p>

        <p>
          Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
          valituksen voi tehdä ja miten asia käsitellään.
        </p>

        <h3>Valvontaviranomaisen yhteystiedot</h3>

        <p>Etelä-Suomen aluehallintovirasto</p>

        <p>Saavutettavuuden valvonnan yksikkö</p>

        <p>www.saavutettavuusvaatimukset.fi</p>

        <p>saavutettavuus(at)avi.fi</p>

        <p>puhelinnumero vaihde 0295 016 000</p>

        <h3>Lue lisää</h3>

        <p>
          Saavutettavuusvaatimukset.fi (Aluehallintovirasto AVI)
          <br />
          <a href="https://www.saavutettavuusvaatimukset.fi/">
            https://www.saavutettavuusvaatimukset.fi/
          </a>
        </p>
      </Content>
    </Container>
  )
}

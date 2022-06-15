# Vinkit kehittäjille

Tämän tiedoston tarkoitus on kerätä lyhyt lista asioista, jotka olisivat hyviä
tietää uutena kehittäjänä tässä projektissa.


## Linterit ja formattointi

Tässä projekstissa on käytössä tosi intohimoinen linter ja koodin formattaaja,
joka itse formattaa koodiasi `git commit`:in yhteydessä. Tämä tarkoittaa, että
koodi, joka pääsee GitHubiin, ei ole aina täsmälleen sitä, jonka kirjoitit.
Ennen code reviewia kannattaa aina varmistaa, että formattaaja ei ole luonut
bugia --- tämä on harvinaista, mutta näin on tapahtunut. Koska linter ei salli
puolipistettä rivin lopussa, on mahdollista kirjoittaa koodinpätkän, jonka
toimintaa formattaaja muuttaa.

Välttääksesi tätä kannattaa olla käyttämättä puolipistettä rivin lopussa, ja
kannattaa myös välttää ylipitkiä rivejä (> 80 merkkiä). Nämä ovat joskus
sallittuja kun kyse on esim. tosi pitkästä URI:sta, mutta niitä ei muuten
suositella.


## Testit

Voit ajaa testit komennolla `npm run test`. Testit ajetaan automaattisesti
CI-prosessin osana, mikä voi kaataa push:isi jos ne epäonnistuvat.


## Rakenne

Monet komponentit, joita käytetään molemmilla puolilla ohjelmistoa, löytyvät
`shared/`-kansiosta. Jos et löydä komponenttia tai muuta tiedostoa kummastakaan
projektikansiosta, sitä kannattaa etsiä tuosta.

Tiedostojen `shared/`-kansiossa ei pitäisi importoida komponentteja, jotka
löytyvät muualta projektista.


## Käännökset

Käännökset löytyvät seuraavista tiedostoista:

`oppija/translations.json`
`virkailija/translations.json`
`shared/stores/TranslationStore/defaultMessages.json`

Kun päivität käännöksen, täytyy päivittää myös kyseinen tiedosto.

Käännökset määritellään myös suoraan palvelussa (Käännösten ylläpito
-välilehden alla). Nämä stringit voi lisätä tai muuttaa ilman koodinmuutosta
(eli OPH:laisetkin voivat muokata ne). Jos käännöstyökalussa on määritelty
string tietylle käännösavaimelle, sitä käytetään UI:ssa; muuten käytetään
koodissa määriteltyä käännöstä tai oletusarvoa.

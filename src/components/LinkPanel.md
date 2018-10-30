```js
const { LinkPanelContainer } = require("components/LinkPanelContainer")
;<LinkPanelContainer>
  <LinkPanel
    to="henkilokohtaistaminen"
    title="Mitä opintojen henkilökohtaistaminen tarkoittaa?"
    description="Opiskelu sovitetaan lähtötilanteeseesi..."
    image={
      "https://ui-avatars.com/api/?name=Opintojen+henkilokohtaistaminen&size=500"
    }
  />
  <LinkPanel
    to="ammatillinentutkinto"
    title="Mitä ammatillinen tutkinto sisältää?"
    description="Jokaiselle tutkinnon osalle on ammattitaitovaatimukset..."
    image={"https://ui-avatars.com/api/?name=Ammatti+tutkinto&size=500"}
  />
</LinkPanelContainer>
```

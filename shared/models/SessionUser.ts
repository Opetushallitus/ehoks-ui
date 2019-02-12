import { types } from "mobx-state-tree"

enum ContactFields {
  YHTEYSTIETO_KUNTA = "kunta",
  YHTEYSTIETO_SAHKOPOSTI = "sahkoposti",
  YHTEYSTIETO_POSTINUMERO = "postinumero",
  YHTEYSTIETO_PUHELINNUMERO = "puhelinnumero",
  YHTEYSTIETO_MATKAPUHELINNUMERO = "matkapuhelinnumero",
  YHTEYSTIETO_KATUOSOITE = "katuosoite"
}

type Yhteystiedot = { [value in ContactFields]?: string }

const Contact = types.model("Contact", {
  type: types.string,
  value: types.string
})

const ContactValue = types.model("ContactValue", {
  contact: types.array(Contact),
  id: types.number
})

export const SessionUser = types
  .model("SessionUser", {
    commonName: types.string,
    contactValuesGroup: types.optional(types.array(ContactValue), []),
    firstName: types.optional(types.string, ""),
    oid: types.optional(types.string, ""),
    surname: types.string
  })
  .views(self => {
    return {
      get yhteystiedot(): Yhteystiedot {
        if (
          !self.contactValuesGroup.length ||
          !self.contactValuesGroup[0].contact
        ) {
          return {}
        }
        return self.contactValuesGroup[0].contact.reduce((result, contact) => {
          const key = ContactFields[contact.type as keyof typeof ContactFields]
          return { ...result, [key]: contact.value }
        }, {})
      }
    }
  })

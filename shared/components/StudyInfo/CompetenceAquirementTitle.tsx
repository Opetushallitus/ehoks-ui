import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
import { FormattedMessage } from "react-intl"
import React from "react"

export function CompetenceAquirementTitle(props: {
  hankkimistapaType: OsaamisenHankkimistapaType
}) {
  return props.hankkimistapaType === OsaamisenHankkimistapaType.Workplace ? (
    <FormattedMessage
      id="opiskelusuunnitelma.tyossaoppiminenTitle"
      defaultMessage="Työpaikalla oppiminen"
    />
  ) : (
    <FormattedMessage
      id="opiskelusuunnitelma.muuKuinTyossaOppiminenTitle"
      defaultMessage="Muualla kuin työpaikalla tapahtuva osaamisen hankkiminen"
    />
  )
}

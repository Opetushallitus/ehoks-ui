import { koodistoUrls } from "routes/LuoHOKS"

function typeaheadProps(options: any[]) {
  return {
    options: options.sort((a: any, b: any) => {
      if (a.koodiUri > b.koodiUri) {
        return 1
      }
      if (a.koodiUri < b.koodiUri) {
        return -1
      } else {
        return 0
      }
    }),
    labelKey: { fields: ["koodiUri", "nimi"], separator: " - " },
    mapping: "koodiUri",
    minLength: 0,
    clearButton: true,
    placeholder: "Valitse..."
  }
}

type UiSchemaOptions = { [key in keyof typeof koodistoUrls]: any[] }

export const uiSchema = (options: UiSchemaOptions) => ({
  "ui:order": [
    "opiskeluoikeus-oid",
    "oppija-oid",
    "ensikertainen-hyvaksyminen",
    "sahkoposti",
    "urasuunnitelma-koodi-uri",
    "urasuunnitelma-koodi-versio",
    "laatija",
    "paivittaja",
    "hyvaksyja",
    "olemassa-olevat-ammatilliset-tutkinnon-osat",
    "olemassa-olevat-paikalliset-tutkinnon-osat",
    "olemassa-olevat-yhteiset-tutkinnon-osat",
    "puuttuvat-ammatilliset-tutkinnon-osat",
    "puuttuvat-paikalliset-tutkinnon-osat",
    "puuttuvat-yhteiset-tutkinnon-osat",
    "opiskeluvalmiuksia-tukevat-opinnot",
    "*"
  ],
  luotu: {
    "ui:widget": "hidden"
  },
  hyvaksytty: {
    "ui:widget": "hidden"
  },
  versio: {
    "ui:widget": "hidden"
  },
  paivitetty: {
    "ui:widget": "hidden"
  },
  "urasuunnitelma-koodi-uri": {
    "ui:field": "typeahead",
    typeahead: typeaheadProps(options.urasuunnitelma)
  },
  "olemassa-olevat-ammatilliset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "koulutuksen-jarjestaja-oid",
        "tarkentavat-tiedot-arvioija",
        "tarkentavat-tiedot-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "tutkinnon-osa-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.tutkinnonosat)
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      },
      "tarkentavat-tiedot-arvioija": {
        "aiemmin-hankitun-osaamisen-arvioija": {
          items: {
            "ui:order": ["nimi", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "tarkentavat-tiedot-naytto": {
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "nayttoymparisto",
            "jarjestaja",
            "koulutuksen-jarjestaja-arvioijat",
            "tyoelama-arvioijat",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          jarjestaja: {
            id: {
              "ui:widget": "hidden"
            }
          },
          "koulutuksen-jarjestaja-arvioijat": {
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-arvioijat": {
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "olemassa-olevat-paikalliset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "nimi",
        "laajuus",
        "koulutuksen-jarjestaja-oid",
        "amosaa-tunniste",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      }
    }
  },
  "olemassa-olevat-yhteiset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "koulutuksen-jarjestaja-oid",
        "tarkentavat-tiedot-arvioija",
        "tarkentavat-tiedot-naytto",
        "osa-alueet",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "tutkinnon-osa-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.tutkinnonosat)
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      },
      "tarkentavat-tiedot-arvioija": {
        "aiemmin-hankitun-osaamisen-arvioija": {
          items: {
            "ui:order": ["nimi", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "tarkentavat-tiedot-naytto": {
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "nayttoymparisto",
            "jarjestaja",
            "koulutuksen-jarjestaja-arvioijat",
            "tyoelama-arvioijat",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          jarjestaja: {
            id: {
              "ui:widget": "hidden"
            }
          },
          "koulutuksen-jarjestaja-arvioijat": {
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-arvioijat": {
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          }
        }
      },
      "osa-alueet": {
        items: {
          "ui:order": [
            "valittu-todentamisen-prosessi-koodi-uri",
            "valittu-todentamisen-prosessi-koodi-versio",
            "koulutuksen-jarjestaja-oid",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "valittu-todentamisen-prosessi-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
          },
          "tarkentavat-tiedot": {
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "nayttoymparisto",
                "jarjestaja",
                "koulutuksen-jarjestaja-arvioijat",
                "tyoelama-arvioijat",
                "*"
              ],
              id: {
                "ui:widget": "hidden"
              },
              jarjestaja: {
                id: {
                  "ui:widget": "hidden"
                }
              },
              "koulutuksen-jarjestaja-arvioijat": {
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "tyoelama-arvioijat": {
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "puuttuvat-ammatilliset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "koulutuksen-jarjestaja-oid",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "osaamisen-hankkimistavat",
        "hankitun-osaamisen-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "tutkinnon-osa-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.tutkinnonosat)
      },
      "osaamisen-hankkimistavat": {
        items: {
          "ui:order": [
            "osaamisen-hankkimistapa-koodi-uri",
            "osaamisen-hankkimistapa-koodi-versio",
            "alku",
            "loppu",
            "ajanjakson-tarkenne",
            "hankkijan-edustaja",
            "jarjestajan-edustaja",
            "tyopaikalla-hankittava-osaaminen",
            "muut-oppimisymparisto",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osaamisen-hankkimistapa-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisenhankkimistapa)
          },
          "hankkijan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyopaikalla-hankittava-osaaminen": {
            "ui:order": [
              "tyopaikan-nimi",
              "tyopaikan-y-tunnus",
              "lisatiedot",
              "vastuullinen-ohjaaja",
              "muut-osallistujat",
              "keskeiset-tyotehtavat",
              "*"
            ],
            id: {
              "ui:widget": "hidden"
            },
            "vastuullinen-ohjaaja": {
              "ui:order": ["nimi", "sahkoposti", "*"],
              id: {
                "ui:widget": "hidden"
              }
            },
            "muut-osallistujat": {
              items: {
                "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              }
            }
          },
          "jarjestajan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "hankitun-osaamisen-naytto": {
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "jarjestaja",
            "nayttoymparisto",
            "tyoelama-arvioijat",
            "koulutuksen-jarjestaja-arvioijat",
            "osa-alue-koodi-uri",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          jarjestaja: {
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyoelama-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksen-jarjestaja-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "puuttuvat-paikalliset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "nimi",
        "laajuus",
        "koulutuksen-jarjestaja-oid",
        "amosaa-tunniste",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "osaamisen-hankkimistavat",
        "hankitun-osaamisen-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "osaamisen-hankkimistavat": {
        items: {
          "ui:order": [
            "osaamisen-hankkimistapa-koodi-uri",
            "osaamisen-hankkimistapa-koodi-versio",
            "alku",
            "loppu",
            "ajanjakson-tarkenne",
            "hankkijan-edustaja",
            "jarjestajan-edustaja",
            "tyopaikalla-hankittava-osaaminen",
            "muut-oppimisymparisto",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osaamisen-hankkimistapa-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisenhankkimistapa)
          },
          "hankkijan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyopaikalla-hankittava-osaaminen": {
            "ui:order": [
              "tyopaikan-nimi",
              "tyopaikan-y-tunnus",
              "lisatiedot",
              "vastuullinen-ohjaaja",
              "muut-osallistujat",
              "keskeiset-tyotehtavat",
              "*"
            ],
            id: {
              "ui:widget": "hidden"
            },
            "vastuullinen-ohjaaja": {
              "ui:order": ["nimi", "sahkoposti", "*"],
              id: {
                "ui:widget": "hidden"
              }
            },
            "muut-osallistujat": {
              items: {
                "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              }
            }
          },
          "jarjestajan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "hankitun-osaamisen-naytto": {
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "jarjestaja",
            "nayttoymparisto",
            "tyoelama-arvioijat",
            "koulutuksen-jarjestaja-arvioijat",
            "osa-alue-koodi-uri",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          jarjestaja: {
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyoelama-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksen-jarjestaja-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "puuttuvat-yhteiset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "koulutuksen-jarjestaja-oid",
        "osa-alueet",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "tutkinnon-osa-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.tutkinnonosat)
      },
      "osa-alueet": {
        items: {
          "ui:order": [
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "osaamisen-hankkimistavat",
            "hankitun-osaamisen-naytto",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          "osaamisen-hankkimistavat": {
            items: {
              "ui:order": [
                "osaamisen-hankkimistapa-koodi-uri",
                "osaamisen-hankkimistapa-koodi-versio",
                "alku",
                "loppu",
                "ajanjakson-tarkenne",
                "hankkijan-edustaja",
                "jarjestajan-edustaja",
                "tyopaikalla-hankittava-osaaminen",
                "muut-oppimisymparisto",
                "*"
              ],
              id: {
                "ui:widget": "hidden"
              },
              "osaamisen-hankkimistapa-koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.osaamisenhankkimistapa)
              },
              "hankkijan-edustaja": {
                "ui:order": ["nimi", "oppilaitos-oid", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              },
              "tyopaikalla-hankittava-osaaminen": {
                "ui:order": [
                  "tyopaikan-nimi",
                  "tyopaikan-y-tunnus",
                  "lisatiedot",
                  "vastuullinen-ohjaaja",
                  "muut-osallistujat",
                  "keskeiset-tyotehtavat",
                  "*"
                ],
                id: {
                  "ui:widget": "hidden"
                },
                "vastuullinen-ohjaaja": {
                  "ui:order": ["nimi", "sahkoposti", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                },
                "muut-osallistujat": {
                  items: {
                    "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                    id: {
                      "ui:widget": "hidden"
                    }
                  }
                }
              },
              "jarjestajan-edustaja": {
                "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              }
            }
          },
          "hankitun-osaamisen-naytto": {
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "jarjestaja",
                "nayttoymparisto",
                "osaamistavoitteet",
                "tyoelama-arvioijat",
                "koulutuksen-jarjestaja-arvioijat",
                "osa-alue-koodi-uri",
                "osa-alue-koodi-versio",
                "*"
              ],
              id: {
                "ui:widget": "hidden"
              },
              "osa-alue-koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              jarjestaja: {
                id: {
                  "ui:widget": "hidden"
                }
              },
              "tyoelama-arvioijat": {
                items: {
                  "ui:order": ["nimi", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "koulutuksen-jarjestaja-arvioijat": {
                items: {
                  "ui:order": ["nimi", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "opiskeluvalmiuksia-tukevat-opinnot": {
    items: {
      id: {
        "ui:widget": "hidden"
      }
    }
  }
})

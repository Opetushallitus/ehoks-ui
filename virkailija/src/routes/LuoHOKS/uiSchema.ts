import { typeaheadProps } from "routes/HOKSLomake/typeaheadProps"
import { UiSchemaOptions } from "../HOKSLomake/formConfig"

export const propertiesByStep: { [index: number]: string[] } = {
  0: [
    "opiskeluoikeus-oid",
    "oppija-oid",
    "ensikertainen-hyvaksyminen",
    "paivitetty",
    "sahkoposti",
    "urasuunnitelma-koodi-uri",
    "urasuunnitelma-koodi-versio",
    "osaamisen-hankkimisen-tarve",
    "osaamisen-saavuttamisen-pvm"
  ],
  1: ["aiemmin-hankitut-ammat-tutkinnon-osat"],
  2: ["aiemmin-hankitut-paikalliset-tutkinnon-osat"],
  3: ["aiemmin-hankitut-yhteiset-tutkinnon-osat"],
  4: ["hankittavat-ammat-tutkinnon-osat"],
  5: ["hankittavat-paikalliset-tutkinnon-osat"],
  6: ["hankittavat-yhteiset-tutkinnon-osat"],
  7: ["opiskeluvalmiuksia-tukevat-opinnot"]
}

const fullUiSchema = (options: UiSchemaOptions): { [key: string]: any } => ({
  "ui:order": [
    "opiskeluoikeus-oid",
    "oppija-oid",
    "ensikertainen-hyvaksyminen",
    "paivitetty",
    "sahkoposti",
    "urasuunnitelma-koodi-uri",
    "urasuunnitelma-koodi-versio",
    "osaamisen-hankkimisen-tarve",
    "osaamisen-saavuttamisen-pvm",
    "aiemmin-hankitut-ammat-tutkinnon-osat",
    "aiemmin-hankitut-paikalliset-tutkinnon-osat",
    "aiemmin-hankitut-yhteiset-tutkinnon-osat",
    "hankittavat-ammat-tutkinnon-osat",
    "hankittavat-paikalliset-tutkinnon-osat",
    "hankittavat-yhteiset-tutkinnon-osat",
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
    "ui:widget": "DatetimeWidget"
  },
  "urasuunnitelma-koodi-uri": {
    "ui:field": "typeahead",
    typeahead: typeaheadProps(options.urasuunnitelma)
  },
  "urasuunnitelma-koodi-versio": {
    "ui:widget": "hidden"
  },
  "osaamisen-hankkimisen-tarve": {
    "ui:widget": "customBooleanRadioButtonWidget"
  },
  "osaamisen-saavuttamisen-pvm": {
    "ui:widget": "DateWidget"
  },
  "aiemmin-hankitut-ammat-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "koulutuksen-jarjestaja-oid",
        "olennainen-seikka",
        "tarkentavat-tiedot-osaamisen-arvioija",
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
      "tutkinnon-osa-koodi-versio": {
        "ui:widget": "hidden"
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      },
      "valittu-todentamisen-prosessi-koodi-versio": {
        "ui:widget": "hidden"
      },
      "tarkentavat-tiedot-osaamisen-arvioija": {
        "aiemmin-hankitun-osaamisen-arvioijat": {
          "ui:options": {
            orderable: false
          },
          items: {
            "ui:order": ["nimi", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "tarkentavat-tiedot-naytto": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "nayttoymparisto",
            "jarjestaja",
            "osa-alueet",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "tyoelama-osaamisen-arvioijat",
            "sisallon-kuvaus",
            "yksilolliset-kriteerit",
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
          "koulutuksen-jarjestaja-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "sisallon-kuvaus": {
            "ui:options": { orderable: false }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              "koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "aiemmin-hankitut-paikalliset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
    items: {
      "ui:order": [
        "nimi",
        "laajuus",
        "amosaa-tunniste",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "koulutuksen-jarjestaja-oid",
        "olennainen-seikka",
        "tarkentavat-tiedot-osaamisen-arvioija",
        "tarkentavat-tiedot-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      },
      "valittu-todentamisen-prosessi-koodi-versio": {
        "ui:widget": "hidden"
      },
      "tarkentavat-tiedot-osaamisen-arvioija": {
        "aiemmin-hankitun-osaamisen-arvioijat": {
          "ui:options": {
            orderable: false
          },
          items: {
            "ui:order": ["nimi", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "tarkentavat-tiedot-naytto": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "nayttoymparisto",
            "jarjestaja",
            "osa-alueet",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "tyoelama-osaamisen-arvioijat",
            "sisallon-kuvaus",
            "yksilolliset-kriteerit",
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
          "koulutuksen-jarjestaja-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "sisallon-kuvaus": {
            "ui:options": { orderable: false }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              "koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "aiemmin-hankitut-yhteiset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "koulutuksen-jarjestaja-oid",
        "tarkentavat-tiedot-osaamisen-arvioija",
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
      "tutkinnon-osa-koodi-versio": {
        "ui:widget": "hidden"
      },
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
      },
      "valittu-todentamisen-prosessi-koodi-versio": {
        "ui:widget": "hidden"
      },
      "tarkentavat-tiedot-osaamisen-arvioija": {
        "aiemmin-hankitun-osaamisen-arvioijat": {
          "ui:options": {
            orderable: false
          },
          items: {
            "ui:order": ["nimi", "*"],
            id: {
              "ui:widget": "hidden"
            }
          }
        }
      },
      "tarkentavat-tiedot-naytto": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "nayttoymparisto",
            "jarjestaja",
            "osa-alueet",
            "sisallon-kuvaus",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "tyoelama-osaamisen-arvioijat",
            "yksilolliset-kriteerit",
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
          "koulutuksen-jarjestaja-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "sisallon-kuvaus": {
            "ui:options": { orderable: false }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              "koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          }
        }
      },
      "osa-alueet": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "valittu-todentamisen-prosessi-koodi-uri",
            "valittu-todentamisen-prosessi-koodi-versio",
            "tarkentavat-tiedot-osaamisen-arvioija",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "koulutuksen-jarjestaja-oid",
            "olennainen-seikka",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          "osa-alue-koodi-versio": {
            "ui:widget": "hidden"
          },
          "valittu-todentamisen-prosessi-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
          },
          "valittu-todentamisen-prosessi-koodi-versio": {
            "ui:widget": "hidden"
          },
          "tarkentavat-tiedot-osaamisen-arvioija": {
            "aiemmin-hankitun-osaamisen-arvioijat": {
              "ui:options": {
                orderable: false
              },
              items: {
                "ui:order": ["nimi", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              }
            }
          },
          "tarkentavat-tiedot-naytto": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "osa-alueet",
                "nayttoymparisto",
                "jarjestaja",
                "koulutuksen-jarjestaja-osaamisen-arvioijat",
                "tyoelama-osaamisen-arvioijat",
                "sisallon-kuvaus",
                "yksilolliset-kriteerit",
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
              "koulutuksen-jarjestaja-osaamisen-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "tyoelama-osaamisen-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "sisallon-kuvaus": {
                "ui:options": { orderable: false }
              },
              "osa-alueet": {
                "ui:options": { orderable: false },
                items: {
                  "ui:order": ["koodi-uri", "koodi-versio"],
                  "koodi-uri": {
                    "ui:field": "typeahead",
                    typeahead: typeaheadProps(options.ammatillisenoppiaineet)
                  },
                  "koodi-versio": {
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
  "hankittavat-ammat-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "koulutuksen-jarjestaja-oid",
        "opetus-ja-ohjaus-maara",
        "olennainen-seikka",
        "osaamisen-hankkimistavat",
        "osaamisen-osoittaminen",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "opetus-ja-ohjaus-maara": {
        "ui:widget": "NumberWidget"
      },
      "tutkinnon-osa-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.tutkinnonosat)
      },
      "tutkinnon-osa-koodi-versio": {
        "ui:widget": "hidden"
      },
      "osaamisen-hankkimistavat": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osaamisen-hankkimistapa-koodi-uri",
            "osaamisen-hankkimistapa-koodi-versio",
            "oppisopimuksen-perusta-koodi-uri",
            "oppisopimuksen-perusta-koodi-versio",
            "alku",
            "loppu",
            "osa-aikaisuustieto",
            "ajanjakson-tarkenne",
            "keskeytymisajanjaksot",
            "hankkijan-edustaja",
            "jarjestajan-edustaja",
            "tyopaikalla-jarjestettava-koulutus",
            "muut-oppimisymparistot",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osaamisen-hankkimistapa-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisenhankkimistapa)
          },
          "osaamisen-hankkimistapa-koodi-versio": {
            "ui:widget": "hidden"
          },
          "oppisopimuksen-perusta-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.oppisopimuksenperusta)
          },
          "oppisopimuksen-perusta-koodi-versio": {
            "ui:widget": "hidden"
          },
          "hankkijan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyopaikalla-jarjestettava-koulutus": {
            "ui:order": [
              "tyopaikan-nimi",
              "tyopaikan-y-tunnus",
              "vastuullinen-tyopaikka-ohjaaja",
              "keskeiset-tyotehtavat",
              "*"
            ],
            id: {
              "ui:widget": "hidden"
            },
            "vastuullinen-tyopaikka-ohjaaja": {
              "ui:order": ["nimi", "sahkoposti", "puhelinnumero", "*"],
              id: {
                "ui:widget": "hidden"
              }
            },
            "keskeiset-tyotehtavat": {
              "ui:options": { orderable: false }
            }
          },
          "jarjestajan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "muut-oppimisymparistot": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": [
                "oppimisymparisto-koodi-uri",
                "oppimisymparisto-koodi-versio",
                "*"
              ],
              "oppimisymparisto-koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.oppimisymparistot)
              },
              "oppimisymparisto-koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          },
          keskeytymisajanjaksot: {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["alku", "loppu", "*"]
            }
          }
        }
      },
      "osaamisen-osoittaminen": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "osa-alueet",
            "jarjestaja",
            "nayttoymparisto",
            "tyoelama-osaamisen-arvioijat",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "sisallon-kuvaus",
            "yksilolliset-kriteerit",
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
          "tyoelama-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksen-jarjestaja-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "sisallon-kuvaus": {
            "ui:options": {
              orderable: false
            }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              "koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "hankittavat-paikalliset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
    items: {
      "ui:order": [
        "nimi",
        "laajuus",
        "amosaa-tunniste",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "koulutuksen-jarjestaja-oid",
        "opetus-ja-ohjaus-maara",
        "olennainen-seikka",
        "osaamisen-hankkimistavat",
        "osaamisen-osoittaminen",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "opetus-ja-ohjaus-maara": {
        "ui:widget": "NumberWidget"
      },
      "osaamisen-hankkimistavat": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osaamisen-hankkimistapa-koodi-uri",
            "osaamisen-hankkimistapa-koodi-versio",
            "alku",
            "loppu",
            "osa-aikaisuustieto",
            "ajanjakson-tarkenne",
            "keskeytymisajanjaksot",
            "hankkijan-edustaja",
            "jarjestajan-edustaja",
            "tyopaikalla-jarjestettava-koulutus",
            "muut-oppimisymparistot",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "osaamisen-hankkimistapa-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisenhankkimistapa)
          },
          "osaamisen-hankkimistapa-koodi-versio": {
            "ui:widget": "hidden"
          },
          "hankkijan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "tyopaikalla-jarjestettava-koulutus": {
            "ui:order": [
              "tyopaikan-nimi",
              "tyopaikan-y-tunnus",
              "vastuullinen-tyopaikka-ohjaaja",
              "keskeiset-tyotehtavat",
              "*"
            ],
            id: {
              "ui:widget": "hidden"
            },
            "vastuullinen-tyopaikka-ohjaaja": {
              "ui:order": ["nimi", "sahkoposti", "puhelinnumero", "*"],
              id: {
                "ui:widget": "hidden"
              }
            },
            "keskeiset-tyotehtavat": {
              "ui:options": {
                orderable: false
              }
            }
          },
          "jarjestajan-edustaja": {
            "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
            id: {
              "ui:widget": "hidden"
            }
          },
          "muut-oppimisymparistot": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": [
                "oppimisymparisto-koodi-uri",
                "oppimisymparisto-koodi-versio",
                "alku",
                "loppu",
                "*"
              ],
              "oppimisymparisto-koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.oppimisymparistot)
              },
              "oppimisymparisto-koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          },
          keskeytymisajanjaksot: {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["alku", "loppu", "*"]
            }
          }
        }
      },
      "osaamisen-osoittaminen": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "jarjestaja",
            "nayttoymparisto",
            "osa-alueet",
            "tyoelama-osaamisen-arvioijat",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "sisallon-kuvaus",
            "yksilolliset-kriteerit",
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
          "tyoelama-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksen-jarjestaja-osaamisen-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "sisallon-kuvaus": {
            "ui:options": { orderable: false }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
              },
              "koodi-versio": {
                "ui:widget": "hidden"
              }
            }
          }
        }
      }
    }
  },
  "hankittavat-yhteiset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
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
      "tutkinnon-osa-koodi-versio": {
        "ui:widget": "hidden"
      },
      "osa-alueet": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osa-alue-koodi-uri",
            "koulutuksen-jarjestaja-oid",
            "osa-alue-koodi-versio",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "opetus-ja-ohjaus-maara",
            "olennainen-seikka",
            "osaamisen-hankkimistavat",
            "osaamisen-osoittaminen",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "opetus-ja-ohjaus-maara": {
            "ui:widget": "NumberWidget"
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          "osa-alue-koodi-versio": {
            "ui:widget": "hidden"
          },
          "osaamisen-hankkimistavat": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": [
                "osaamisen-hankkimistapa-koodi-uri",
                "osaamisen-hankkimistapa-koodi-versio",
                "alku",
                "loppu",
                "osa-aikaisuustieto",
                "ajanjakson-tarkenne",
                "keskeytymisajanjaksot",
                "hankkijan-edustaja",
                "jarjestajan-edustaja",
                "tyopaikalla-jarjestettava-koulutus",
                "muut-oppimisymparistot",
                "*"
              ],
              id: {
                "ui:widget": "hidden"
              },
              "osaamisen-hankkimistapa-koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.osaamisenhankkimistapa)
              },
              "osaamisen-hankkimistapa-koodi-versio": {
                "ui:widget": "hidden"
              },
              "hankkijan-edustaja": {
                "ui:order": ["nimi", "oppilaitos-oid", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              },
              "tyopaikalla-jarjestettava-koulutus": {
                "ui:order": [
                  "tyopaikan-nimi",
                  "tyopaikan-y-tunnus",
                  "vastuullinen-tyopaikka-ohjaaja",
                  "keskeiset-tyotehtavat",
                  "*"
                ],
                id: {
                  "ui:widget": "hidden"
                },
                "vastuullinen-tyopaikka-ohjaaja": {
                  "ui:order": ["nimi", "sahkoposti", "puhelinnumero", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                },
                "keskeiset-tyotehtavat": {
                  "ui:options": {
                    orderable: false
                  }
                }
              },
              "jarjestajan-edustaja": {
                "ui:order": ["nimi", "oppilaitos-oid", "rooli", "*"],
                id: {
                  "ui:widget": "hidden"
                }
              },
              "muut-oppimisymparistot": {
                "ui:options": { orderable: false },
                items: {
                  "ui:order": [
                    "oppimisymparisto-koodi-uri",
                    "oppimisymparisto-koodi-versio",
                    "*"
                  ],
                  "oppimisymparisto-koodi-uri": {
                    "ui:field": "typeahead",
                    typeahead: typeaheadProps(options.oppimisymparistot)
                  },
                  "oppimisymparisto-koodi-versio": {
                    "ui:widget": "hidden"
                  }
                }
              },
              keskeytymisajanjaksot: {
                "ui:options": { orderable: false },
                items: {
                  "ui:order": ["alku", "loppu", "*"]
                }
              }
            }
          },
          "osaamisen-osoittaminen": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "vaatimuksista-tai-tavoitteista-poikkeaminen",
                "jarjestaja",
                "nayttoymparisto",
                "osa-alueet",
                "tyoelama-osaamisen-arvioijat",
                "koulutuksen-jarjestaja-osaamisen-arvioijat",
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
              "tyoelama-osaamisen-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  "ui:order": ["nimi", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "koulutuksen-jarjestaja-osaamisen-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  "ui:order": ["nimi", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "sisallon-kuvaus": {
                "ui:options": { orderable: false }
              },
              "osa-alueet": {
                "ui:options": { orderable: false },
                items: {
                  "ui:order": ["koodi-uri", "koodi-versio"],
                  "koodi-uri": {
                    "ui:field": "typeahead",
                    typeahead: typeaheadProps(options.ammatillisenoppiaineet)
                  },
                  "koodi-versio": {
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
    "ui:options": {
      orderable: false
    },
    items: {
      id: {
        "ui:widget": "hidden"
      }
    }
  }
})

export const uiSchemaByStep = (
  options: UiSchemaOptions,
  currentStep: number
) => {
  const ui = fullUiSchema(options)
  return Object.keys(ui).reduce<{ [key: string]: any }>((uiSchema, key) => {
    if (propertiesByStep[currentStep].indexOf(key) > -1 && ui[key]) {
      uiSchema[key] = ui[key]
    }
    if (key === "ui:order") {
      uiSchema["ui:order"] = ui["ui:order"].filter(
        (k: string) => propertiesByStep[currentStep].indexOf(k) > -1
      )
    }
    return uiSchema
  }, {})
}

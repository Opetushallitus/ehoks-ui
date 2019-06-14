import { koodistoUrls } from "./koodistoUrls"
import { propertiesByStep } from "./propertiesByStep"

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

const fullUiSchema = (options: UiSchemaOptions): { [key: string]: any } => ({
  "ui:order": [
    "opiskeluoikeus-oid",
    "oppija-oid",
    "ensikertainen-hyvaksyminen",
    "sahkoposti",
    "urasuunnitelma-koodi-uri",
    "urasuunnitelma-koodi-versio",
    "osaamisen-hankkimisen-tarve",
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
    "ui:widget": "hidden"
  },
  "urasuunnitelma-koodi-uri": {
    "ui:field": "typeahead",
    typeahead: typeaheadProps(options.urasuunnitelma)
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
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
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
        "olennainen-seikka",
        "koulutuksen-jarjestaja-oid",
        "amosaa-tunniste",
        "valittu-todentamisen-prosessi-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-versio",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
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
      "valittu-todentamisen-prosessi-koodi-uri": {
        "ui:field": "typeahead",
        typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
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
            "sisallon-kuvaus",
            "koulutuksen-jarjestaja-osaamisen-arvioijat",
            "tyoelama-osaamisen-arvioijat",
            "yksilolliset-kriteerit",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
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
        "koulutuksen-jarjestaja-oid",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "tutkinnon-osa-koodi-uri",
        "tutkinnon-osa-koodi-versio",
        "osaamisen-hankkimistavat",
        "osaamisen-osoittaminen",
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
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osaamisen-hankkimistapa-koodi-uri",
            "osaamisen-hankkimistapa-koodi-versio",
            "alku",
            "loppu",
            "ajanjakson-tarkenne",
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
              "ui:order": ["nimi", "sahkoposti", "*"],
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
              }
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
        "olennainen-seikka",
        "koulutuksen-jarjestaja-oid",
        "amosaa-tunniste",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "osaamisen-hankkimistavat",
        "osaamisen-osoittaminen",
        "*"
      ],
      id: {
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
            "ajanjakson-tarkenne",
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
              "ui:order": ["nimi", "sahkoposti", "*"],
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
              }
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
            "ui:options": { orderable: false }
          },
          "osa-alueet": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": ["koodi-uri", "koodi-versio"],
              "koodi-uri": {
                "ui:field": "typeahead",
                typeahead: typeaheadProps(options.ammatillisenoppiaineet)
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
      "osa-alueet": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "vaatimuksista-tai-tavoitteista-poikkeaminen",
            "osaamisen-hankkimistavat",
            "osaamisen-osoittaminen",
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
                "ajanjakson-tarkenne",
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
                  "ui:order": ["nimi", "sahkoposti", "*"],
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
                  }
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
                "osa-alueet",
                "jarjestaja",
                "nayttoymparisto",
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

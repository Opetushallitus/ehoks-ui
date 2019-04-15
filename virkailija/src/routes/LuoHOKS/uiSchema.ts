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
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "nayttoymparisto",
            "jarjestaja",
            "koulutuksen-jarjestaja-arvioijat",
            "tyoelama-arvioijat",
            "keskeiset-tyotehtavat-naytto",
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
          "koulutuksen-jarjestaja-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "keskeiset-tyotehtavat-naytto": {
            "ui:options": { orderable: false }
          }
        }
      }
    }
  },
  "olemassa-olevat-paikalliset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
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
        "tarkentavat-tiedot-arvioija",
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
      "tarkentavat-tiedot-arvioija": {
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
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "nayttoymparisto",
            "jarjestaja",
            "koulutuksen-jarjestaja-arvioijat",
            "tyoelama-arvioijat",
            "keskeiset-tyotehtavat-naytto",
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
          "koulutuksen-jarjestaja-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "keskeiset-tyotehtavat-naytto": {
            "ui:options": { orderable: false }
          }
        }
      }
    }
  },
  "olemassa-olevat-yhteiset-tutkinnon-osat": {
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
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "nayttoymparisto",
            "jarjestaja",
            "koulutuksen-jarjestaja-arvioijat",
            "tyoelama-arvioijat",
            "keskeiset-tyotehtavat-naytto",
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
          "koulutuksen-jarjestaja-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "tyoelama-arvioijat": {
            "ui:options": {
              orderable: false
            },
            items: {
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "keskeiset-tyotehtavat-naytto": {
            "ui:options": { orderable: false }
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
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "valittu-todentamisen-prosessi-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.osaamisentodentamisenprosessi)
          },
          "osa-alue-koodi-uri": {
            "ui:field": "typeahead",
            typeahead: typeaheadProps(options.ammatillisenoppiaineet)
          },
          "tarkentavat-tiedot": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "osa-alue-koodi-uri",
                "osa-alue-koodi-versio",
                "nayttoymparisto",
                "jarjestaja",
                "koulutuksen-jarjestaja-arvioijat",
                "tyoelama-arvioijat",
                "keskeiset-tyotehtavat-naytto",
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
              "koulutuksen-jarjestaja-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "tyoelama-arvioijat": {
                "ui:options": {
                  orderable: false
                },
                items: {
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "keskeiset-tyotehtavat-naytto": {
                "ui:options": { orderable: false }
              }
            }
          }
        }
      }
    }
  },
  "puuttuvat-ammatilliset-tutkinnon-osat": {
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
              "ui:options": {
                orderable: false
              },
              items: {
                "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                id: {
                  "ui:widget": "hidden"
                }
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
          "muut-oppimisymparisto": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": [
                "oppimisymparisto-koodi-uri",
                "oppimisymparisto-koodi-versio",
                "selite",
                "lisatiedot",
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
      "hankitun-osaamisen-naytto": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "jarjestaja",
            "nayttoymparisto",
            "tyoelama-arvioijat",
            "koulutuksen-jarjestaja-arvioijat",
            "keskeiset-tyotehtavat-naytto",
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
          "koulutuksen-jarjestaja-arvioijat": {
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
          "keskeiset-tyotehtavat-naytto": {
            "ui:options": {
              orderable: false
            }
          }
        }
      }
    }
  },
  "puuttuvat-paikalliset-tutkinnon-osat": {
    "ui:options": {
      orderable: false
    },
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
              "ui:options": {
                orderable: false
              },
              items: {
                "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                id: {
                  "ui:widget": "hidden"
                }
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
          "muut-oppimisymparisto": {
            "ui:options": { orderable: false },
            items: {
              "ui:order": [
                "oppimisymparisto-koodi-uri",
                "oppimisymparisto-koodi-versio",
                "selite",
                "lisatiedot",
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
      "hankitun-osaamisen-naytto": {
        "ui:options": {
          orderable: false
        },
        items: {
          "ui:order": [
            "alku",
            "loppu",
            "osa-alue-koodi-uri",
            "osa-alue-koodi-versio",
            "jarjestaja",
            "nayttoymparisto",
            "tyoelama-arvioijat",
            "koulutuksen-jarjestaja-arvioijat",
            "keskeiset-tyotehtavat-naytto",
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
          "koulutuksen-jarjestaja-arvioijat": {
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
          "keskeiset-tyotehtavat-naytto": {
            "ui:options": { orderable: false }
          }
        }
      }
    }
  },
  "puuttuvat-yhteiset-tutkinnon-osat": {
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
                  "ui:options": {
                    orderable: false
                  },
                  items: {
                    "ui:order": ["nimi", "rooli", "organisaatio", "*"],
                    id: {
                      "ui:widget": "hidden"
                    }
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
              "muut-oppimisymparisto": {
                "ui:options": { orderable: false },
                items: {
                  "ui:order": [
                    "oppimisymparisto-koodi-uri",
                    "oppimisymparisto-koodi-versio",
                    "selite",
                    "lisatiedot",
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
          "hankitun-osaamisen-naytto": {
            "ui:options": {
              orderable: false
            },
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "osa-alue-koodi-uri",
                "osa-alue-koodi-versio",
                "jarjestaja",
                "nayttoymparisto",
                "osaamistavoitteet",
                "tyoelama-arvioijat",
                "koulutuksen-jarjestaja-arvioijat",
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
              osaamistavoitteet: {
                "ui:options": { orderable: false }
              },
              "tyoelama-arvioijat": {
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
              "koulutuksen-jarjestaja-arvioijat": {
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
              "keskeiset-tyotehtavat-naytto": {
                "ui:options": { orderable: false }
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

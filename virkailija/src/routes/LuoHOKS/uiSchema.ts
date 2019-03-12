export const uiSchema = {
  "ui:order": [
    "opiskeluoikeus-oid",
    "oppija-oid",
    "ensikertainen-hyvaksyminen",
    "sahkoposti",
    "urasuunnitelma-koodi-uri",
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
  "olemassa-olevat-ammatilliset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-uri",
        "koulutuksen-jarjestaja-oid",
        "tarkentavat-tiedot-arvioija",
        "tarkentavat-tiedot-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
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
            "koulutuksenjarjestaja-arvioijat",
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
          "koulutuksenjarjestaja-arvioijat": {
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
  "olemassa-oleva-paikallinen-tutkinnon-osat": {
    items: {
      "ui:order": [
        "nimi",
        "laajuus",
        "koulutuksen-jarjestaja-oid",
        "amosaa-tunniste",
        "tavoitteet-ja-sisallot",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      }
    }
  },
  "olemassa-olevat-yhteiset-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "valittu-todentamisen-prosessi-koodi-uri",
        "koulutuksen-jarjestaja-oid",
        "tarkentavat-tiedot-arvioija",
        "tarkentavat-tiedot-naytto",
        "osa-alueet",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
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
            "koulutuksenjarjestaja-arvioijat",
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
          "koulutuksenjarjestaja-arvioijat": {
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
            "koulutuksen-jarjestaja-oid",
            "*"
          ],
          id: {
            "ui:widget": "hidden"
          },
          "tarkentavat-tiedot": {
            items: {
              "ui:order": [
                "alku",
                "loppu",
                "nayttoymparisto",
                "jarjestaja",
                "koulutuksenjarjestaja-arvioijat",
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
              "koulutuksenjarjestaja-arvioijat": {
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
  "puuttuva-ammatillinen-tutkinnon-osat": {
    items: {
      "ui:order": [
        "koulutuksen-jarjestaja-oid",
        "vaatimuksista-tai-tavoitteista-poikkeaminen",
        "tutkinnon-osa",
        "osaamisen-hankkimistavat",
        "hankitun-osaamisen-naytto",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "tutkinnon-osa": {
        id: {
          "ui:widget": "hidden"
        }
      },
      "osaamisen-hankkimistavat": {
        items: {
          "ui:order": [
            "osamisen-hankkimistapa-koodi-uri",
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
            "koulutuksenjarjestaja-arvioijat",
            "yto-osa-alue-koodi-uri",
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
          "tyoelama-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksenjarjestaja-arvioijat": {
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
  "puuttuva-paikallinen-tutkinnon-osat": {
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
            "osamisen-hankkimistapa-koodi-uri",
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
            "koulutuksenjarjestaja-arvioijat",
            "yto-osa-alue-koodi-uri",
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
          "tyoelama-arvioijat": {
            items: {
              "ui:order": ["nimi", "*"],
              id: {
                "ui:widget": "hidden"
              }
            }
          },
          "koulutuksenjarjestaja-arvioijat": {
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
  "puuttuva-yhteisen-tutkinnon-osat": {
    items: {
      "ui:order": [
        "tutkinnon-osa-koodi-uri",
        "koulutuksen-jarjestaja-oid",
        "osa-alueet",
        "*"
      ],
      id: {
        "ui:widget": "hidden"
      },
      "osa-alueet": {
        items: {
          "ui:order": [
            "osa-alue-koodi-uri",
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
                "osamisen-hankkimistapa-koodi-uri",
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
                "koulutuksenjarjestaja-arvioijat",
                "yto-osa-alue-koodi-uri",
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
              "tyoelama-arvioijat": {
                items: {
                  "ui:order": ["nimi", "*"],
                  id: {
                    "ui:widget": "hidden"
                  }
                }
              },
              "koulutuksenjarjestaja-arvioijat": {
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
}

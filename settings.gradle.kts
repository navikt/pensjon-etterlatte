rootProject.name = "pensjon-etterlatte-root"

include(
    "libs:ktorclient-auth-clientcredentials",
    "libs:common",
    "libs:common-test",
    "apps:selvbetjening-api",
    "apps:journalfoer-soeknad",
    "apps:innsendt-soeknad",
    "apps:sjekk-adressebeskyttelse"
)

rootProject.name = "pensjon-etterlatte-root"

include(
    "apps:etterlatte-proxy",
    "libs:ktorclient-auth-clientcredentials",
    "libs:common",
    "libs:common-test",
    "apps:selvbetjening-api",
    "apps:journalfoer-soeknad",
    "apps:innsendt-soeknad",
    "apps:sjekk-adressebeskyttelse",
    "apps:etterlatte-notifikasjoner",
    "apps:etterlatte-pdl-proxy",
    "jobs:post-til-kafka"
)

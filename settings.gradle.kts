rootProject.name = "pensjon-etterlatte-root"

include(
    "apps:etterlatte-proxy",
    "apps:heartbeat",
    "libs:ktorclient-auth-clientcredentials",
    "libs:common",
    "apps:selvbetjening-api",
    "apps:journalfoer-soeknad",
    "apps:innsendt-soeknad",
    "apps:finn-fnr-soeknad",
    "apps:sjekk-adressebeskyttelse",
    "apps:journalpost-info",
    "apps:etterlatte-notifikasjoner",
    "apps:etterlatte-pdl-proxy"
)

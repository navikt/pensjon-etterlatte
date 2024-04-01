rootProject.name = "pensjon-etterlatte-root"

plugins {
    kotlin("jvm") version "1.9.23" apply false
}

include(
    "apps:selvbetjening-api",
    "apps:journalfoer-soeknad",
    "apps:innsendt-soeknad",
    "apps:sjekk-adressebeskyttelse"
)

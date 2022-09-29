rootProject.name = "pensjon-etterlatte-root"

plugins {
    kotlin("jvm") version "1.7.0" apply false
}

include(
    "apps:selvbetjening-api",
    "apps:journalfoer-soeknad",
    "apps:innsendt-soeknad",
    "apps:sjekk-adressebeskyttelse"
)

rootProject.name = "pensjon-etterlatte-root"

plugins {
    kotlin("jvm") version "2.0.0" apply false
}

include(
    "apps:selvbetjening-api",
    "apps:innsendt-soeknad",
    "libs:utils",
    "libs:pdl",
    "libs:common-test",
    "libs:ktor-client-auth",
)

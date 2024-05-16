rootProject.name = "pensjon-etterlatte-root"

plugins {
    kotlin("jvm") version "1.9.24" apply false
}

include(
    "apps:selvbetjening-api",
    "apps:innsendt-soeknad",
    "libs:utils",
    "libs:pdl",
    "libs:common-test",
    "libs:ktor-client-auth",
)

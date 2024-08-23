rootProject.name = "pensjon-etterlatte-root"

plugins {
    kotlin("jvm") version "2.0.0" apply false
}

include(
    "apps:selvbetjening-backend",
    "apps:innsendt-soeknad",
    "libs:utils",
)

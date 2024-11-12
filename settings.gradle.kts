rootProject.name = "pensjon-etterlatte-root"

include(
    "apps:selvbetjening-backend",
    "apps:innsendt-soeknad",
    "libs:utils",
)
include("libs:etterlatte-funksjonsbrytere")
findProject(":libs:etterlatte-funksjonsbrytere")?.name = "etterlatte-funksjonsbrytere"
pluginManagement {
    repositories {
        gradlePluginPortal()
        maven(
            //name = "JCenter Gradle Plugins",
            url = "https://dl.bintray.com/gradle/gradle-plugins"
        )
    }
}
rootProject.name = "pensjon-etterlatte-root"

include("apps:etterlatte-proxy")
include("apps:heartbeat")
include("libs:ktorclient-auth-clientcredentials")
include("libs:common")
include("apps:selvbetjening-api")
include("apps:journalfoer-soeknad")
include("apps:innsendt-soeknad")
include("apps:finn-fnr-soeknad")
include("apps:sjekk-adressebeskyttelse")
include("apps:journalpost-info")
include("apps:etterlatte-notifikasjoner")
include("apps:etterlatte-pdl-proxy")

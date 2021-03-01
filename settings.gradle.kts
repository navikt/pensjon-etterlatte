pluginManagement {
    repositories {
        gradlePluginPortal()
        jcenter()
        maven (
            //name = "JCenter Gradle Plugins",
            url =  "https://dl.bintray.com/gradle/gradle-plugins"
        )
    }
}
rootProject.name = "pensjon-etterlatte-root"

include("apps:dodsfall-fra-leesah")
include("apps:finn-etterlatte")
include("apps:etterlatte-proxy")
include("libs:ktorclient-auth-clientcredentials")

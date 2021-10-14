plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(Ktor.ServerNetty)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientCoreJvm)
    implementation(Ktor.ClientAuthJvm)
    implementation(Ktor.ClientApache)
    implementation(Ktor.ClientJackson)
    implementation(Ktor.ClientLogging)
    implementation(Ktor.ServerCore)
    implementation(Ktor.Auth)
    implementation(Ktor.AuthJwt)
    implementation(Ktor.Jackson)
    testImplementation(NavFelles.MockOauth2Server)

    testImplementation(Ktor.ServerTests)

    implementation(Micrometer.Prometheus)
    implementation("org.json:json:20180813")
}

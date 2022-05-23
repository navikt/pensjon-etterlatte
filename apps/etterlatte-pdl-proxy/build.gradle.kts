plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(project(":libs:common"))
    implementation(project(":libs:ktorclient-auth-clientcredentials"))

    implementation(NavFelles.TokenClientCore)
    implementation(NavFelles.TokenValidationKtor)

    implementation(Ktor.OkHttp)
    implementation(Ktor.ServerNetty)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientCoreJvm)
    implementation(Ktor.ClientAuthJvm)
    implementation(Ktor.ClientApache)
    implementation(Ktor.ClientJackson)
    implementation(Ktor.ClientLogging)
    implementation(Ktor.ClientCioJvm)
    implementation(Ktor.ServerCore)
    implementation(Ktor.ServerCio)
    implementation(Ktor.Auth)
    implementation(Ktor.Jackson)

    testImplementation(Ktor.ServerTests)
    testImplementation(NavFelles.MockOauth2Server)

    implementation(Jackson.DatatypeJsr310)

    implementation(Micrometer.Prometheus)
}

/*
java {
    sourceCompatibility = JavaVersion.VERSION_16
    targetCompatibility = JavaVersion.VERSION_16
}
*/

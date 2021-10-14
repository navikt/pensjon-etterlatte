plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Ktor.OkHttp)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientLoggingJvm)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientJackson)

    implementation(project(":libs:ktorclient-auth-clientcredentials"))
    implementation("com.nfeld.jsonpathkt:jsonpathkt:2.0.0")
    implementation(project(":libs:common"))

    testImplementation(Ktor.ClientMock)
}

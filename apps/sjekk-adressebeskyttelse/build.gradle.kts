plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Ktor.OkHttp)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientLoggingJvm)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientJackson)

    implementation(Etterlatte.Common)
    implementation(Etterlatte.KtorClientAuth)

    testImplementation(MockK.MockK)
    testImplementation(Ktor.ClientMock)
    testImplementation(Kotlinx.CoroutinesCore)
}

plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Ktor.OkHttp)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientLogging)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientContentNegotiation)
    implementation(Ktor.Jackson)

    implementation(Etterlatte.Common)
    implementation(Etterlatte.KtorClientAuth)

    testImplementation(MockK.MockK)
    testImplementation(Ktor.ClientMock)
    testImplementation(Kotlinx.CoroutinesCore)
}

plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Ktor.OkHttp)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.Jackson)

    implementation(Etterlatte.Common)
    implementation(Etterlatte.KtorClientAuth)

    testImplementation(Ktor.ClientMock)
    testImplementation(MockK.MockK)
    testImplementation(Kotlinx.CoroutinesCore)
    testImplementation(Kotest.AssertionsCore)

    testImplementation(Etterlatte.CommonTest)
}

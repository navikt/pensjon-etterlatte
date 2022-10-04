plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(Etterlatte.Common)
    implementation(Etterlatte.KtorClientAuth)

    implementation(Ktor.OkHttp)
    implementation(Ktor.ServerCore)
    implementation(Ktor.ServerCio)
    implementation(Ktor.CallLogging)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.MetricsMicrometer)
    implementation(Ktor.Jackson)
    implementation(Ktor.ServerAuth)
    implementation(Ktor.ClientContentNegotiation)
    implementation(Ktor.ServerContentNegotiation)

    implementation(Micrometer.Prometheus)

    implementation(Jackson.DatatypeJsr310)
    implementation(Jackson.DatatypeJdk8)
    implementation(Jackson.ModuleKotlin)

    implementation(NavFelles.TokenClientCore)
    implementation(NavFelles.TokenValidationKtor)

    testImplementation(MockK.MockK)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(Ktor.ClientMock)
    testImplementation(Ktor.ServerTests)
    testImplementation(Kotlinx.CoroutinesCore)
    testImplementation(NavFelles.MockOauth2Server)
    testImplementation(Etterlatte.CommonTest)
}

plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Kafka.Clients)

    implementation(Ktor.OkHttp)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientLoggingJvm)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientJackson)

    //implementation("com.github.navikt:brukernotifikasjon-schemas:1.2021.08.27-09.12-f8a8cbc76319")
    implementation("com.github.navikt:brukernotifikasjon-schemas:1.2022.02.23-10.36-ad966c7d1c14")
    implementation(project(":libs:ktorclient-auth-clientcredentials"))
    implementation ("com.nfeld.jsonpathkt:jsonpathkt:2.0.0")
    implementation("io.confluent:kafka-avro-serializer:5.3.0") {
        exclude(group = "org.slf4j", module = "slf4j-log4j12")
    }

    testImplementation(Ktor.ClientMock)
    testImplementation(Kafka.EmbeddedEnv)
}

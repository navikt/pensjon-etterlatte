plugins {
    id("etterlatte.kafka")
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(Kafka.Clients)

    implementation("org.jetbrains.kotlin:kotlin-reflect:1.5.0")
    implementation("ch.qos.logback:logback-classic:1.2.5")
    implementation("net.logstash.logback:logstash-logback-encoder:6.6") {
        exclude("com.fasterxml.jackson.core")
        exclude("com.fasterxml.jackson.dataformat")
    }

    implementation(Jackson.Core)
    implementation(Jackson.Databind)
    implementation(Jackson.ModuleKotlin)
    implementation(Jackson.DatatypeJsr310)


    testImplementation("io.mockk:mockk:1.12.0")

    testImplementation(Kafka.EmbeddedEnv)

}

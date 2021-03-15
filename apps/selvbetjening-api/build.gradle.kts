plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation("io.ktor:ktor-server-core:1.4.3")
    implementation("io.ktor:ktor-server-netty:1.4.3")
    implementation("io.ktor:ktor-metrics-micrometer:1.4.3")
    implementation("io.ktor:ktor-jackson:1.4.3")
    implementation("io.micrometer:micrometer-registry-prometheus:1.6.1")
    implementation("com.fasterxml:jackson-xml-databind:0.6.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.12.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.12.0")
    implementation("ch.qos.logback:logback-classic:1.2.1")

    testImplementation("org.junit.jupiter:junit-jupiter-api:5.6.0")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.6.0")
    testImplementation("io.ktor:ktor-server-tests:1.4.3")

}

tasks.named<Jar>("jar") {
    archiveBaseName.set("app")

    manifest {
        attributes["Main-Class"] = "no.nav.etterlatte.ApplicationKt"
        attributes["Class-Path"] = configurations.runtimeClasspath.get().joinToString(separator = " ") {
            it.name
        }
    }

    doLast {
        configurations.runtimeClasspath.get().forEach {
            val file = File("$buildDir/libs/${it.name}")
            if (!file.exists())
                it.copyTo(file)
        }
    }

}

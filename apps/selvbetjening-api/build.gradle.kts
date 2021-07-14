val ktorversion: String by project
val tokensupportversion: String by project

plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation("io.ktor:ktor-server-core:$ktorversion")
    implementation("io.ktor:ktor-server-netty:$ktorversion")
    implementation("io.ktor:ktor-metrics-micrometer:$ktorversion")
    implementation("io.ktor:ktor-jackson:$ktorversion")
    implementation("io.ktor:ktor-auth:$ktorversion")
    implementation("io.ktor:ktor-client-logging:$ktorversion")
    implementation("io.micrometer:micrometer-registry-prometheus:1.6.1")
    implementation("com.fasterxml:jackson-xml-databind:0.6.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.12.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.12.0")
    implementation("no.nav.security:token-client-core:$tokensupportversion")
    implementation("no.nav.security:token-validation-ktor:$tokensupportversion")

    testImplementation("org.junit.jupiter:junit-jupiter-api:5.6.0")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.6.0")
    testImplementation("io.ktor:ktor-server-tests:1.4.3")
    testImplementation("no.nav.security:mock-oauth2-server:0.3.1")

    implementation("io.ktor:ktor-client-core:$ktorversion")
    implementation("io.ktor:ktor-client-jackson:$ktorversion")
    implementation("io.ktor:ktor-jackson:$ktorversion")
    implementation("io.ktor:ktor-client-cio-jvm:$ktorversion")
    implementation("io.ktor:ktor-server-netty:$ktorversion")
    implementation("io.ktor:ktor-server-cio:$ktorversion")
    implementation("io.ktor:ktor-client-auth:$ktorversion")
    implementation("io.ktor:ktor-server-core:$ktorversion")
    implementation("io.ktor:ktor-html-builder:$ktorversion")

    // Logging
    implementation("org.slf4j:slf4j-api:1.7.30")
    implementation("ch.qos.logback:logback-classic:1.2.3")
    implementation("net.logstash.logback:logstash-logback-encoder:6.6")
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

val junitJupiterVersion: String by project
val ktorversion: String by project
val rapidsandriversversion: String by project
val kotliqueryVersion = "1.3.1"
val flywayVersion = "6.5.0"
val hikariVersion = "3.4.5"
val tokensupportversion: String by project
val kotestVersion: String by project


plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("com.zaxxer:HikariCP:$hikariVersion")
    implementation("com.github.seratch:kotliquery:$kotliqueryVersion")
    implementation("org.flywaydb:flyway-core:$flywayVersion")
    implementation("com.github.navikt:rapids-and-rivers:$rapidsandriversversion")
    implementation("org.postgresql:postgresql:42.2.5")
    implementation("io.ktor:ktor-auth:$ktorversion")
    implementation("no.nav.security:token-validation-ktor:$tokensupportversion")
    testImplementation("com.h2database:h2:1.4.200")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")
    implementation("io.ktor:ktor-jackson:$ktorversion")

    implementation("io.ktor:ktor-client-core:$ktorversion")
    implementation("io.ktor:ktor-client-jackson:$ktorversion")
    implementation("io.ktor:ktor-client-cio-jvm:$ktorversion")

    testImplementation("org.testcontainers:junit-jupiter:1.15.3")
    testImplementation("org.testcontainers:postgresql:1.15.3")
    testImplementation("io.ktor:ktor-server-tests:$ktorversion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
    testImplementation("io.mockk:mockk:1.12.0")

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



val logbackversion: String by project
val ktorversion: String by project
val kotlinversion: String by project
val micrometerversion: String by project
val orgJsonVersion: String by project
val junitJupiterVersion: String by project

plugins {
    application
    kotlin("jvm")
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlinversion")
    implementation("io.ktor:ktor-server-netty:$ktorversion")
    implementation("ch.qos.logback:logback-classic:$logbackversion")

    implementation("io.ktor:ktor-client-core:$ktorversion")
    implementation("io.ktor:ktor-client-core-jvm:$ktorversion")
    implementation("io.ktor:ktor-client-auth-jvm:$ktorversion")
    implementation("io.ktor:ktor-client-apache:$ktorversion")
    implementation("io.ktor:ktor-client-jackson:$ktorversion")
    implementation("io.ktor:ktor-client-logging:$ktorversion")
    implementation("io.ktor:ktor-server-core:$ktorversion")
    implementation("io.ktor:ktor-auth:$ktorversion")
    implementation("io.ktor:ktor-auth-jwt:$ktorversion")
    implementation("io.ktor:ktor-jackson:$ktorversion")
    implementation("io.micrometer:micrometer-registry-prometheus:$micrometerversion")
    testImplementation("io.ktor:ktor-server-tests:$ktorversion")
    implementation("org.json:json:$orgJsonVersion")
   // implementation("org.slf4j:slf4j-api:1.7.30")

    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")

    // Logging
    implementation("org.slf4j:slf4j-api:1.7.30")
    implementation("ch.qos.logback:logback-classic:1.2.3")
    implementation("net.logstash.logback:logstash-logback-encoder:6.6")
}

java {
    sourceCompatibility = JavaVersion.VERSION_12
    targetCompatibility = JavaVersion.VERSION_12
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

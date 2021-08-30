val junitJupiterVersion: String by project
val ktorversion: String by project
val rapidsandriversversion: String by project

plugins {
    application
    kotlin("jvm")
}

repositories {
    maven("https://packages.confluent.io/maven/")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("org.apache.kafka:kafka-clients"){
        version {
            strictly("2.7.1")
        }
    }

    implementation("com.github.navikt:rapids-and-rivers:$rapidsandriversversion")
    implementation("io.ktor:ktor-client-okhttp:$ktorversion")
    implementation("io.ktor:ktor-client-core:$ktorversion")
    implementation("io.ktor:ktor-client-logging-jvm:$ktorversion")
    implementation("io.ktor:ktor-client-auth:$ktorversion")
    implementation("io.ktor:ktor-client-jackson:$ktorversion")
    implementation("com.github.navikt:brukernotifikasjon-schemas:1.2021.08.27-09.12-f8a8cbc76319")
    implementation(project(":libs:ktorclient-auth-clientcredentials"))
    implementation ("com.nfeld.jsonpathkt:jsonpathkt:2.0.0")
    implementation("io.confluent:kafka-avro-serializer:5.3.0") {
        exclude(group = "org.slf4j", module = "slf4j-log4j12")
    }


    testImplementation("io.ktor:ktor-client-mock:$ktorversion")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")
    testImplementation( "no.nav:kafka-embedded-env:2.7.0")


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



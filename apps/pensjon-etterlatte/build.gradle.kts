import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm")
    id("com.commercehub.gradle.plugin.avro") version "0.21.0"
    id("com.github.johnrengelman.shadow") version "5.2.0"
}

repositories {
    mavenCentral()
    maven("https://packages.confluent.io/maven/")
    maven("https://jitpack.io")
}
/*
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version"
}
*/
dependencies {
    implementation("io.ktor:ktor-server-core:1.4.3")
    implementation("io.ktor:ktor-server-netty:1.4.3")
    implementation("io.ktor:ktor-metrics-micrometer:1.4.3")
    implementation ("io.ktor:ktor-jackson:1.4.3")
    implementation("io.micrometer:micrometer-registry-prometheus:1.6.1")
    implementation("com.fasterxml:jackson-xml-databind:0.6.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.12.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.12.0")
    implementation("org.apache.kafka:kafka-clients:2.5.0")
    implementation("org.apache.avro:avro:1.10.0")
    implementation("io.confluent:kafka-avro-serializer:5.0.0") {
        exclude(group = "org.slf4j", module = "slf4j-log4j12")
    }
    implementation("no.nav.security:token-support:1.3.3")
    implementation ("ch.qos.logback:logback-classic:1.2.1")




    testImplementation("org.junit.jupiter:junit-jupiter-api:5.6.0")
    testImplementation("no.nav:kafka-embedded-env:2.5.0") {
        exclude(group = "org.slf4j", module = "slf4j-log4j12")
    }
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.6.0")
    testImplementation ("io.ktor:ktor-server-tests:1.4.3")

}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "14"
}



tasks.named<Jar>("jar") {
    archiveBaseName.set("app")
    manifest {
        attributes["Main-Class"] = "no.nav.etterlatte.ApplicationKt"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<Wrapper> {
    gradleVersion = "6.7"
}




val junitJupiterVersion = "5.6.2"
val ktorVersion = "1.5.1"

plugins {
    kotlin("jvm")
    //id("com.expediagroup.graphql") version $latestGraphQLKotlinVersion
    id("com.github.johnrengelman.shadow") version "5.2.0"

}

version = "unspecified"

repositories {
    mavenCentral()
    maven("https://jitpack.io")
    maven("https://kotlin.bintray.com/ktor")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("com.github.navikt:rapids-and-rivers:1.880e7a5")
    //implementation("com.expediagroup", "graphql-kotlin-ktor-client" , "4.0.0-alpha.13")
    implementation("io.ktor:ktor-client-okhttp:$ktorVersion")
    implementation("io.ktor:ktor-client-logging-jvm:$ktorVersion")
    implementation("io.ktor:ktor-client-auth:$ktorVersion")
    implementation("io.ktor:ktor-client-jackson:$ktorVersion")

    testImplementation("io.ktor:ktor-client-mock:$ktorVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")

}
tasks.named<Jar>("jar") {
    archiveBaseName.set("app")
    manifest {
        attributes["Main-Class"] = "FinnetterlatteKt"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}

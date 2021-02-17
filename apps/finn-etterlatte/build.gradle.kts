plugins {
    kotlin("jvm") version "1.4.10"
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

}
tasks.named<Jar>("jar") {
    archiveBaseName.set("app")
    manifest {
        attributes["Main-Class"] = "FinnetterlatteKt"
    }
}

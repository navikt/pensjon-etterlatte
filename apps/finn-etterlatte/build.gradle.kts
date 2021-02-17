plugins {
    kotlin("jvm") version "1.4.10"
}

version = "unspecified"

repositories {
    mavenCentral()
    maven("https://jitpack.io")
    maven("https://kotlin.bintray.com/ktor")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("com.github.navikt:rapids-and-rivers:1.61eb329")

}

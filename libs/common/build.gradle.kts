import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))

    api(Jackson.DatatypeJsr310)
    api(Jackson.DatatypeJdk8)
    api(Jackson.ModuleKotlin)

    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientLoggingJvm)
    implementation(Ktor.ClientAuth)
    implementation(Ktor.ClientJackson)

    testImplementation(Jupiter.Api)
    testImplementation(Jupiter.Params)
    testRuntimeOnly(Jupiter.Engine)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(MockK.MockK)
    testImplementation(Ktor.ClientMock)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }

    withType<KotlinCompile> {
        kotlinOptions.jvmTarget = "16"
    }
}

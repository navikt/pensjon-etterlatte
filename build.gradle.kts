import com.github.jk1.license.render.InventoryReportRenderer
import com.github.jk1.license.render.JsonReportRenderer
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    alias(libs.plugins.license) apply true
}

licenseReport {
    renderers = arrayOf(JsonReportRenderer(), InventoryReportRenderer())
    allowedLicensesFile = File("$projectDir/buildSrc/akseptable-lisenser.json")
}

subprojects.forEach { sub ->
    sub.repositories {
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/navikt/pensjon-etterlatte-libs")
            credentials {
                username = "token"
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
    sub.tasks {
        withType<Test> {
            useJUnitPlatform()
            testLogging {
                events(TestLogEvent.PASSED, TestLogEvent.SKIPPED, TestLogEvent.FAILED)
                exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
            }
        }
    }
}
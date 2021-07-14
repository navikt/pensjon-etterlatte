package no.nav.kafkamanager.config

import org.apache.tomcat.util.http.Rfc6265CookieProcessor
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory
import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TomcatConfig {

    @Bean
    fun cookieProcessorCustomizer(): WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
        return WebServerFactoryCustomizer { tomcatServletWebServerFactory ->
            tomcatServletWebServerFactory.addContextCustomizers(TomcatContextCustomizer { context ->
                val processor = Rfc6265CookieProcessor()
                processor.setSameSiteCookies("lax")
                context.cookieProcessor = processor
            })
        }
    }

}
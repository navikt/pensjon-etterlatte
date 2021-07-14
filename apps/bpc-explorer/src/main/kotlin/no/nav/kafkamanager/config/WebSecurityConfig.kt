package no.nav.kafkamanager.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter


@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http.authorizeRequests()
            .antMatchers("/internal/**", "/oauth2/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .csrf().disable() // Use SameSite=lax instead
            .oauth2Login()
            .redirectionEndpoint { it.baseUri("/oauth2/callback") }
            .defaultSuccessUrl("/index.html")
    }

}
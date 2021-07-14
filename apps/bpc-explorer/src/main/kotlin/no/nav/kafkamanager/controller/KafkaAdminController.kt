package no.nav.kafkamanager.controller

import org.springframework.security.core.Authentication
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api")
class KafkaAdminController {

    @GetMapping("/name")
    fun name(principal: Principal): String {
        return principal.name
    }

    @GetMapping("/name")
    fun subject(@AuthenticationPrincipal principal: Jwt): String {
        return principal.getClaimAsString("sub")
    }

    @GetMapping("/test")
    fun test(principal: Authentication): String {
        return principal.isAuthenticated.toString()
    }


}
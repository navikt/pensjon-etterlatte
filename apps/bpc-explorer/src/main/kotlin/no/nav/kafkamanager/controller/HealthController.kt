package no.nav.kafkamanager.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/internal")
class HealthController {


    @GetMapping("/isalive")
    fun isalive() = "OK"
    @GetMapping("/isready")
    fun isready() = "OK"

}
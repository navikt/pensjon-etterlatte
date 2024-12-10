-- Inntektsendring ble sendt til manuell ved en feil på grunn av bryter for manuell var på i prod
-- Setter status tilbake for at den sendes på nytt for å bli gjort del-automatisk
update inntektsjustering
set status = 'LAGRET'
where id = 'e9db4a44-c4f8-4d8a-b9b6-f26d190759db';

# ey-pdfgen
PDF generator for Etterlatte og barnepensjon. Kjør lokalt docker image med  `./run_development.sh`

For å trigge PDF-gen må du gå til følgende url (`HTTP_GET`):

http://localhost:8081/api/v1/genpdf/eypdfgen/gjenlevendepensjon_v1

http://localhost:8081/api/v1/genpdf/eypdfgen/barnepensjon_v1

Templatene vil bruke flettedata fra json-fil med samme navn som template i `data/supdfgen`

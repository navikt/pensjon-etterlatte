# su-pdfgen
PDF generator for Etterlatte og barnepensjon. Kjør lokalt docker image med  `./run_development.sh`

PDFene kan testes lokalt på `http://localhost:8081/api/v1/genpdf/<application>/<template>`, f.eks.
http://localhost:8081/api/v1/genpdf/supdfgen/vedtakInnvilgelse

Templatene vil bruke flettedata fra json-fil med samme navn som template i `data/supdfgen`

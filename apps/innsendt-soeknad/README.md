# innsendt-soeknad

Database app for håndtering av søknader (lagring, uthenting, sending, m.m.).

### Request

#### Søknad

`POST /api/soeknad`

#### Kladd

`POST /api/kladd`\
`GET /api/kladd`\
`DELETE /api/kladd`

### Databasetilgang 

For å enkelt få tilgang til databasen i dev eller prod kan du kjøre scriptet `nav_db_access.sh`. 

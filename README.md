# Visa-Dashboard-Project

Authors: Colin Stokes, Chujia Guo, Brayden Rosling, and Sabeeh Safdar

## Running the development environments:
### Using Docker-Compose
This has hot uploading \
`docker compose -f docker-compose.dev.yml up --build`

There is a provided Makefile that runs this, try `make dev`
## Running the production environment:
### Using Docker-Compose
`docker compose -f docker-compose.prod.yml up --build -d`

There is a provided Makefile that runs this, try `make prod`

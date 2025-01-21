FROM postgres:latest

USER postgres

COPY ../migrations/*.sql /docker-entrypoint-initdb.d

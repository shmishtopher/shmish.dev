# shmish.dev

## Local Development

Fill in the .env file with the listed variables and secrets
before running the project with docker compose.

### .env

```bash
# The hostname, use localhost for development
HOSTNAME=localhost

# Generate a random secret using `openssl rand -hex 16`
SESSION_SECRET=

# Automated SSL certificates, TLS should be false for
# development to avoid rate limits
ACME_EMAIL=me@example.com
ACME_TLS_CHALLENGE=false

# Database configuration
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# GitHub tokens and secrets, used for making API requests
# and federated sign-in
GH_TOKEN=
GH_CLIENT_SECRET=
GH_CLIENT_ID=
```

### Bringing up the dev server

The dev server can be launched using docker compose.
Compose will automatically merge the dev overrides and load
in the environment variables from `.env`.

```bash
docker compose up -d
```

## Deployment

Deployment is done with docker compose. A number of
variables must be present for deployment to succeed.
Simply configure the environment variables for production
and point your `DOCKER_HOST` at the target VPS.

```bash
DOCKER_HOST=ssh://deployer@example.com docker compose up -f docker-compose.yml -d
```

Provided the remote host has properly configured both the
docker daemon and the deployer user, this should pull the
latest images from the package repository and bring up the
service. You may optionally specify an environment file if
you wish to have seperate `.env` and `.env.prod` files.

```bash
DOCKER_HOST=ssh://deployer@example.com docker compose \
  --env-file .env.production \
  -f docker-compose.yml up -d \
  --force-recreate \
  --pull always
```

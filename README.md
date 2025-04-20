# shmish.dev

## Development

For local development, pull down the repository and install
the project's dependencies using `npm i`. Create a `.env`
file and fill in the required environment variables. The
`.env` file will be automatically loaded into the
application's environment when we start the devlopment
server using `npm run dev`.

### .env

```bash
# Generate a random secret using `openssl rand -hex 16`
SESSION_SECRET=

# GitHub tokens and secrets, used for making API requests
# and federated sign-in
GH_TOKEN=
GH_CLIENT_SECRET=
GH_CLIENT_ID=
```

## Deployment

Docker images of the application are rebuilt on every
commit to the master branch. We can deploy the image behind
a reverse proxy using docker compose on a remote VPS. An
example deployment might look like this.

```yaml
version: '3.8'

services:
  portfolio:
    image: ghcr.io/shmishtopher/shmish.dev:latest
    container_name: portfolio
    restart: unless-stopped
    env_file: production.env
    expose:
      - "3000"
    volumes:
      - ./portfolio.sqlite:/app/portfolio.sqlite
    networks:
      - web

  caddy:
    image: caddy:alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - web

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --cleanup

volumes:
  caddy_data:
  caddy_config:

networks:
  web:
    external: false
```

### Extra files

Note that these files must exist on the host *before*
bringing up the stack. We need to create `production.env`
file, a `Caddyfile`, and a `portfolio.sqlite` file.

#### `production.env`

This file is simple enough, we just need to provide our
production environment variables in the exact same format
as our development `.env`

#### `Caddyfile`

This defines our production reverse proxy. Caddy will
handle SSL for us automatically.

```caddyfile
shmish.dev {
  reverse_proxy portfolio:3000
}
```

#### `portfolio.sqlite`

This file just needs to exist on the host so that compose
will mount the database as file instead of a directory.
running `touch portfolio.sqlite` should suffice.

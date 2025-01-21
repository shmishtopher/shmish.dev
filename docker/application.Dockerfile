# Stage 0: Development
FROM node:23 AS development

USER node

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 1: Build
FROM node:23 AS builder

WORKDIR /app

COPY .. .

RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:23 AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY package.json package.json

EXPOSE 3000

CMD ["npm", "run", "start"] 

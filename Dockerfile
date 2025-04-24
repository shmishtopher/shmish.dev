# Stage 1: Build
FROM node:23 AS builder

WORKDIR /build

COPY . .

RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:23 AS production

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

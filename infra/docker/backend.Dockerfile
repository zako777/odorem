FROM node:22-bookworm-slim AS build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app/backend/build

COPY --from=build /app/backend/build/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/backend/build ./

RUN mkdir -p /app/backend/build/tmp && chown -R node:node /app/backend
USER node

EXPOSE 3333
CMD ["node", "bin/server.js"]

# Build context: apps/api (e.g. docker compose build with context: ./apps/api)
FROM node:22-alpine
RUN apk add --no-cache bash
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application and build
COPY . .
RUN npm run build

# Startup scripts: wait for postgres, run migrations, seed, then start
COPY wait-for-it.sh startup.relational.dev.sh /opt/
RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.dev.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.dev.sh

# Optional: ensure .env exists for container (compose typically injects env)
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi

ENV NODE_ENV=development
EXPOSE 3001

CMD ["/opt/startup.relational.dev.sh"]

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install
COPY . .

# Build-time env variables
ARG APP_URL
ARG DATABASE_URL
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
ARG GITHUB_CLIENT
ARG GITHUB_SECRET
ARG SECRET_KEY
ARG PEPPER
ARG EXCHANGE_RATE_API_KEY
ARG CRON_JOB_SECRET

# Set env variables
ENV APP_URL=${APP_URL} \
    DATABASE_URL=${DATABASE_URL} \
    SMTP_HOST=${SMTP_HOST} \
    SMTP_PORT=${SMTP_PORT} \
    SMTP_USERNAME=${SMTP_USERNAME} \
    SMTP_PASSWORD=${SMTP_PASSWORD} \
    GITHUB_CLIENT=${GITHUB_CLIENT} \
    GITHUB_SECRET=${GITHUB_SECRET} \
    SECRET_KEY=${SECRET_KEY} \
    PEPPER=${PEPPER} \
    EXCHANGE_RATE_API_KEY=${EXCHANGE_RATE_API_KEY} \
    CRON_JOB_SECRET=${CRON_JOB_SECRET}

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/prisma prisma/
COPY package.json .

COPY ./entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT [ "/app/entrypoint.sh" ]
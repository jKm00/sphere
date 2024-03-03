# Sphere

A web app for tracking subscriptions

## Stack

```
- Sveltekit   - Frontend/Backend
- Lucia       - Auth
- Prisma      - ORM
- PostgreSQL  - Database
```

## Repo structure

_This is a monorepo_

```
- apps          # All apps/service
  - sveltekit   # Frontend application
  - express     # Scheduler
```

## Getting started

### Prerequisite

- Docker
- Node

### Step by Step

1. Add `.env` file to the root and all the apps (see `.env.example`)
2. Run local dev database

```
docker-compose -f docker-compose.dev.yml up --build
```

3. Install dependencies

```
pnpm install
```

4. Generate Prisma client

```
pnpm prisma:generate
```

5. Apply migration to running db

```
pnpm prisma:deploy
```

6. Run application

```
pnpm --filter sveltekit dev
```

## Prisma Commands

### Create a migration

```
npx prisma migrate dev --name <name_of_migration>
```

### Generate / Update Prisma client

```
npx prisma generate
```

_Need to stop dev server before generating new client_

### Deploy migration to local db

```
npx prisma migrate deploy
```

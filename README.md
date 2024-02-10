# Sphere

A web app for tracking subscriptions

## Stack

```
- Sveltekit   - Frontend/Backend
- Lucia       - Auth
- Prisma      - ORM
- PostgreSQL  - Database
```

## Getting started

### Prerequisite

- Docker
- Node

### Step by Step

1. Add `.env` file (see `.env.example`)
2. Run database

```
docker compose up
```

3. Install dependencies

```
pnpm install
```

4. Generate Prisma client

```
npx prisma generate
```

5. Apply migration to running db

```
npx prisma migrate deploy
```

6. Run application

```
pnpm dev
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

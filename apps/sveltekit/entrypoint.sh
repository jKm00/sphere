#!/bin/sh
# entrypoint.sh

# Run prisma migrations
npx prisma migrate deploy

# Start application
ORIGIN="${ORIGIN}" node -r dotenv/config build

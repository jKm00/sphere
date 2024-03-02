#!/bin/sh
# entrypoint.sh

# Run prisma migrations
npx prisma migrate deploy

# Start application
node build
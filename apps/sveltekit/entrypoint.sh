#!/bin/sh

npx prisma migrate deploy

ORIGIN="${ORIGIN}" node build

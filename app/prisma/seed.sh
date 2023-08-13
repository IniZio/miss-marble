#!/bin/sh

set -ex

psql ${DB_URL} -f ./prisma/seed.sql
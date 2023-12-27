#!/bin/bash

# echo "drop database"
# docker exec -it postgres_container su - postgres -c "bash -c 'psql -U postgres -c \"DROP DATABASE localdb; \"'"

echo "create new database named localdb"

docker exec -it postgres_container su - postgres -c "bash -c 'psql -U postgres -c \"CREATE DATABASE localdb; \"'"

echo "echo copy file to postgres container"

docker cp /Users/vannguyen/src/take_home_projects/gantri/the-tate-collection.csv postgres_container:/usr/src/

echo "run checked in initial migrations"

npx prisma migrate dev --name 20231226214436_init

echo "import art collection csv raw data into localdb"

docker exec -it postgres_container su - postgres -c "bash -c 'psql -U postgres -d localdb -c \"\\copy tate_collection_art_data FROM '\''/usr/src/the-tate-collection.csv'\'' delimiter '\'','\'' CSV HEADER;\"'"

echo "setup done"
# Van's Gantri App

## API Endpoints

- /api/art - GET, view the entire art data set
- /api/art/ID - GET, view art data by ID
- /api/art/ID/comments - POST, add a comment for an art data entry
- /api/users - POST, create user
- /api/users - GET, see all users

## Installation

Gantri requires [Node.js](https://nodejs.org/) v20.10.0+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd gantri
npm i
```

## Postgres DB setup in Docker

[Install Docker](https://docs.docker.com/desktop/install/mac-install/) then pull and execute the postgres image with these params.

Note: Since this is a local project I am checking in non confidential information.
Normally passwords and secrets would be saved in an enviorment dependent .env file registered in the .gitignore that would be securely transfered and not checked into an application repo.

container name: postgres_container\
image name: postgres\
postgres password: mysecretpassword\
localhost port map: 5432

```sh
docker pull postgres
docker run --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

then to setup the database with the imported csv data run:

```sh
chmod +x bin/setup.sh

npm run setup
```
or
```sh
. bin/setup.sh
```

## Troubleshooting

If for any reason you need to start the setup again. Drop the database before running the setup script command.

```sh
docker exec -it postgres_container su - postgres -c "bash -c 'psql -U postgres -c \"DROP DATABASE localdb; \"'"
```

## Development and App start

Open your favorite Terminal and run these commands.

Start Local App Server:

```sh
npm start
```

## Tech

Gantri uses a number of open source projects to work properly:

- [Prisma](https://www.prisma.io/docs) - Object relational mapper for postgres database
- [Express](https://expressjs.com/en/api.html) - Node js web framework
- [Joi](https://joi.dev/api/?v=17.9.1) - Schema validation

## TODO
 - Add [Jest Testing](https://jestjs.io/) - Test framework for javascript
 - Add [SuperTest](https://www.npmjs.com/package/supertest) - npm module for testing HTTP endpoints
 - Setup test enviornment configuration
 - Create a test seed script
 - Write tests
 - Add script to package.json for executing jest tests with npm run test
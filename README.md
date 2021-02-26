# ADRS Next

A full stack, containerized JS/TS application for detecting and reporting potential vehicular accidents.

## Getting Started

First, make sure [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) are installed and that Docker Desktop/docker daemon is running.

Next, make a copy of the `example.env` file and name it `.env`. This is also the time to populate the ENV values in the newly created `.env` file (namely, SMTP Settings, Google App Secrets, and Google App ID)

Now comes the fun part, open a terminal and run.

```sh
docker-compose up
```

That command will get a PostgreSQL DB and a Nodejs server up and running.

You should be able to access your project at `http://localhost:3000` now.

Once the project is up and running, run the following command in a separate terminal to get the DB schema up on your brand-spanking-new database.

```sh
docker-compose exec app yarn migrate:run
```

Once you are done working on the project, simply close the running docker-compose session by pressing `Ctrl-C` in the terminal.

## Deployment

This project is currently deployed on [Vercel](https://vercel.com). For a Nextjs application such as this, this is honestly the easiest way to get it live, given that the platform is created by the same people that made Nextjs. You just configure the Environment Variables and Secrets on their platform, setup a domain and you're good to go.

> Note: Vercel does not offer DB hosting, so you'll have to figure that out on your own; I like AWS, but you could use any platform to do this, just make sure its using Postgres 12.

If you do require a custom solution, change the docker-compose file to your needs just make sure to set the build target to `production` for the app service and that should be good enough for most deployments.

## License

This project is licensed under the open-source, MIT license.

# cosmopolis
HTML Game about city management.

DEBUG=cosmopolis:* npm start

## Database creation

- Execute the psql in admin mode (as user postgres)

```sh

sudo -u postgres psql


```

- Create the database, ```please change the default password```

```SQL

CREATE USER cosmopolis WITH PASSWORD '9a917927-f88e-4819-9abb-97c52f56d3b8';
CREATE DATABASE cosmopolis;

```

- now you can login as a standard user with --username=cosmopolis

```sh

psql -h localhost --username=cosmopolis # this will ask for password

```

- List Tables

```postgresql

\dt


```

## Links

Preferred GUI client: https://www.beekeeperstudio.io/

ORM Docs https://sequelize.org/master/manual/getting-started.html

module.exports = {
  production: {
    client: 'pg',
    connection: {
      host: process.env.RDS_ENDPOINT,
      user: process.env.DB_MASTER_USER,
      password: process.env.DB_MASTER_PWD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './app/db/medic/migrations/',
      tableName: 'migrations',
    },
    seeds: {
      directory: './app/db/medic/seeds/',
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
  develop: {
    client: 'pg',
    connection: {
      host: process.env.RDS_ENDPOINT,
      user: process.env.DB_MASTER_USER,
      password: process.env.DB_MASTER_PWD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './app/db/medic/migrations/',
      tableName: 'migrations',
    },
    seeds: {
      directory: './app/db/medic/seeds/',
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
  // test: { Add test environment with sqlite3
  //   client: 'pg',
  //   connection: {
  //     host: process.env.RDS_ENDPOINT,
  //     user: process.env.DB_MASTER_USER,
  //     password: process.env.DB_MASTER_PWD,
  //     database: process.env.DB_NAME,
  //   },
  //   migrations: {
  //     directory: './app/db/medic/migrations/',
  //     tableName: 'migrations',
  //   },
  //   seeds: {
  //     directory: './app/db/medic/seeds/',
  //   },
  //   pool: {
  //     min: 0,
  //     max: 10,
  //   },
  // },
}

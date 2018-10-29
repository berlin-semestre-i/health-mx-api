module.exports = {
  db: {
    client: 'postgresql',
    connection: {
      host: process.env.RDS_ENDPOINT,
      user: process.env.DB_MASTER_USER,
      password: process.env.DB_MASTER_PWD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
}

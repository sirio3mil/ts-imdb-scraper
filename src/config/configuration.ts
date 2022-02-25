export default () => ({
  mssql: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    server: process.env.DATABASE_HOST,
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      max: 100,
      min: 0,
      idleTimeoutMillis: 300000,
    },
    options: {
      trustServerCertificate: true,
    },
  },
});

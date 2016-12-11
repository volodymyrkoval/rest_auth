module.exports = {
  app: {
    name: 'rest auth',
    port: process.env.NODE_APP_INSTANCE
  },
  db: {
    mongo: {
      scheme: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: 'restAPIApp'
    }
  },
  security: {
    salt: 'secure_salt'
  },
  latency: {
    host: 'google.com',
    pingAttempts: 10
  },
  debug: process.env.DEBUG
};
var path = require('path'),
    config;

config = {
    production: {
        url: 'http://localhost:3000',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost.db')
            },
            debug: false
        },

        server: {
            port: '3000',
            host: '0.0.0.0'
        }
    }
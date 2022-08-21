const dontenv = require('dotenv');
const assert = require('assert');
const database = require('mime-db');

dontenv.config();

const {PORT, HOST, HOST_URL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE,
    MYSQL_DB_PORT, MYSQL_HOST, TOKEN_KEY} = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    mysql: {
        host: MYSQL_HOST,
        port: MYSQL_DB_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE 
    },
    key: TOKEN_KEY
}
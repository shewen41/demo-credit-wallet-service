const config = require('../config');

//create connection
const knex = require('knex')({
    client: "mysql2",
    connection: {
        host : config.mysql.host,
        port : config.mysql.port,
        user : config.mysql.user,
        password : config.mysql.password,
        database : config.mysql.database
      },
      pool: { min: 0, max: 7 },
      useNullAsDefault: true
});

//check that connection is successful
knex.raw("SELECT VERSION()").then(() => {
    console.log('Connection to database successful');
});

module.exports = knex;
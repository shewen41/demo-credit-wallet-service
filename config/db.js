const config = require('../config');

//create connection
const knex = require('knex')({
    client: "mysql2",
    connection: {
        host : "us-cdbr-east-06.cleardb.net",
        //port : "22f4ff20",
        user : "b954fff20193fe",
        password : "22f4ff20",
        database : "heroku_9b05d74d2580fe8"
      },
      pool: { min: 0, max: 7 },
      useNullAsDefault: true
});

//check that connection is successful
knex.raw("SELECT VERSION()").then(() => {
    console.log('Connection to database successful');
});

module.exports = knex;
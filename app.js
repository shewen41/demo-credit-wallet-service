//require('./config/db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const accountRoutes = require('./routes/account-routes');


const app = express();

//app.use(cors);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(bodyParser.json());

app.listen(config.port, () => console.log('Server listening on port: '+ config.port));

app.use('/api', accountRoutes.routes);